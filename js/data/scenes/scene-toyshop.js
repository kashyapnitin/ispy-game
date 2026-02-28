// Ensure the global registry exists
window.ISPY_SCENES = window.ISPY_SCENES || {};

window.ISPY_SCENES.toyshop = {
    id: 'toyshop',
    bgImage: 'assets/images/scenes/toyshop/scene_toyshop.jpg',
    // OrigWidth/Height will be populated dynamically at load time
    objects: [
        { id: "ts_1", name: "Red Ball", x: 23, y: 88, w: 5, imgUrl: "assets/images/scenes/toyshop/Red_Ball.png" },
        { id: "ts_2", name: "Toy Train", x: 50, y: 80, w: 10, imgUrl: "assets/images/scenes/toyshop/Toy_Train.png" },
        { id: "ts_3", name: "Teddy Bear", x: 74, y: 76, w: 8, imgUrl: "assets/images/scenes/toyshop/Teddy_Bear.png" },
        { id: "ts_4", name: "Robot", x: 80, y: 55, w: 6, imgUrl: "assets/images/scenes/toyshop/Robot.png" },
        { id: "ts_5", name: "Rubber Duck", x: 26, y: 39, w: 4, imgUrl: "assets/images/scenes/toyshop/Rubber_Duck.png" },
        { id: "ts_6", name: "Rocking Horse", x: 22, y: 64, w: 10, imgUrl: "assets/images/scenes/toyshop/Rocking_Horse.png" },
        { id: "ts_7", name: "Blocks", x: 38, y: 92, w: 6, imgUrl: "assets/images/scenes/toyshop/Blocks.png" },
        { id: "ts_8", name: "Toy Car", x: 62, y: 92, w: 5, imgUrl: "assets/images/scenes/toyshop/Toy_Car.png" },
        { id: "ts_9", name: "Spinning Top", x: 42, y: 56, w: 3, imgUrl: "assets/images/scenes/toyshop/Spinning_Top.png" },
        { id: "ts_10", name: "Kite", x: 52, y: 20, w: 8, imgUrl: "assets/images/scenes/toyshop/Kite.png" },
        { id: "ts_11", name: "Doll", x: 65, y: 50, w: 5, imgUrl: "assets/images/scenes/toyshop/Doll.png" },
        { id: "ts_12", name: "Drum", x: 8, y: 90, w: 7, imgUrl: "assets/images/scenes/toyshop/Drum.png" },
        { id: "ts_13", name: "Airplane", x: 35, y: 15, w: 8, imgUrl: "assets/images/scenes/toyshop/Airplane.png" },
        { id: "ts_14", name: "Xylophone", x: 55, y: 65, w: 8, imgUrl: "assets/images/scenes/toyshop/Xylophone.png" }
    ],
    // Localized dictionary specific to this scene's items
    i18n: {
        en: {
            obj_Red_Ball: "Red Ball", obj_Toy_Train: "Toy Train", obj_Teddy_Bear: "Teddy Bear", obj_Robot: "Robot", obj_Rubber_Duck: "Rubber Duck", obj_Rocking_Horse: "Rocking Horse", obj_Blocks: "Blocks", obj_Toy_Car: "Toy Car", obj_Spinning_Top: "Spinning Top", obj_Kite: "Kite", obj_Doll: "Doll", obj_Drum: "Drum", obj_Airplane: "Airplane", obj_Xylophone: "Xylophone"
        },
        es: {
            obj_Red_Ball: "Pelota Roja", obj_Toy_Train: "Tren de Juguete", obj_Teddy_Bear: "Osito de Peluche", obj_Robot: "Robot", obj_Rubber_Duck: "Pato de Goma", obj_Rocking_Horse: "Caballo Balancín", obj_Blocks: "Bloques", obj_Toy_Car: "Coche de Juguete", obj_Spinning_Top: "Peonza", obj_Kite: "Cometa", obj_Doll: "Muñeca", obj_Drum: "Tambor", obj_Airplane: "Avión", obj_Xylophone: "Xilófono"
        },
        hi: {
            obj_Red_Ball: "लाल गेंद", obj_Toy_Train: "खिलौना ट्रेन", obj_Teddy_Bear: "टेली भालू", obj_Robot: "रोबोट", obj_Rubber_Duck: "रबर की बत्तख", obj_Rocking_Horse: "झूलने वाला घोड़ा", obj_Blocks: "ब्लॉक", obj_Toy_Car: "खिलौना गाड़ी", obj_Spinning_Top: "लट्टू", obj_Kite: "पतंग", obj_Doll: "गुड़िया", obj_Drum: "ढोल", obj_Airplane: "विमान", obj_Xylophone: "जाइलोफोन"
        },
        zh: {
            obj_Red_Ball: "红球", obj_Toy_Train: "玩具火车", obj_Teddy_Bear: "泰迪熊", obj_Robot: "机器人", obj_Rubber_Duck: "橡皮鸭", obj_Rocking_Horse: "摇摇马", obj_Blocks: "积木", obj_Toy_Car: "玩具车", obj_Spinning_Top: "陀螺", obj_Kite: "风筝", obj_Doll: "洋娃娃", obj_Drum: "鼓", obj_Airplane: "飞机", obj_Xylophone: "木琴"
        }
    }
};
