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
        }
    }
};
