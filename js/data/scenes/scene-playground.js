// Ensure the global registry exists
window.ISPY_SCENES = window.ISPY_SCENES || {};

window.ISPY_SCENES.playground = {
    id: 'playground',
    bgImage: 'assets/images/scenes/playground/scene_playground.jpg',
    // OrigWidth/Height will be populated dynamically at load time
    objects: [
        { id: "pg_1", name: "Slide", x: 20, y: 70, w: 12, imgUrl: "assets/images/scenes/playground/Slide.png" },
        { id: "pg_2", name: "Swing", x: 80, y: 60, w: 10, imgUrl: "assets/images/scenes/playground/Swing.png" },
        { id: "pg_3", name: "Sandbox", x: 50, y: 85, w: 15, imgUrl: "assets/images/scenes/playground/Sandbox.png" },
        { id: "pg_4", name: "Seesaw", x: 40, y: 75, w: 20, imgUrl: "assets/images/scenes/playground/Seesaw.png" },
        { id: "pg_5", name: "Ball", x: 60, y: 80, w: 3, imgUrl: "assets/images/scenes/playground/Ball.png" },
        { id: "pg_6", name: "Jump Rope", x: 30, y: 85, w: 5, imgUrl: "assets/images/scenes/playground/Jump_Rope.png" },
        { id: "pg_7", name: "KitePg", x: 70, y: 20, w: 6, imgUrl: "assets/images/scenes/playground/KitePg.png" },
        { id: "pg_8", name: "Bicycle", x: 90, y: 80, w: 8, imgUrl: "assets/images/scenes/playground/Bicycle.png" },
        { id: "pg_9", name: "Bench", x: 80, y: 80, w: 12, imgUrl: "assets/images/scenes/playground/Bench.png" },
        { id: "pg_10", name: "Tree", x: 10, y: 40, w: 20, imgUrl: "assets/images/scenes/playground/Tree.png" },
        { id: "pg_11", name: "Bird", x: 40, y: 15, w: 3, imgUrl: "assets/images/scenes/playground/Bird.png" },
        { id: "pg_12", name: "Cloud", x: 20, y: 15, w: 15, imgUrl: "assets/images/scenes/playground/Cloud.png" },
        { id: "pg_13", name: "Sun", x: 90, y: 10, w: 10, imgUrl: "assets/images/scenes/playground/Sun.png" },
        { id: "pg_14", name: "Flower", x: 15, y: 90, w: 4, imgUrl: "assets/images/scenes/playground/Flower.png" }
    ],
    // Localized dictionary specific to this scene's items
    i18n: {
        en: {
            obj_Slide: "Slide", obj_Swing: "Swing", obj_Sandbox: "Sandbox", obj_Seesaw: "Seesaw", obj_Ball: "Ball", obj_Jump_Rope: "Jump Rope", obj_KitePg: "Kite", obj_Bicycle: "Bicycle", obj_Bench: "Bench", obj_Tree: "Tree", obj_Bird: "Bird", obj_Cloud: "Cloud", obj_Sun: "Sun", obj_Flower: "Flower"
        },
        es: {
            obj_Slide: "Tobogán", obj_Swing: "Columpio", obj_Sandbox: "Cajón de Arena", obj_Seesaw: "Balancín", obj_Ball: "Pelota", obj_Jump_Rope: "Cuerda de Saltar", obj_KitePg: "Cometa", obj_Bicycle: "Bicicleta", obj_Bench: "Banco", obj_Tree: "Árbol", obj_Bird: "Pájaro", obj_Cloud: "Nube", obj_Sun: "Sol", obj_Flower: "Flor"
        },
        hi: {
            obj_Slide: "फिसलपट्टी", obj_Swing: "झूला", obj_Sandbox: "बालू का डिब्बा", obj_Seesaw: "सी-सॉ", obj_Ball: "गेंद", obj_Jump_Rope: "कूदने की रस्सी", obj_KitePg: "पतंग", obj_Bicycle: "साइकिल", obj_Bench: "बेंच", obj_Tree: "पेड़", obj_Bird: "पक्षी", obj_Cloud: "बादल", obj_Sun: "सूरज", obj_Flower: "फूल"
        },
        zh: {
            obj_Slide: "滑梯", obj_Swing: "秋千", obj_Sandbox: "沙坑", obj_Seesaw: "跷跷板", obj_Ball: "球", obj_Jump_Rope: "跳绳", obj_KitePg: "风筝", obj_Bicycle: "自行车", obj_Bench: "长椅", obj_Tree: "树", obj_Bird: "鸟", obj_Cloud: "云", obj_Sun: "太阳", obj_Flower: "花"
        },
        'pt-PT': { obj_Slide: "Escorrega", obj_Swing: "Balanço", obj_Sandbox: "Caixa de Areia", obj_Seesaw: "Balancé", obj_Ball: "Bola", obj_Jump_Rope: "Corda de Saltar", obj_KitePg: "Papagaio", obj_Bicycle: "Bicicleta", obj_Bench: "Banco", obj_Tree: "Árvore", obj_Bird: "Pássaro", obj_Cloud: "Nuvem", obj_Sun: "Sol", obj_Flower: "Flor" },
        'pt-BR': { obj_Slide: "Escorregador", obj_Swing: "Balanço", obj_Sandbox: "Tanque de Areia", obj_Seesaw: "Gangorra", obj_Ball: "Bola", obj_Jump_Rope: "Corda de Pular", obj_KitePg: "Pipa", obj_Bicycle: "Bicicleta", obj_Bench: "Banco", obj_Tree: "Árvore", obj_Bird: "Pássaro", obj_Cloud: "Nuvem", obj_Sun: "Sol", obj_Flower: "Flor" },
        'fr': { obj_Slide: "Toboggan", obj_Swing: "Balançoire", obj_Sandbox: "Bac à Sable", obj_Seesaw: "Tape-cul", obj_Ball: "Ballon", obj_Jump_Rope: "Corde à Sauter", obj_KitePg: "Cerf-volant", obj_Bicycle: "Vélo", obj_Bench: "Banc", obj_Tree: "Arbre", obj_Bird: "Oiseau", obj_Cloud: "Nuage", obj_Sun: "Soleil", obj_Flower: "Fleur" },
        'ja': { obj_Slide: "すべり台", obj_Swing: "ブランコ", obj_Sandbox: "砂場", obj_Seesaw: "シーソー", obj_Ball: "ボール", obj_Jump_Rope: "縄跳び", obj_KitePg: "凧", obj_Bicycle: "自転車", obj_Bench: "ベンチ", obj_Tree: "木", obj_Bird: "鳥", obj_Cloud: "雲", obj_Sun: "太陽", obj_Flower: "花" },
        'bn': { obj_Slide: "স্লাইড", obj_Swing: "দোলনা", obj_Sandbox: "স্যান্ডবক্স", obj_Seesaw: "সিস", obj_Ball: "বল", obj_Jump_Rope: "লাফ দড়ি", obj_KitePg: "ঘুড়ি", obj_Bicycle: "সাইকেল", obj_Bench: "বেঞ্চ", obj_Tree: "গাছ", obj_Bird: "পাখি", obj_Cloud: "মেঘ", obj_Sun: "সূর্য", obj_Flower: "ফুল" },
        'gu': { obj_Slide: "લપસણી", obj_Swing: "હીંચકો", obj_Sandbox: "સેન્ડબોક્સ", obj_Seesaw: "સીસો", obj_Ball: "દડો", obj_Jump_Rope: "દોરડા કૂદ", obj_KitePg: "પતંગ", obj_Bicycle: "સાયકલ", obj_Bench: "બાંકડો", obj_Tree: "ઝાડ", obj_Bird: "પક્ષી", obj_Cloud: "વાદળ", obj_Sun: "સૂર્ય", obj_Flower: "ફૂલ" },
        'mr': { obj_Slide: "घसरगुंडी", obj_Swing: "झोपाळा", obj_Sandbox: "वाळूचा खड्डा", obj_Seesaw: "सी-सॉ", obj_Ball: "चेंडू", obj_Jump_Rope: "दोरीच्या उड्या", obj_KitePg: "पतंग", obj_Bicycle: "सायकल", obj_Bench: "बाक", obj_Tree: "झाड", obj_Bird: "पक्षी", obj_Cloud: "ढग", obj_Sun: "सूर्य", obj_Flower: "फूल" },
        'kn': { obj_Slide: "ಜಾರುಬಂಡಿ", obj_Swing: "ಉಯ್ಯಾಲೆ", obj_Sandbox: "ಮರಳಿನ ಗುಂಡಿ", obj_Seesaw: "ಸೀಸಾ", obj_Ball: "ಚೆಂಡು", obj_Jump_Rope: "ಜಿಗಿಯುವ ಹಗ್ಗ", obj_KitePg: "ಗಾಳಿಪಟ", obj_Bicycle: "ಸೈಕಲ್", obj_Bench: "ಬೆಂಚು", obj_Tree: "ಮರ", obj_Bird: "ಹಕ್ಕಿ", obj_Cloud: "ಮೋಡ", obj_Sun: "ಸೂರ್ಯ", obj_Flower: "ಹೂವು" },
        'ta': { obj_Slide: "சறுக்குமரம்", obj_Swing: "ஊஞ்சல்", obj_Sandbox: "மணல் பெட்டி", obj_Seesaw: "சீசா", obj_Ball: "பந்து", obj_Jump_Rope: "ஸ்கிப்பிங் கயிறு", obj_KitePg: "பட்டம்", obj_Bicycle: "மிதிவண்டி", obj_Bench: "பெஞ்ச்", obj_Tree: "மரம்", obj_Bird: "பறவை", obj_Cloud: "மேகம்", obj_Sun: "சூரியன்", obj_Flower: "பூ" },
        'ml': { obj_Slide: "സ്ലൈഡ്", obj_Swing: "ഊഞ്ഞാൽ", obj_Sandbox: "മണൽക്കുഴി", obj_Seesaw: "സീസോ", obj_Ball: "പന്ത്", obj_Jump_Rope: "ചാട്ടക്കയർ", obj_KitePg: "പട്ടം", obj_Bicycle: "സൈക്കിൾ", obj_Bench: "ബെഞ്ച്", obj_Tree: "മരം", obj_Bird: "പക്ഷി", obj_Cloud: "മേഘം", obj_Sun: "സൂര്യൻ", obj_Flower: "പൂവ്" },
        'pa': { obj_Slide: "ਸਲਾਈਡ", obj_Swing: "ਝੂਲਾ", obj_Sandbox: "ਸੈਂਡਬੌਕਸ", obj_Seesaw: "ਸੀ-ਸਾ", obj_Ball: "ਗੇਂਦ", obj_Jump_Rope: "ਕੁੱਦਣ ਵਾਲੀ ਰੱਸੀ", obj_KitePg: "ਪਤੰਗ", obj_Bicycle: "ਸਾਈਕਲ", obj_Bench: "ਬੈਂਚ", obj_Tree: "ਰੁੱਖ", obj_Bird: "ਪੰਛੀ", obj_Cloud: "ਬੱਦਲ", obj_Sun: "ਸੂਰਜ", obj_Flower: "ਫੁੱਲ" },
        'sw': { obj_Slide: "Slaidi", obj_Swing: "Bembea", obj_Sandbox: "Sanduku la Mchanga", obj_Seesaw: "Bembesani", obj_Ball: "Mpira", obj_Jump_Rope: "Kamba ya Kuruka", obj_KitePg: "Kishada", obj_Bicycle: "Baiskeli", obj_Bench: "Benchi", obj_Tree: "Mti", obj_Bird: "Ndege", obj_Cloud: "Wingu", obj_Sun: "Jua", obj_Flower: "Ua" },
        'ms': { obj_Slide: "Papan Gelongsor", obj_Swing: "Buaian", obj_Sandbox: "Kotak Pasir", obj_Seesaw: "Jongkang-jongket", obj_Ball: "Bola", obj_Jump_Rope: "Tali Lompat", obj_KitePg: "Layang-layang", obj_Bicycle: "Basikal", obj_Bench: "Bangku", obj_Tree: "Pokok", obj_Bird: "Burung", obj_Cloud: "Awan", obj_Sun: "Matahari", obj_Flower: "Bunga" },
        'tl': { obj_Slide: "Dulasan", obj_Swing: "Duyan", obj_Sandbox: "Sandbox", obj_Seesaw: "Seesaw", obj_Ball: "Bola", obj_Jump_Rope: "Lubid na Panlaktaw", obj_KitePg: "Saranggola", obj_Bicycle: "Bisikleta", obj_Bench: "Benko", obj_Tree: "Puno", obj_Bird: "Ibon", obj_Cloud: "Ulap", obj_Sun: "Araw", obj_Flower: "Bulaklak" }
    }
};
