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
        },
        'pt-PT': { obj_Red_Ball: "Bola Vermelha", obj_Toy_Train: "Comboio de Brincar", obj_Teddy_Bear: "Urso de Peluche", obj_Robot: "Robô", obj_Rubber_Duck: "Pato de Borracha", obj_Rocking_Horse: "Cavalo de Baloiço", obj_Blocks: "Blocos", obj_Toy_Car: "Carro de Brincar", obj_Spinning_Top: "Pião", obj_Kite: "Papagaio", obj_Doll: "Boneca", obj_Drum: "Tambor", obj_Airplane: "Avião", obj_Xylophone: "Xilofone" },
        'pt-BR': { obj_Red_Ball: "Bola Vermelha", obj_Toy_Train: "Trem de Brinquedo", obj_Teddy_Bear: "Urso de Pelúcia", obj_Robot: "Robô", obj_Rubber_Duck: "Pato de Borracha", obj_Rocking_Horse: "Cavalo de Pau", obj_Blocks: "Blocos", obj_Toy_Car: "Carrinho", obj_Spinning_Top: "Pião", obj_Kite: "Pipa", obj_Doll: "Boneca", obj_Drum: "Tambor", obj_Airplane: "Avião", obj_Xylophone: "Xilofone" },
        'fr': { obj_Red_Ball: "Balle Rouge", obj_Toy_Train: "Petit Train", obj_Teddy_Bear: "Ours en Peluche", obj_Robot: "Robot", obj_Rubber_Duck: "Canard en Plastique", obj_Rocking_Horse: "Cheval à Bascule", obj_Blocks: "Cubes", obj_Toy_Car: "Petite Voiture", obj_Spinning_Top: "Toupie", obj_Kite: "Cerf-volant", obj_Doll: "Poupée", obj_Drum: "Tambour", obj_Airplane: "Avion", obj_Xylophone: "Xylophone" },
        'ja': { obj_Red_Ball: "赤いボール", obj_Toy_Train: "おもちゃの電車", obj_Teddy_Bear: "テディベア", obj_Robot: "ロボット", obj_Rubber_Duck: "アヒルのおもちゃ", obj_Rocking_Horse: "木馬", obj_Blocks: "積み木", obj_Toy_Car: "おもちゃの車", obj_Spinning_Top: "コマ", obj_Kite: "凧", obj_Doll: "人形", obj_Drum: "おもちゃの太鼓", obj_Airplane: "飛行機", obj_Xylophone: "木琴" },
        'bn': { obj_Red_Ball: "লাল বল", obj_Toy_Train: "খেলনা ট্রেন", obj_Teddy_Bear: "টেডি বিয়ার", obj_Robot: "রোবট", obj_Rubber_Duck: "রাবারের হাঁস", obj_Rocking_Horse: "দোলনা ঘোড়া", obj_Blocks: "ব্লক", obj_Toy_Car: "খেলনা গাড়ি", obj_Spinning_Top: "লাটিম", obj_Kite: "ঘুড়ি", obj_Doll: "পুতুল", obj_Drum: "খেলনা ড্রাম", obj_Airplane: "বিমান", obj_Xylophone: "জাইলোফোন" },
        'gu': { obj_Red_Ball: "લાલ દડો", obj_Toy_Train: "રમકડાની ટ્રેન", obj_Teddy_Bear: "ટેડી બિયર", obj_Robot: "રોબોટ", obj_Rubber_Duck: "રબરની બતક", obj_Rocking_Horse: "રમકડાનો ઘોડો", obj_Blocks: "બ્લોક્સ", obj_Toy_Car: "રમકડાની કાર", obj_Spinning_Top: "ભમરડો", obj_Kite: "પતંગ", obj_Doll: "ઢીંગલી", obj_Drum: "રમકડાનો ડ્રમ", obj_Airplane: "વિમાન", obj_Xylophone: "ઝાયલોફોન" },
        'mr': { obj_Red_Ball: "लाल चेंडू", obj_Toy_Train: "खेळणी ट्रेन", obj_Teddy_Bear: "टेडी बेअर", obj_Robot: "रोबोट", obj_Rubber_Duck: "रबरी बदक", obj_Rocking_Horse: "खेळण्यांचा घोडा", obj_Blocks: "ब्लॉक्स", obj_Toy_Car: "खेळणी कार", obj_Spinning_Top: "भोवरा", obj_Kite: "पतंग", obj_Doll: "बाहुली", obj_Drum: "खेळणी ड्रम", obj_Airplane: "विमान", obj_Xylophone: "झायलोफोन" },
        'kn': { obj_Red_Ball: "ಕೆಂಪು ಚೆಂಡು", obj_Toy_Train: "ಆಟಿಕೆ ರೈಲು", obj_Teddy_Bear: "ಟೆಡ್ಡಿ ಬೇರ್", obj_Robot: "ರೋಬೋಟ್", obj_Rubber_Duck: "ರಬ್ಬರ್ ಬಾತುಕೋಳಿ", obj_Rocking_Horse: "ಆಟಿಕೆ ಕುದುರೆ", obj_Blocks: "ಬ್ಲಾಕ್ಗಳು", obj_Toy_Car: "ಆಟಿಕೆ ಕಾರು", obj_Spinning_Top: "ಬುಗುರಿ", obj_Kite: "ಗಾಳಿಪಟ", obj_Doll: "ಗೊಂಬೆ", obj_Drum: "ಆಟಿಕೆ ಡ್ರಮ್", obj_Airplane: "ವಿಮಾನ", obj_Xylophone: "ಕ್ಸೈಲೋಫೋನ್" },
        'ta': { obj_Red_Ball: "சிவப்பு பந்து", obj_Toy_Train: "பொம்மை ரயில்", obj_Teddy_Bear: "டெடி பியர்", obj_Robot: "ரோபோ", obj_Rubber_Duck: "ரப்பர் வாத்து", obj_Rocking_Horse: "பொம்மை குதிரை", obj_Blocks: "தொகுதிகள்", obj_Toy_Car: "பொம்மை கார்", obj_Spinning_Top: "பம்பரம்", obj_Kite: "பட்டம்", obj_Doll: "பொம்மை", obj_Drum: "பொம்மை டிரம்", obj_Airplane: "விமானம்", obj_Xylophone: "சைலோபோன்" },
        'ml': { obj_Red_Ball: "ചുവന്ന പന്ത്", obj_Toy_Train: "കളിപ്പാട്ട ട്രെയിൻ", obj_Teddy_Bear: "ടെഡി ബെയർ", obj_Robot: "റോബോട്ട്", obj_Rubber_Duck: "റബ്ബർ താറാവ്", obj_Rocking_Horse: "കളിപ്പാട്ട കുതിര", obj_Blocks: "കട്ടകൾ", obj_Toy_Car: "കളിപ്പാട്ട കാർ", obj_Spinning_Top: "പമ്പരം", obj_Kite: "പട്ടം", obj_Doll: "പാവ", obj_Drum: "കളിപ്പാട്ട ഡ്രം", obj_Airplane: "വിമാനം", obj_Xylophone: "സൈലോഫോൺ" },
        'pa': { obj_Red_Ball: "ਲਾਲ ਗੇਂਦ", obj_Toy_Train: "ਖਿਡੌਣਾ ਟ੍ਰੇਨ", obj_Teddy_Bear: "ਟੈਡੀ ਬੀਅਰ", obj_Robot: "ਰੋਬੋਟ", obj_Rubber_Duck: "ਰਬੜ ਦੀ ਬੱਤਖ", obj_Rocking_Horse: "ਖਿਡੌਣਾ ਘੋੜਾ", obj_Blocks: "ਬਲਾਕ", obj_Toy_Car: "ਖਿਡੌਣਾ ਕਾਰ", obj_Spinning_Top: "ਲਾਟੂ", obj_Kite: "ਪਤੰਗ", obj_Doll: "ਗੁੱਡੀ", obj_Drum: "ਖਿਡੌਣਾ ਢੋਲ", obj_Airplane: "ਹਵਾਈ ਜਹਾਜ਼", obj_Xylophone: "ਜ਼ਾਈਲੋਫੋਨ" },
        'sw': { obj_Red_Ball: "Mpira Mwekundu", obj_Toy_Train: "Treni ya Kuchezea", obj_Teddy_Bear: "Dubu", obj_Robot: "Roboti", obj_Rubber_Duck: "Bata wa Mpira", obj_Rocking_Horse: "Farasi wa Kuchezea", obj_Blocks: "Vipande", obj_Toy_Car: "Gari la Kuchezea", obj_Spinning_Top: "Pia", obj_Kite: "Kishada", obj_Doll: "Mwanasesere", obj_Drum: "Ngoma", obj_Airplane: "Ndege", obj_Xylophone: "Zailofoni" },
        'ms': { obj_Red_Ball: "Bola Merah", obj_Toy_Train: "Kereta Api Mainan", obj_Teddy_Bear: "Patung Beruang", obj_Robot: "Robot", obj_Rubber_Duck: "Itik Getah", obj_Rocking_Horse: "Kuda Mainan", obj_Blocks: "Blok", obj_Toy_Car: "Kereta Mainan", obj_Spinning_Top: "Gasing", obj_Kite: "Layang-layang", obj_Doll: "Anak Patung", obj_Drum: "Gendang", obj_Airplane: "Kapal Terbang", obj_Xylophone: "Xylophone" },
        'tl': { obj_Red_Ball: "Pulang Bola", obj_Toy_Train: "Laruan na Tren", obj_Teddy_Bear: "Teddy Bear", obj_Robot: "Robot", obj_Rubber_Duck: "Gomang Itik", obj_Rocking_Horse: "Laruang Kabayo", obj_Blocks: "Mga Bloke", obj_Toy_Car: "Laruang Kotse", obj_Spinning_Top: "Trompo", obj_Kite: "Saranggola", obj_Doll: "Manika", obj_Drum: "Tambol", obj_Airplane: "Eroplano", obj_Xylophone: "Xylophone" }
    }
};
