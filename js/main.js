/**
 * Main logical handling for I Spy Digital Game
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    const gameState = {
        currentSceneId: null,
        objectsToFind: [],
        foundObjects: new Set(),
        sceneData: null // Will hold raw JSON info for the loaded scene
    };

    // --- DOM Elements ---
    const screens = {
        menu: document.getElementById('main-menu'),
        loading: document.getElementById('loading'),
        game: document.getElementById('game-screen'),
        win: document.getElementById('win-screen')
    };

    const ui = {
        sceneContainer: document.getElementById('scene-container'),
        sceneWrapper: document.getElementById('scene-wrapper'),
        sceneImage: document.getElementById('scene-image'),
        hitboxesLayer: document.getElementById('hitboxes'),
        targetList: document.getElementById('target-list'),
        progressText: document.getElementById('progress-text'),
        confettiCanvas: document.getElementById('confetti-canvas')
    };

    // Audio Elements
    const audioItems = {
        success: document.getElementById('audio-success'),
        failure: document.getElementById('audio-failure'),
        win: document.getElementById('audio-win')
    };

    // Set audio volume lower so it's not piercing
    Object.values(audioItems).forEach(audio => {
        if (audio) audio.volume = 0.5;
    });

    // Audio context for synthesizing sounds (Web Audio API)
    let audioCtx = null;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Ensure data registries exist even if scripts fail
    window.ISPY_UI = window.ISPY_UI || { en: { found: "Found", findThese: "Find These!" } };
    window.ISPY_SCENES = window.ISPY_SCENES || {};

    // --- Aggregated Data ---
    const I18N_DICT = {};
    Object.keys(window.ISPY_UI).forEach(lang => {
        I18N_DICT[lang] = { ...window.ISPY_UI[lang] };
    });

    // Dynamically merge all scene-specific localized words into the master dictionary
    Object.values(window.ISPY_SCENES).forEach(scene => {
        if (scene.i18n) {
            Object.keys(scene.i18n).forEach(lang => {
                I18N_DICT[lang] = I18N_DICT[lang] || {};
                Object.assign(I18N_DICT[lang], scene.i18n[lang]);
            });
        }
    });

    const SCENE_DATA = window.ISPY_SCENES;

    // --- I18n State & Helpers ---
    let currentLang = 'en';

    // Helper to translate object names securely based on fallback keys
    const getI18nObjName = (name) => {
        const key = `obj_${name.replace(/ /g, "_")}`;
        return I18N_DICT[currentLang]?.[key] || I18N_DICT.en[key] || name;
    }

    // Update statically tagged i18n DOM nodes
    function updateDOMStrings() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (I18N_DICT[currentLang] && I18N_DICT[currentLang][key]) {
                el.innerText = I18N_DICT[currentLang][key];
            }
        });

        // Refresh dynamic UI elements if they are rendered
        if (ui.targetList && ui.targetList.children.length > 0) {
            setupSidebar();
        }
        if (gameState.currentSceneId) {
            updateProgress();
        }
    }

    // Bind dropdown listener
    document.getElementById('lang-select')?.addEventListener('change', (e) => {
        currentLang = e.target.value;
        updateDOMStrings();
    });

    // Run once on boot to set initial correct translations
    updateDOMStrings();
    // --- Core Functions ---

    function switchScreen(screenId) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[screenId].classList.add('active');
    }

    function initGame(sceneId) {
        switchScreen('loading');

        // Reset state
        gameState.currentSceneId = sceneId;
        gameState.foundObjects.clear();
        gameState.sceneData = SCENE_DATA[sceneId];

        // Randomize the positions of the objects
        const baseObjects = gameState.sceneData.objects;
        const shuffledPositions = baseObjects.map(o => ({ x: o.x, y: o.y, w: o.w })).sort(() => Math.random() - 0.5);

        // Map the shuffled positions back to the objects
        gameState.objectsToFind = baseObjects.map((obj, i) => {
            return {
                ...obj,
                x: shuffledPositions[i].x,
                y: shuffledPositions[i].y,
                w: shuffledPositions[i].w
            };
        });

        // Clear DOM
        ui.hitboxesLayer.innerHTML = '';
        ui.targetList.innerHTML = '';

        let loadedAssets = 0;

        // Track promises for all assets
        const assetPromises = [];

        // Preload main background
        assetPromises.push(new Promise((resolve) => {
            const bgImg = new Image();
            bgImg.onload = () => {
                ui.sceneImage.src = bgImg.src;
                // Dynamically capture the aspect ratio from the actual loaded image!
                gameState.sceneData.origWidth = bgImg.naturalWidth || 1024;
                gameState.sceneData.origHeight = bgImg.naturalHeight || 1024;
                resolve();
            };
            bgImg.onerror = resolve; // Resolve anyway to prevent infinite loading screen
            bgImg.src = gameState.sceneData.bgImage;
        }));

        // Preload and process all individual object images for real transparency
        gameState.objectsToFind.forEach(obj => {
            assetPromises.push(new Promise((resolve) => {
                const img = new Image();
                // Ensure we handle crossOrigin just in case we add remote scene CDN later
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    // Ensure true white-pixels become transparent alpha
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    try {
                        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imgData.data;
                        for (let i = 0; i < data.length; i += 4) {
                            // threshold for "pure white or almost white"
                            if (data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235) {
                                data[i + 3] = 0; // Alpha 0
                            }
                        }
                        ctx.putImageData(imgData, 0, 0);
                        obj.dataUrl = canvas.toDataURL('image/png');
                    } catch (e) {
                        // Fallback in case of absolute cross-origin taint failure
                        console.error("Canvas taint error:", e);
                        obj.dataUrl = obj.imgUrl;
                    }
                    resolve();
                };
                img.onerror = () => {
                    // Fallback to straight URL if canvas processing fails (e.g. 404 missing image)
                    obj.dataUrl = obj.imgUrl;
                    resolve();
                }
                img.src = obj.imgUrl;
            }));
        });

        // Wait for all assets to load/fail, then boot the scene
        Promise.all(assetPromises).then(() => {
            setupScene();
            setupSidebar();
            updateProgress();

            // Generic click on scene for misses
            ui.sceneWrapper.addEventListener('click', handleSceneClick);

            // Switch screen FIRST so it has layout dimensions for the resize calculation
            switchScreen('game');

            // Adjust scale initially
            handleResize();
            window.addEventListener('resize', handleResize);
        });
    }

    function handleResize() {
        if (!gameState.sceneData) return;

        const containerW = ui.sceneContainer.clientWidth;
        const containerH = ui.sceneContainer.clientHeight;
        const origW = gameState.sceneData.origWidth;
        const origH = gameState.sceneData.origHeight;

        // Resize confetti canvas explicitly here, where sceneContainer is guaranteed to have dimensions
        if (containerW > 0 && containerH > 0) {
            ui.confettiCanvas.width = containerW;
            ui.confettiCanvas.height = containerH;
        }

        // Calculate scale to fit within container (Contain logic)
        const scaleX = containerW / origW;
        const scaleY = containerH / origH;
        const scale = Math.min(scaleX, scaleY) * 0.95; // 0.95 gives a little padding

        // Apply scaling
        ui.sceneWrapper.style.width = `${origW}px`;
        ui.sceneWrapper.style.height = `${origH}px`;
        ui.sceneWrapper.style.transform = `scale(${scale})`;
        ui.sceneWrapper.style.setProperty('--inverse-scale', 1 / scale);
    }

    function setupScene() {
        gameState.objectsToFind.forEach(obj => {
            const box = document.createElement('div');
            box.classList.add('hitbox', 'sprite-render');
            box.dataset.id = obj.id;

            // Positioning based on percentages
            box.style.left = `${obj.x}%`;
            box.style.top = `${obj.y}%`;
            box.style.width = `${obj.w}%`;
            box.style.transform = 'translate(-50%, -50%)';

            // Apply the individual image URL directly as the background image
            box.style.backgroundImage = `url(${obj.dataUrl || obj.imgUrl})`;
            box.style.backgroundSize = 'contain';
            box.style.backgroundPosition = 'center center';
            box.style.backgroundRepeat = 'no-repeat';

            // Add a soft white glow so the object gently pops out of the busy background
            // making it easier for toddlers to spot without looking artificially bright
            box.style.filter = 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.9))';

            box.addEventListener('click', (e) => handleObjectClick(e, obj));

            ui.hitboxesLayer.appendChild(box);
        });
    }

    const sidebarTapCounts = new Map();

    function setupSidebar() {
        ui.targetList.innerHTML = '';
        sidebarTapCounts.clear();

        gameState.objectsToFind.forEach(obj => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('target-item');
            itemElement.id = `sidebar-item-${obj.id}`;

            const locName = getI18nObjName(obj.name);

            itemElement.innerHTML = `
                <img src="${obj.dataUrl || obj.imgUrl}" alt="${locName}" class="sprite-thumb">
                <span>${locName}</span>
            `;

            // Hint interaction
            itemElement.addEventListener('click', () => {
                if (gameState.foundObjects.has(obj.id)) return;

                // Sidebar animation
                itemElement.classList.add('hint-anim');
                setTimeout(() => itemElement.classList.remove('hint-anim'), 400);

                // Speak hint
                speakPhrase('hint', obj.name);

                // Track taps for scene hint
                const currentTaps = (sidebarTapCounts.get(obj.id) || 0) + 1;
                sidebarTapCounts.set(obj.id, currentTaps);

                if (currentTaps >= 3) {
                    const hitbox = document.querySelector(`.hitbox[data-id="${obj.id}"]`);
                    if (hitbox) {
                        hitbox.classList.add('scene-hint-anim');
                        setTimeout(() => hitbox.classList.remove('scene-hint-anim'), 1000);
                    }
                    sidebarTapCounts.set(obj.id, 0); // reset
                }
            });

            ui.targetList.appendChild(itemElement);
        });
    }

    // Removed dynamic systemVoices loading as we now use pre-generated MP3s

    function handleObjectClick(e, obj) {
        initAudio(); // Ensure audio context is unlocked
        e.stopPropagation(); // Prevent triggering the miss handler

        if (gameState.foundObjects.has(obj.id)) return; // Already found

        // Mark as found
        gameState.foundObjects.add(obj.id);

        // Visual effects on hitbox
        const hitbox = e.currentTarget;
        hitbox.classList.add('found', 'found-anim');

        // Update Sidebar visually
        const sidebarItem = document.getElementById(`sidebar-item-${obj.id}`);
        sidebarItem.classList.add('found', 'recently-found');
        setTimeout(() => sidebarItem.classList.remove('recently-found'), 1000);

        // Success Feedback
        playSound('success', obj.name);
        triggerConfetti(e.clientX, e.clientY); // pass screen coords for local confetti
        updateProgress();

        // Check Win Condition
        if (gameState.foundObjects.size === gameState.objectsToFind.length) {
            setTimeout(triggerWinScreen, 1500);
        }
    }

    function handleSceneClick(e) {
        initAudio(); // User interaction unlocks audio
        // If clicking on scene wrapper but not a hitbox
        if (!e.target.classList.contains('hitbox')) {
            playSound('failure');
        }
    }

    // Keep track of the currently playing TTS audio so we can interrupt it if necessary
    let currentVoiceAudio = null;

    function speakPhrase(phraseType, objName) {
        if (!objName) return;

        // Interrupt any currently playing TTS
        if (currentVoiceAudio) {
            currentVoiceAudio.pause();
            currentVoiceAudio.currentTime = 0;
        }

        // Statically generated fallback paths
        // Spaces are replaced with underscores matching the Python script
        const sanitizedObjName = objName.replace(/ /g, "_");
        const audioPath = `assets/audio/voices/${currentLang}/${phraseType}_${sanitizedObjName}.mp3`;

        currentVoiceAudio = new Audio(audioPath);
        currentVoiceAudio.play().catch(err => {
            console.warn(`Could not play static audio file ${audioPath}:`, err);
        });
    }

    function playSound(type, objName) {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'success') {
            speakPhrase('found', objName);

            // High-pitched synth "Clap/bell" sound
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.6, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'failure') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'win') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.1);
            osc.frequency.setValueAtTime(783.99, now + 0.2);
            osc.frequency.setValueAtTime(1046.50, now + 0.3);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
            osc.start(now);
            osc.stop(now + 1.0);
        }
    }

    function triggerConfetti(x, y) {
        if (window.burstConfetti) {
            window.burstConfetti(x, y);
        }
    }

    function updateProgress() {
        const foundCount = gameState.foundObjects.size;
        const totalCount = gameState.objectsToFind.length;
        const foundLabel = I18N_DICT[currentLang].found || I18N_DICT.en.found;
        ui.progressText.innerHTML = `${foundCount} / ${totalCount} <span data-i18n="found">${foundLabel}</span>`;
    }

    function triggerWinScreen() {
        playSound('win');
        switchScreen('win');
        window.removeEventListener('resize', handleResize);
        ui.sceneWrapper.removeEventListener('click', handleSceneClick);
        if (window.startWinConfetti) {
            window.startWinConfetti();
        }
    }

    function resetToMenu() {
        if (window.stopWinConfetti) window.stopWinConfetti();
        switchScreen('menu');
        window.removeEventListener('resize', handleResize);
        if (ui.sceneWrapper) ui.sceneWrapper.removeEventListener('click', handleSceneClick);
    }


    // --- Event Listeners ---

    // Carousel Selection
    const sceneSelection = document.getElementById('scene-selection');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (sceneSelection && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            sceneSelection.scrollBy({ left: -200, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            sceneSelection.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }

    // Scene Selection Buttons
    document.querySelectorAll('.scene-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sceneId = e.currentTarget.dataset.scene;
            initGame(sceneId);
        });
    });

    // In-game Back Button
    document.getElementById('back-to-menu-btn').addEventListener('click', resetToMenu);

    // Win Screen Buttons
    document.getElementById('play-again-btn').addEventListener('click', () => {
        if (window.stopWinConfetti) window.stopWinConfetti();
        initGame(gameState.currentSceneId); // Restart current scene
    });

    document.getElementById('win-menu-btn').addEventListener('click', resetToMenu);

    // Default init behavior: Ensure menu is showing
    switchScreen('menu');
});
