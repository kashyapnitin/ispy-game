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

    // --- I18N Translations Dictionary ---
    const I18N_DICT = {
        en: {
            // UI
            title: "I Spy...",
            subtitle: "Can you find all the hidden objects?",
            findThese: "Find These!",
            found: "Found",
            backToMenu: "Back to Menu",
            winTitle: "You found them all!",
            winSubtitle: "Great job finding all the hidden objects.",
            playAgain: "Play Again",
            mainMenu: "Main Menu",
            sceneToyshop: "Toy Shop",
            sceneKitchen: "Kitchen",
            scenePlayground: "Playground",
            // Toy Shop
            obj_Red_Ball: "Red Ball", obj_Toy_Train: "Toy Train", obj_Teddy_Bear: "Teddy Bear", obj_Robot: "Robot", obj_Rubber_Duck: "Rubber Duck", obj_Rocking_Horse: "Rocking Horse", obj_Blocks: "Blocks", obj_Toy_Car: "Toy Car", obj_Spinning_Top: "Spinning Top", obj_Kite: "Kite", obj_Doll: "Doll", obj_Drum: "Drum", obj_Airplane: "Airplane", obj_Xylophone: "Xylophone",
            // Kitchen
            obj_Apple: "Apple", obj_Banana: "Banana", obj_Mug: "Mug", obj_Spoon: "Spoon", obj_Fork: "Fork", obj_Plate: "Plate", obj_Pot: "Pot", obj_Pan: "Pan", obj_Spatula: "Spatula", obj_Toaster: "Toaster", obj_Blender: "Blender", obj_Oven_Mitt: "Oven Mitt", obj_Rolling_Pin: "Rolling Pin", obj_Whisk: "Whisk",
            // Playground
            obj_Slide: "Slide", obj_Swing: "Swing", obj_Sandbox: "Sandbox", obj_Seesaw: "Seesaw", obj_Ball: "Ball", obj_Jump_Rope: "Jump Rope", obj_KitePg: "Kite", obj_Bicycle: "Bicycle", obj_Bench: "Bench", obj_Tree: "Tree", obj_Bird: "Bird", obj_Cloud: "Cloud", obj_Sun: "Sun", obj_Flower: "Flower"
        },
        es: {
            title: "Veo, veo...",
            subtitle: "¿Puedes encontrar todos los objetos ocultos?",
            findThese: "¡Encuentra estos!",
            found: "Encontrados",
            backToMenu: "Volver al Menú",
            winTitle: "¡Los encontraste todos!",
            winSubtitle: "Gran trabajo encontrando todos los objetos ocultos.",
            playAgain: "Jugar de Nuevo",
            mainMenu: "Menú Principal",
            sceneToyshop: "Tienda de Juguetes",
            sceneKitchen: "Cocina",
            scenePlayground: "Parque",
            // Toy Shop
            obj_Red_Ball: "Pelota Roja", obj_Toy_Train: "Tren de Juguete", obj_Teddy_Bear: "Osito de Peluche", obj_Robot: "Robot", obj_Rubber_Duck: "Pato de Goma", obj_Rocking_Horse: "Caballo Balancín", obj_Blocks: "Bloques", obj_Toy_Car: "Coche de Juguete", obj_Spinning_Top: "Peonza", obj_Kite: "Cometa", obj_Doll: "Muñeca", obj_Drum: "Tambor", obj_Airplane: "Avión", obj_Xylophone: "Xilófono",
            // Kitchen
            obj_Apple: "Manzana", obj_Banana: "Plátano", obj_Mug: "Taza", obj_Spoon: "Cuchara", obj_Fork: "Tenedor", obj_Plate: "Plato", obj_Pot: "Olla", obj_Pan: "Sartén", obj_Spatula: "Espátula", obj_Toaster: "Tostadora", obj_Blender: "Licuadora", obj_Oven_Mitt: "Guante de Horno", obj_Rolling_Pin: "Rodillo", obj_Whisk: "Batidor",
            // Playground
            obj_Slide: "Tobogán", obj_Swing: "Columpio", obj_Sandbox: "Cajón de Arena", obj_Seesaw: "Balancín", obj_Ball: "Pelota", obj_Jump_Rope: "Cuerda de Saltar", obj_KitePg: "Cometa", obj_Bicycle: "Bicicleta", obj_Bench: "Banco", obj_Tree: "Árbol", obj_Bird: "Pájaro", obj_Cloud: "Nube", obj_Sun: "Sol", obj_Flower: "Flor"
        },
        hi: {
            title: "मैं देखता हूँ...",
            subtitle: "क्या आप सभी छिपी हुई वस्तुएं ढूंढ सकते हैं?",
            findThese: "इन्हें खोजें!",
            found: "खोज लिए",
            backToMenu: "मुख्य मेनू",
            winTitle: "आपने सब ढूंढ लिया!",
            winSubtitle: "सभी छिपी हुई वस्तुओं को खोजने का बहुत अच्छा काम।",
            playAgain: "फिर से खेलें",
            mainMenu: "मुख्य मेनू",
            sceneToyshop: "खिलौनों की दुकान",
            sceneKitchen: "रसोई",
            scenePlayground: "खेल का मैदान",
            // Toy Shop
            obj_Red_Ball: "लाल गेंद", obj_Toy_Train: "खिलौना ट्रेन", obj_Teddy_Bear: "टेली भालू", obj_Robot: "रोबोट", obj_Rubber_Duck: "रबर की बत्तख", obj_Rocking_Horse: "झूलने वाला घोड़ा", obj_Blocks: "ब्लॉक", obj_Toy_Car: "खिलौना गाड़ी", obj_Spinning_Top: "लट्टू", obj_Kite: "पतंग", obj_Doll: "गुड़िया", obj_Drum: "ढोल", obj_Airplane: "विमान", obj_Xylophone: "जाइलोफोन",
            // Kitchen
            obj_Apple: "सेब", obj_Banana: "केला", obj_Mug: "मग", obj_Spoon: "चम्मच", obj_Fork: "कांटा", obj_Plate: "प्लेट", obj_Pot: "बर्तन", obj_Pan: "तवा", obj_Spatula: "चमचा", obj_Toaster: "टोस्टर", obj_Blender: "मिक्सर", obj_Oven_Mitt: "ओवन दस्ताने", obj_Rolling_Pin: "बेलन", obj_Whisk: "फेंटनी",
            // Playground
            obj_Slide: "फिसलपट्टी", obj_Swing: "झूला", obj_Sandbox: "बालू का डिब्बा", obj_Seesaw: "सी-सॉ", obj_Ball: "गेंद", obj_Jump_Rope: "कूदने की रस्सी", obj_KitePg: "पतंग", obj_Bicycle: "साइकिल", obj_Bench: "बेंच", obj_Tree: "पेड़", obj_Bird: "पक्षी", obj_Cloud: "बादल", obj_Sun: "सूरज", obj_Flower: "फूल"
        },
        zh: {
            title: "我找到了...",
            subtitle: "你能找到所有隐藏的物品吗？",
            findThese: "找到这些！",
            found: "已找到",
            backToMenu: "返回主菜单",
            winTitle: "你全找到了！",
            winSubtitle: "干得好，你找到了所有隐藏的物品。",
            playAgain: "再玩一次",
            mainMenu: "主菜单",
            sceneToyshop: "玩具店",
            sceneKitchen: "厨房",
            scenePlayground: "游乐场",
            // Toy Shop
            obj_Red_Ball: "红球", obj_Toy_Train: "玩具火车", obj_Teddy_Bear: "泰迪熊", obj_Robot: "机器人", obj_Rubber_Duck: "橡皮鸭", obj_Rocking_Horse: "摇摇马", obj_Blocks: "积木", obj_Toy_Car: "玩具车", obj_Spinning_Top: "陀螺", obj_Kite: "风筝", obj_Doll: "洋娃娃", obj_Drum: "鼓", obj_Airplane: "飞机", obj_Xylophone: "木琴",
            // Kitchen
            obj_Apple: "苹果", obj_Banana: "香蕉", obj_Mug: "杯子", obj_Spoon: "勺子", obj_Fork: "叉子", obj_Plate: "盘子", obj_Pot: "锅", obj_Pan: "平底锅", obj_Spatula: "锅铲", obj_Toaster: "烤面包机", obj_Blender: "搅拌机", obj_Oven_Mitt: "隔热手套", obj_Rolling_Pin: "擀面杖", obj_Whisk: "打蛋器",
            // Playground
            obj_Slide: "滑梯", obj_Swing: "秋千", obj_Sandbox: "沙坑", obj_Seesaw: "跷跷板", obj_Ball: "球", obj_Jump_Rope: "跳绳", obj_KitePg: "风筝", obj_Bicycle: "自行车", obj_Bench: "长椅", obj_Tree: "树", obj_Bird: "鸟", obj_Cloud: "云", obj_Sun: "太阳", obj_Flower: "花"
        }
    };

    // Default language state
    let currentLang = 'en';

    // Helper to translate object names securely based on fallback keys
    const getI18nObjName = (name) => {
        const key = `obj_${name.replace(/ /g, "_")}`;
        return I18N_DICT[currentLang][key] || I18N_DICT.en[key] || name;
    }

    // Update statically tagged i18n DOM nodes
    function updateDOMStrings() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (I18N_DICT[currentLang] && I18N_DICT[currentLang][key]) {
                el.innerText = I18N_DICT[currentLang][key];
            }
        });

        // Refresh dynamic UI elements
        if (ui.targetList.children.length > 0) {
            setupSidebar();
        }
        updateProgress();
    }

    // Bind dropdown listener
    document.getElementById('lang-select')?.addEventListener('change', (e) => {
        currentLang = e.target.value;
        updateDOMStrings();
    });

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
            objects: [
                { id: "kit_0", name: "Apple", x: 28, y: 53, w: 3, imgUrl: "assets/images/Apple.jpg" }, // On counter left
                { id: "kit_1", name: "Banana", x: 86, y: 45, w: 4, imgUrl: "assets/images/Banana.jpg" }, // Top of fridge
                { id: "kit_2", name: "Mug", x: 67, y: 31, w: 3, imgUrl: "assets/images/Mug.jpg" }, // Shelf above stove
                { id: "kit_3", name: "Spoon", x: 6, y: 72, w: 2, imgUrl: "assets/images/Spoon.jpg" }, // Hanging left drawer
                { id: "kit_4", name: "Fork", x: 58, y: 74, w: 2, imgUrl: "assets/images/Fork.jpg" }, // On table near kid
                { id: "kit_5", name: "Plate", x: 50, y: 32, w: 6, imgUrl: "assets/images/Plate.jpg" }, // Open cabinet
                { id: "kit_6", name: "Pot", x: 34, y: 75, w: 5, imgUrl: "assets/images/Pot.jpg" }, // Lower open shelf
                { id: "kit_7", name: "Pan", x: 63, y: 44, w: 5, imgUrl: "assets/images/Pan.jpg" }, // Hanging over stove
                { id: "kit_8", name: "Spatula", x: 57, y: 45, w: 2, imgUrl: "assets/images/Spatula.jpg" }, // Next to stove
                { id: "kit_9", name: "Toaster", x: 42, y: 53, w: 6, imgUrl: "assets/images/Toaster.jpg" }, // Counter corner
                { id: "kit_10", name: "Blender", x: 48, y: 47, w: 5, imgUrl: "assets/images/Blender.jpg" }, // Next to toaster
                { id: "kit_11", name: "Oven Mitt", x: 19, y: 50, w: 4, imgUrl: "assets/images/Oven_Mitt.jpg" }, // Next to sink brushes
                { id: "kit_12", name: "Rolling Pin", x: 38, y: 55, w: 6, imgUrl: "assets/images/Rolling_Pin.jpg" }, // On cutting board
                { id: "kit_13", name: "Whisk", x: 80, y: 14, w: 3, imgUrl: "assets/images/Whisk.jpg" } // Top high shelf
            ]
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

    function setupSidebar() {
        gameState.objectsToFind.forEach(obj => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('target-item');
            itemElement.id = `sidebar-item-${obj.id}`;

            const locName = getI18nObjName(obj.name);

            itemElement.innerHTML = `
                <img src="${obj.dataUrl || obj.imgUrl}" alt="${locName}" class="sprite-thumb">
                <span>${locName}</span>
            `;
            ui.targetList.appendChild(itemElement);
        });
    }

    // Cache voices array globally to avoid empty array on first load
    let systemVoices = [];
    if ('speechSynthesis' in window) {
        // Voices load asynchronously in some browsers
        window.speechSynthesis.onvoiceschanged = () => {
            systemVoices = window.speechSynthesis.getVoices();
        };
        // Also try immediately for browsers that load them synchronously
        systemVoices = window.speechSynthesis.getVoices();
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

                const locName = getI18nObjName(objName);
                let speechText = `You found the ${locName}`;

                // Map current lang to actual Speech API voice tags
                const voiceMap = {
                    'en': 'en-US',
                    'es': 'es-ES',
                    'hi': 'hi-IN',
                    'zh': 'zh-CN'
                };
                const langCode = voiceMap[currentLang] || 'en-US';

                // Basic localized grammar
                if (currentLang === 'es') speechText = `Encontraste el ${locName}`;
                if (currentLang === 'hi') speechText = `आपने ${locName} ढूंढ लिया`;
                if (currentLang === 'zh') speechText = `你找到了 ${locName}`;

                const utterance = new SpeechSynthesisUtterance(speechText);

                // Try to find a premium native voice based on the selected language
                if (systemVoices.length > 0) {
                    const premiumVoicesByLang = {
                        'en': ['Samantha', 'Daniel', 'Karen', 'Moira', 'Google US English', 'Microsoft Zira'],
                        'es': ['Monica', 'Paulina', 'Jorge', 'Google Español', 'Microsoft Sabina'],
                        'hi': ['Lekha', 'Google हिन्दी', 'Microsoft Swara'],
                        'zh': ['Ting-Ting', 'Mei-Jia', 'Sin-Ji', 'Google 普通话', 'Microsoft Huihui']
                    };

                    const preferredVoices = premiumVoicesByLang[currentLang] || [];
                    let selectedVoice = null;

                    // 1. Search for a high-quality explicit name
                    for (const pref of preferredVoices) {
                        selectedVoice = systemVoices.find(v => v.name.includes(pref));
                        if (selectedVoice) break;
                    }

                    // 2. Fallback to any voice matching the exact lang tag
                    if (!selectedVoice) {
                        selectedVoice = systemVoices.find(v => v.lang.startsWith(langCode));
                    }

                    // 3. Fallback to broad language match (e.g. 'en-US' failing over to 'en-GB' or just 'en')
                    if (!selectedVoice) {
                        selectedVoice = systemVoices.find(v => v.lang.startsWith(currentLang));
                    }

                    if (selectedVoice) {
                        utterance.voice = selectedVoice;
                    }
                }

                utterance.pitch = 1.0; // Restored to 1.0 to prevent OS-level voice distortion/muffling
                utterance.rate = 1.0;
                utterance.lang = langCode;
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
