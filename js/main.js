/**
 * Main logical handling for I Spy Digital Game
 */

document.addEventListener('DOMContentLoaded', () => {
    const DEV_HOTSPOTS = window.location.search.includes('devHotspots=1');
    // --- State ---
    const HOTSPOT_SOURCES = {
        playground: 'scripts/playground_hotspots.json',
        toyshop: 'scripts/toyshop_hotspots.json',
        kitchen: 'scripts/kitchen_hotspots.json',
        beach: 'scripts/beach_hotspots.json',
    };
    const gameState = {
        currentSceneId: null,
        objectsToFind: [],
        foundObjects: new Set(),
        sceneData: null,
        timerStart: null,
        timerInterval: null
    };

    // --- Preferences (persisted) ---
    const PREFS_KEYS = { timerOn: 'ispy_timerOn', gameMode: 'ispy_gameMode' };
    const prefs = {
        timerOn: false,
        gameMode: 'easy'
    };
    function loadPrefs() {
        try {
            const storedTimer = localStorage.getItem(PREFS_KEYS.timerOn);
            if (storedTimer !== null) prefs.timerOn = storedTimer === 'true';
            const storedMode = localStorage.getItem(PREFS_KEYS.gameMode);
            if (storedMode === 'easy' || storedMode === 'hard') prefs.gameMode = storedMode;
        } catch (e) {}
    }
    function savePrefs() {
        try {
            localStorage.setItem(PREFS_KEYS.timerOn, String(prefs.timerOn));
            localStorage.setItem(PREFS_KEYS.gameMode, prefs.gameMode);
        } catch (e) {}
    }

    // --- Personal best times (per scene + mode, persisted) ---
    const BEST_TIMES_KEY = 'ispy_bestTimes';
    let bestTimes = {}; // { [sceneId]: { easy?: number, hard?: number } } in seconds

    function loadBestTimes() {
        try {
            const raw = localStorage.getItem(BEST_TIMES_KEY);
            if (raw) bestTimes = JSON.parse(raw);
            if (typeof bestTimes !== 'object' || bestTimes === null) bestTimes = {};
        } catch (e) {
            bestTimes = {};
        }
    }

    function saveBestTimes() {
        try {
            localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(bestTimes));
        } catch (e) {}
    }

    function formatSecondsToTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

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
        gameTimer: document.getElementById('game-timer'),
        winTimeMessage: document.getElementById('win-time-message'),
        winPersonalBestMessage: document.getElementById('win-personal-best-message'),
        confettiCanvas: document.getElementById('confetti-canvas'),
        toggleEasy: document.getElementById('toggle-easy'),
        toggleHard: document.getElementById('toggle-hard'),
        toggleTimerOff: document.getElementById('toggle-timer-off'),
        toggleTimerOn: document.getElementById('toggle-timer-on')
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

    const MENU_THEME_CLASSES = [
        'menu-theme-sky',
        'menu-theme-meadow',
        'menu-theme-sunset',
        'menu-theme-ocean',
        'menu-theme-candy',
        'menu-theme-playroom'
    ];
    let currentMenuTheme = null;

    // --- I18n State & Helpers ---
    let currentLang = 'en';

    // Helper to translate object names securely based on fallback keys
    const getI18nObjName = (name) => {
        const key = `obj_${name.replace(/ /g, "_")}`;
        return I18N_DICT[currentLang]?.[key] || I18N_DICT.en[key] || name;
    }

    // Update statically tagged i18n DOM nodes (fallback to English if key missing in locale)
    function updateDOMStrings() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = (I18N_DICT[currentLang] && I18N_DICT[currentLang][key]) ||
                (I18N_DICT.en && I18N_DICT.en[key]);
            if (text) el.innerText = text;
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

    loadPrefs();
    loadBestTimes();

    function syncTogglesFromPrefs() {
        [ui.toggleEasy, ui.toggleHard].forEach(el => {
            if (!el) return;
            el.classList.toggle('active', (el.getAttribute('data-value') === prefs.gameMode));
        });
        ui.toggleTimerOff && (ui.toggleTimerOff.classList.toggle('active', !prefs.timerOn));
        ui.toggleTimerOn && (ui.toggleTimerOn.classList.toggle('active', prefs.timerOn));
    }

    ui.toggleEasy?.addEventListener('click', () => { prefs.gameMode = 'easy'; savePrefs(); syncTogglesFromPrefs(); });
    ui.toggleHard?.addEventListener('click', () => { prefs.gameMode = 'hard'; savePrefs(); syncTogglesFromPrefs(); });
    ui.toggleTimerOff?.addEventListener('click', () => { prefs.timerOn = false; savePrefs(); syncTogglesFromPrefs(); });
    ui.toggleTimerOn?.addEventListener('click', () => { prefs.timerOn = true; savePrefs(); syncTogglesFromPrefs(); });

    // Run once on boot to set initial correct translations
    updateDOMStrings();
    syncTogglesFromPrefs();
    // --- Core Functions ---

    function applyRandomMenuTheme() {
        const menuEl = screens.menu;
        if (!menuEl || !MENU_THEME_CLASSES.length) return;
        if (currentMenuTheme) {
            menuEl.classList.remove(currentMenuTheme);
        }
        const choices = MENU_THEME_CLASSES.filter(c => c !== currentMenuTheme);
        const next =
            choices[Math.floor(Math.random() * choices.length)] ||
            MENU_THEME_CLASSES[0];
        menuEl.classList.add(next);
        currentMenuTheme = next;
    }

    function switchScreen(screenId) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[screenId].classList.add('active');

        if (screenId === 'menu') {
            applyRandomMenuTheme();
            syncTogglesFromPrefs();
        }
        // Show language selector only on main menu for a cleaner in-game UI.
        const langHeader = document.querySelector('.app-header');
        if (langHeader) {
            langHeader.style.display = (screenId === 'menu') ? 'block' : 'none';
        }
    }

    function initGame(sceneId) {
        switchScreen('loading');

        // Reset state
        gameState.currentSceneId = sceneId;
        gameState.foundObjects.clear();
        gameState.sceneData = SCENE_DATA[sceneId];

        const sceneData = gameState.sceneData;

        // If this scene declares an external hotspot source (JSON generated by
        // the bbox_editor.py tool), load it once and then re-enter initGame.
        const hotspotSource = HOTSPOT_SOURCES[sceneId];
        if (hotspotSource && !sceneData.allObjectsLoaded) {
            fetch(hotspotSource)
                .then(res => res.json())
                .then(list => {
                    sceneData.allObjects = (list || []).map(item => ({
                        id: item.id,
                        name: item.name,
                        bbox: item.bbox,
                        priority: item.priority ?? 1,
                    }));
                    sceneData.allObjectsLoaded = true;
                    initGame(sceneId);
                })
                .catch(err => {
                    console.error('Failed to load hotspot JSON for scene', sceneId, err);
                    sceneData.allObjectsLoaded = true; // avoid infinite loop
                    initGame(sceneId); // fall back to any statically-defined allObjects/objects
                });
            return;
        }

        const hasHotspots = Array.isArray(sceneData.allObjects) && sceneData.allObjects.length > 0;

        if (!hasHotspots) {
            console.error('Scene is missing hotspot allObjects data; cannot start scene:', sceneId);
            switchScreen('menu');
            return;
        }

        // Hotspot-only scenes: randomly select a subset of allObjects.
        const pool = [...sceneData.allObjects];
        pool.sort(() => Math.random() - 0.5);
        const activeCount = sceneData.activeCount || pool.length;
        gameState.objectsToFind = pool.slice(0, activeCount);

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
                sceneData.origWidth = bgImg.naturalWidth || 1024;
                sceneData.origHeight = bgImg.naturalHeight || 1024;
                sceneData.bgImg = bgImg;
                resolve();
            };
            bgImg.onerror = resolve; // Resolve anyway to prevent infinite loading screen
            bgImg.src = sceneData.bgImage;
        }));

        // Legacy sprite overlays are no longer used; all scenes must provide hotspot data.

        // Wait for all assets to load/fail, then boot the scene
        Promise.all(assetPromises).then(() => {
            setupScene();
            setupSidebar();
            updateProgress();

            // Generic click on scene for misses
            ui.sceneWrapper.addEventListener('click', handleSceneClick);

            // Switch screen FIRST so it has layout dimensions for the resize calculation
            switchScreen('game');

            if (prefs.timerOn) {
                if (gameState.timerInterval) clearInterval(gameState.timerInterval);
                gameState.timerStart = Date.now();
                if (ui.gameTimer) ui.gameTimer.style.display = '';
                function formatElapsed(ms) {
                    const totalSeconds = Math.floor(ms / 1000);
                    const m = Math.floor(totalSeconds / 60);
                    const s = totalSeconds % 60;
                    return m + ':' + (s < 10 ? '0' : '') + s;
                }
                function tickTimer() {
                    if (!ui.gameTimer || !gameState.timerStart) return;
                    ui.gameTimer.textContent = formatElapsed(Date.now() - gameState.timerStart);
                }
                tickTimer();
                gameState.timerInterval = setInterval(tickTimer, 1000);
            } else {
                if (gameState.timerInterval) clearInterval(gameState.timerInterval);
                gameState.timerInterval = null;
                gameState.timerStart = null;
                if (ui.gameTimer) ui.gameTimer.style.display = 'none';
            }

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
        const sceneData = gameState.sceneData;
        const hasHotspots = Array.isArray(sceneData.allObjects) && sceneData.allObjects.length > 0;

        if (hasHotspots) {
            // Hotspot-only scenes: draw transparent hitboxes based on bounding boxes.
            gameState.objectsToFind.forEach(obj => {
                const box = document.createElement('div');
                box.classList.add('hitbox');
                box.dataset.id = obj.id;

                const { x1, y1, x2, y2 } = obj.bbox;
                const centerX = (x1 + x2) / 2;
                const centerY = (y1 + y2) / 2;
                const width = (x2 - x1);
                const height = (y2 - y1);

                box.style.left = `${centerX}%`;
                box.style.top = `${centerY}%`;
                box.style.width = `${width}%`;
                box.style.height = `${height}%`;
                box.style.transform = 'translate(-50%, -50%)';

                // In dev mode, make hotspots visually obvious.
                if (DEV_HOTSPOTS) {
                    box.style.outline = '2px solid rgba(0, 255, 0, 0.7)';
                    box.style.backgroundColor = 'rgba(0, 255, 0, 0.15)';
                }

                box.addEventListener('click', (e) => handleObjectClick(e, obj));

                ui.hitboxesLayer.appendChild(box);
            });
        } else {
            // Legacy sprite-based scenes
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
    }

    const sidebarTapCounts = new Map();

    function showObjectPopout(obj) {
        const sceneData = gameState.sceneData;
        if (!sceneData || !obj.bbox || !sceneData.bgImg) return;

        const { x1, y1, x2, y2 } = obj.bbox;
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const width = (x2 - x1) * 1.4;
        const height = (y2 - y1) * 1.4;

        const pop = document.createElement('div');
        pop.classList.add('popout-object');
        pop.style.left = `${centerX}%`;
        pop.style.top = `${centerY}%`;
        pop.style.width = `${width}%`;
        pop.style.height = `${height}%`;
        pop.style.transform = 'translate(-50%, -50%)';
        if (obj.dataUrl) {
            pop.style.backgroundImage = `url(${obj.dataUrl})`;
        } else if (obj.imgUrl) {
            pop.style.backgroundImage = `url(${obj.imgUrl})`;
        }

        ui.sceneWrapper.appendChild(pop);
        setTimeout(() => {
            if (pop.parentNode) pop.parentNode.removeChild(pop);
        }, 1300);
    }

    function setupSidebar() {
        ui.targetList.innerHTML = '';
        ui.targetList.scrollLeft = 0;
        ui.targetList.scrollTop = 0;
        sidebarTapCounts.clear();

        gameState.objectsToFind.forEach(obj => {
            // For hotspot-only scenes, derive thumbnails by cropping from the background.
            if (!obj.dataUrl && obj.bbox && gameState.sceneData.bgImg) {
                try {
                    const bgImg = gameState.sceneData.bgImg;
                    const origW = gameState.sceneData.origWidth;
                    const origH = gameState.sceneData.origHeight;
                    const { x1, y1, x2, y2 } = obj.bbox;
                    const cropX = (x1 / 100) * origW;
                    const cropY = (y1 / 100) * origH;
                    const cropW = ((x2 - x1) / 100) * origW;
                    const cropH = ((y2 - y1) / 100) * origH;

                    const canvas = document.createElement('canvas');
                    canvas.width = cropW;
                    canvas.height = cropH;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(bgImg, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
                    obj.dataUrl = canvas.toDataURL('image/png');
                } catch (e) {
                    console.error('Failed to generate thumbnail from background for', obj.name, e);
                }
            }
            const itemElement = document.createElement('div');
            itemElement.classList.add('target-item');
            itemElement.id = `sidebar-item-${obj.id}`;

            const locName = getI18nObjName(obj.name);

            itemElement.innerHTML = `
                <img src="${obj.dataUrl || obj.imgUrl}" alt="${locName}" class="sprite-thumb">
                <span>${locName}</span>
            `;

            if (gameState.foundObjects.has(obj.id)) {
                itemElement.classList.add('found');
            }

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
                        setTimeout(() => hitbox.classList.remove('scene-hint-anim'), 800);
                    }
                    showObjectPopout(obj);
                    sidebarTapCounts.set(obj.id, 0); // reset
                }
            });

            ui.targetList.appendChild(itemElement);
        });
    }

    function scrollToFirstUnfoundSidebarItem() {
        const container = ui.targetList;
        if (!container) return;

        const items = Array.from(container.querySelectorAll('.target-item'));
        if (!items.length) return;

        const next = items.find(el => !el.classList.contains('found'));
        if (!next) return;

        const hasHorizontal = container.scrollWidth > container.clientWidth + 1;
        const hasVertical = container.scrollHeight > container.clientHeight + 1;

        // Only adjust scroll when there is actual overflow in at least one direction
        if (!hasHorizontal && !hasVertical) return;

        if (hasHorizontal) {
            const itemCenter = next.offsetLeft + next.offsetWidth / 2;
            const targetScrollLeft = itemCenter - container.clientWidth / 2;
            container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        } else if (hasVertical) {
            const itemCenter = next.offsetTop + next.offsetHeight / 2;
            const targetScrollTop = itemCenter - container.clientHeight / 2;
            container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
        }
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
        showObjectPopout(obj);
        playSound('success', obj.name);

        // Confetti from the center of the found object, aligned with the scene canvas
        const boxRect = hitbox.getBoundingClientRect();
        const centerX = boxRect.left + boxRect.width / 2;
        const centerY = boxRect.top + boxRect.height / 2;
        triggerConfetti(centerX, centerY);
        triggerHaptic();
        updateProgress();

        scrollToFirstUnfoundSidebarItem();

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

        // Optional developer helper: click-to-measure hotspot bounding boxes.
        // When devHotspots=1 is present in the URL, every *pair* of clicks
        // on the scene wrapper logs a suggested bbox in percentage coords.
        if (DEV_HOTSPOTS) {
            if (!ui.sceneImage) return;
            const rect = ui.sceneImage.getBoundingClientRect();
            const xPct = ((e.clientX - rect.left) / rect.width) * 100;
            const yPct = ((e.clientY - rect.top) / rect.height) * 100;

            if (!window.__devHotspotAnchor) {
                window.__devHotspotAnchor = { x: xPct, y: yPct };
                console.log('DEV hotspot anchor set at:', window.__devHotspotAnchor);
            } else {
                const a = window.__devHotspotAnchor;
                const x1 = Math.min(a.x, xPct).toFixed(1);
                const y1 = Math.min(a.y, yPct).toFixed(1);
                const x2 = Math.max(a.x, xPct).toFixed(1);
                const y2 = Math.max(a.y, yPct).toFixed(1);
                console.log(`DEV bbox suggestion -> bbox: { x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2} }`);
                window.__devHotspotAnchor = null;
            }
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

    // Lightweight haptic feedback using the Web Vibration API where available.
    // This keeps the project build-less while still giving mobile users a tactile success ping.
    function triggerHaptic(pattern = [10, 40, 20]) {
        if (navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore unsupported or blocked vibration calls
            }
        }
    }

    function updateProgress() {
        const foundCount = gameState.foundObjects.size;
        const totalCount = gameState.objectsToFind.length;
        const foundLabel = I18N_DICT[currentLang].found || I18N_DICT.en.found;
        ui.progressText.innerHTML = `${foundCount} / ${totalCount} <span data-i18n="found">${foundLabel}</span>`;
    }

    function triggerWinScreen() {
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;
        }
        if (ui.winTimeMessage) {
            if (prefs.timerOn) {
                const elapsedMs = gameState.timerStart ? Date.now() - gameState.timerStart : 0;
                const totalSeconds = Math.floor(elapsedMs / 1000);
                const timeStr = formatSecondsToTime(totalSeconds);
                const winTimeTemplate =
                    (I18N_DICT[currentLang] && I18N_DICT[currentLang].winTime) ||
                    (I18N_DICT.en && I18N_DICT.en.winTime) ||
                    'You found all the objects in {time}.';
                const base = winTimeTemplate.replace('{time}', timeStr);
                ui.winTimeMessage.textContent = `${base} ⏱️🎉`;
                ui.winTimeMessage.style.display = '';
            } else {
                ui.winTimeMessage.textContent = '';
                ui.winTimeMessage.style.display = 'none';
            }
        }

        if (ui.winPersonalBestMessage) {
            if (prefs.timerOn && gameState.currentSceneId) {
                const elapsedMs = gameState.timerStart ? Date.now() - gameState.timerStart : 0;
                const currentSeconds = Math.floor(elapsedMs / 1000);
                const sceneId = gameState.currentSceneId;
                const mode = prefs.gameMode;
                const sceneBests = bestTimes[sceneId] || {};
                const previousBest = sceneBests[mode];
                const isNewBest = previousBest == null || currentSeconds <= previousBest;

                if (isNewBest) {
                    if (!bestTimes[sceneId]) bestTimes[sceneId] = {};
                    bestTimes[sceneId][mode] = currentSeconds;
                    saveBestTimes();
                    const msg =
                        (I18N_DICT[currentLang] && I18N_DICT[currentLang].winPersonalBest) ||
                        (I18N_DICT.en && I18N_DICT.en.winPersonalBest) ||
                        'Well done, this is your personal best time!';
                    ui.winPersonalBestMessage.textContent = `${msg} 🏅✨`;
                } else {
                    const bestStr = formatSecondsToTime(previousBest);
                    const template =
                        (I18N_DICT[currentLang] && I18N_DICT[currentLang].winPersonalBestIs) ||
                        (I18N_DICT.en && I18N_DICT.en.winPersonalBestIs) ||
                        'Your personal best is {time}.';
                    const base = template.replace('{time}', bestStr);
                    ui.winPersonalBestMessage.textContent = `${base} 🏅`;
                }
                ui.winPersonalBestMessage.style.display = '';
            } else {
                ui.winPersonalBestMessage.textContent = '';
                ui.winPersonalBestMessage.style.display = 'none';
            }
        }

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
        if (ui.sceneWrapper) {
            ui.sceneWrapper.removeEventListener('click', handleSceneClick);
            // Clear out scene-specific DOM and transform so the next entry starts from a clean state
            ui.hitboxesLayer.innerHTML = '';
            ui.sceneImage.src = '';
            ui.sceneWrapper.style.transform = '';
            ui.sceneWrapper.style.width = '';
            ui.sceneWrapper.style.height = '';
            ui.sceneWrapper.style.removeProperty('--inverse-scale');
        }
        // Reset game state so subsequent scene loads recompute layout and scaling correctly
        gameState.currentSceneId = null;
        gameState.sceneData = null;
        gameState.objectsToFind = [];
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

    function cleanupSceneLayout() {
        window.removeEventListener('resize', handleResize);
        if (ui.sceneWrapper) {
            ui.sceneWrapper.removeEventListener('click', handleSceneClick);
            ui.hitboxesLayer.innerHTML = '';
            ui.sceneImage.src = '';
            ui.sceneWrapper.style.transform = '';
            ui.sceneWrapper.style.width = '';
            ui.sceneWrapper.style.height = '';
            ui.sceneWrapper.style.removeProperty('--inverse-scale');
        }
    }

    // Win Screen Buttons
    document.getElementById('play-again-btn').addEventListener('click', () => {
        if (window.stopWinConfetti) window.stopWinConfetti();
        cleanupSceneLayout();
        if (gameState.currentSceneId) {
            initGame(gameState.currentSceneId); // Restart current scene
        }
    });

    document.getElementById('win-menu-btn').addEventListener('click', () => {
        cleanupSceneLayout();
        resetToMenu();
    });

    // Default init behavior: Ensure menu is showing
    switchScreen('menu');
});
