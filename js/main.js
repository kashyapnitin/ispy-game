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

    // --- Mock Data (To be replaced by real JSON/fetch later) ---
    const toyNames = ["Red Ball", "Toy Train", "Teddy Bear", "Robot", "Rubber Duck", "Rocking Horse", "Blocks", "Toy Car", "Spinning Top", "Kite", "Doll", "Drum", "Airplane", "Xylophone"];

    // Sensible positions for Toy Shop (16:9 ratio, toys on shelves and floor)
    const positions = [
        { x: 34, y: 88, w: 6 }, // 0: Red Ball (floor front-left)
        { x: 50, y: 65, w: 12 },// 1: Toy Train (center table)
        { x: 10, y: 35, w: 8 }, // 2: Teddy Bear (shelf left)
        { x: 90, y: 35, w: 7 }, // 3: Robot (shelf right)
        { x: 16, y: 56, w: 6 }, // 4: Rubber Duck (shelf left lower)
        { x: 20, y: 82, w: 12 },// 5: Rocking Horse (floor left)
        { x: 65, y: 62, w: 8 }, // 6: Blocks (table right side)
        { x: 75, y: 85, w: 10 },// 7: Toy Car (floor right)
        { x: 40, y: 68, w: 5 }, // 8: Spinning Top (table front)
        { x: 8, y: 15, w: 8 },  // 9: Kite (wall/shelf top left)
        { x: 92, y: 56, w: 6 }, // 10: Doll (shelf right lower)
        { x: 12, y: 72, w: 7 }, // 11: Drum (floor far left)
        { x: 88, y: 15, w: 10 },// 12: Airplane (shelf top right)
        { x: 50, y: 88, w: 10 } // 13: Xylophone (center floor)
    ];

    const mockObjectsList = [];
    for (let i = 0; i < 14; i++) {
        mockObjectsList.push({
            id: `obj_${i}`,
            name: toyNames[i],
            x: positions[i].x,
            y: positions[i].y,
            w: positions[i].w,
            imgUrl: `assets/images/objects/obj_${i}.png` // Direct image link
        });
    }

    const SCENE_DATA = {
        "toyshop": {
            id: "toyshop",
            name: "Toy Shop",
            bgImage: "assets/images/scene_toyshop.jpg",
            origWidth: 1024,
            origHeight: 1024,
            objects: mockObjectsList
        },
        "kitchen": {
            id: "kitchen",
            name: "Kitchen",
            bgImage: "assets/images/scene_kitchen.jpg",
            origWidth: 1024,
            origHeight: 1024,
            objects: ["Apple", "Banana", "Mug", "Spoon", "Fork", "Plate", "Pot", "Pan", "Spatula", "Toaster", "Blender", "Oven Mitt", "Rolling Pin", "Whisk"].map((name, i) => ({
                id: `kit_${i}`,
                name: name,
                x: 10 + (i % 7) * 12, // simple grid positioning for placeholders
                y: 20 + Math.floor(i / 7) * 30, // simple grid positioning
                w: 7,
                imgUrl: `assets/images/objects/kitchen_${i}.png`
            }))
        },
        "playground": {
            id: "playground",
            name: "Playground",
            bgImage: "assets/images/scene_playground.jpg",
            origWidth: 1024,
            origHeight: 1024,
            objects: ["Slide", "Swing", "Sandbox", "Seesaw", "Ball", "Jump Rope", "Kite", "Bicycle", "Bench", "Tree", "Bird", "Cloud", "Sun", "Flower"].map((name, i) => ({
                id: `play_${i}`,
                name: name,
                x: 10 + (i % 7) * 12, // simple grid positioning for placeholders
                y: 20 + Math.floor(i / 7) * 30, // simple grid positioning
                w: 7,
                imgUrl: `assets/images/objects/playground_${i}.png`
            }))
        }
    };


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
            box.style.paddingTop = `${obj.w}%`; // 1:1 aspect ratio trick
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

    function setupSidebar() {
        gameState.objectsToFind.forEach(obj => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('target-item');
            itemElement.id = `sidebar-item-${obj.id}`;

            itemElement.innerHTML = `
                <img src="${obj.dataUrl || obj.imgUrl}" alt="${obj.name}" class="sprite-thumb">
                <span>${obj.name}</span>
            `;
            ui.targetList.appendChild(itemElement);
        });
    }

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

    function playSound(type, objName) {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'success') {
            // Verbal Reinforcement via Web Speech API
            if (objName && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel(); // kill any active speech so it stays snappy
                const utterance = new SpeechSynthesisUtterance("You found the " + objName);
                utterance.rate = 1.1;
                utterance.pitch = 1.2; // slight squeakier/kid-friendly voice
                window.speechSynthesis.speak(utterance);
            }

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
        ui.progressText.textContent = `${gameState.foundObjects.size} / ${gameState.objectsToFind.length} Found`;
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
