// Ensure the global registry exists
window.ISPY_SCENES = window.ISPY_SCENES || {};

window.ISPY_SCENES.kitchen = {
    id: 'kitchen',
    bgImage: 'assets/images/scenes/kitchen/scene_kitchen.jpg',
    // OrigWidth/Height will be populated dynamically at load time
    objects: [
        { id: "kit_1", name: "Apple", x: 28, y: 53, w: 3, imgUrl: "assets/images/scenes/kitchen/Apple.jpg" },
        { id: "kit_2", name: "Banana", x: 86, y: 45, w: 4, imgUrl: "assets/images/scenes/kitchen/Banana.jpg" },
        { id: "kit_3", name: "Mug", x: 67, y: 31, w: 3, imgUrl: "assets/images/scenes/kitchen/Mug.jpg" },
        { id: "kit_4", name: "Spoon", x: 6, y: 72, w: 2, imgUrl: "assets/images/scenes/kitchen/Spoon.jpg" },
        { id: "kit_5", name: "Fork", x: 58, y: 74, w: 2, imgUrl: "assets/images/scenes/kitchen/Fork.jpg" },
        { id: "kit_6", name: "Plate", x: 50, y: 32, w: 6, imgUrl: "assets/images/scenes/kitchen/Plate.jpg" },
        { id: "kit_7", name: "Pot", x: 34, y: 75, w: 5, imgUrl: "assets/images/scenes/kitchen/Pot.jpg" },
        { id: "kit_8", name: "Pan", x: 63, y: 44, w: 5, imgUrl: "assets/images/scenes/kitchen/Pan.jpg" },
        { id: "kit_9", name: "Spatula", x: 57, y: 45, w: 2, imgUrl: "assets/images/scenes/kitchen/Spatula.jpg" },
        { id: "kit_10", name: "Toaster", x: 42, y: 53, w: 6, imgUrl: "assets/images/scenes/kitchen/Toaster.jpg" },
        { id: "kit_11", name: "Blender", x: 48, y: 47, w: 5, imgUrl: "assets/images/scenes/kitchen/Blender.jpg" },
        { id: "kit_12", name: "Oven Mitt", x: 19, y: 50, w: 4, imgUrl: "assets/images/scenes/kitchen/Oven_Mitt.jpg" },
        { id: "kit_13", name: "Rolling Pin", x: 38, y: 55, w: 6, imgUrl: "assets/images/scenes/kitchen/Rolling_Pin.jpg" },
        { id: "kit_14", name: "Whisk", x: 80, y: 14, w: 3, imgUrl: "assets/images/scenes/kitchen/Whisk.jpg" }
    ],
    // Localized dictionary specific to this scene's items
    i18n: {
        en: {
            obj_Apple: "Apple", obj_Banana: "Banana", obj_Mug: "Mug", obj_Spoon: "Spoon", obj_Fork: "Fork", obj_Plate: "Plate", obj_Pot: "Pot", obj_Pan: "Pan", obj_Spatula: "Spatula", obj_Toaster: "Toaster", obj_Blender: "Blender", obj_Oven_Mitt: "Oven Mitt", obj_Rolling_Pin: "Rolling Pin", obj_Whisk: "Whisk"
        },
        es: {
            obj_Apple: "Manzana", obj_Banana: "Plátano", obj_Mug: "Taza", obj_Spoon: "Cuchara", obj_Fork: "Tenedor", obj_Plate: "Plato", obj_Pot: "Olla", obj_Pan: "Sartén", obj_Spatula: "Espátula", obj_Toaster: "Tostadora", obj_Blender: "Licuadora", obj_Oven_Mitt: "Guante de Horno", obj_Rolling_Pin: "Rodillo", obj_Whisk: "Batidor"
        },
        hi: {
            obj_Apple: "सेब", obj_Banana: "केला", obj_Mug: "मग", obj_Spoon: "चम्मच", obj_Fork: "कांटा", obj_Plate: "प्लेट", obj_Pot: "बर्तन", obj_Pan: "तवा", obj_Spatula: "चमचा", obj_Toaster: "टोस्टर", obj_Blender: "मिक्सर", obj_Oven_Mitt: "ओवन दस्ताने", obj_Rolling_Pin: "बेलन", obj_Whisk: "फेंटनी"
        },
        zh: {
            obj_Apple: "苹果", obj_Banana: "香蕉", obj_Mug: "杯子", obj_Spoon: "勺子", obj_Fork: "叉子", obj_Plate: "盘子", obj_Pot: "锅", obj_Pan: "平底锅", obj_Spatula: "锅铲", obj_Toaster: "烤面包机", obj_Blender: "搅拌机", obj_Oven_Mitt: "隔热手套", obj_Rolling_Pin: "擀面杖", obj_Whisk: "打蛋器"
        }
    }
};
