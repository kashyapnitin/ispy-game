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
        },
        'pt-PT': { obj_Apple: "Maçã", obj_Banana: "Banana", obj_Mug: "Caneca", obj_Spoon: "Colher", obj_Fork: "Garfo", obj_Plate: "Prato", obj_Pot: "Panela", obj_Pan: "Frigideira", obj_Spatula: "Espátula", obj_Toaster: "Torradeira", obj_Blender: "Varinha Mágica", obj_Oven_Mitt: "Luva de Forno", obj_Rolling_Pin: "Rolo da Massa", obj_Whisk: "Batedor" },
        'pt-BR': { obj_Apple: "Maçã", obj_Banana: "Banana", obj_Mug: "Caneca", obj_Spoon: "Colher", obj_Fork: "Garfo", obj_Plate: "Prato", obj_Pot: "Panela", obj_Pan: "Frigideira", obj_Spatula: "Espátula", obj_Toaster: "Torradeira", obj_Blender: "Liquidificador", obj_Oven_Mitt: "Luva Térmica", obj_Rolling_Pin: "Rolo de Massa", obj_Whisk: "Batedor" },
        'fr': { obj_Apple: "Pomme", obj_Banana: "Banane", obj_Mug: "Tasse", obj_Spoon: "Cuillère", obj_Fork: "Fourchette", obj_Plate: "Assiette", obj_Pot: "Marmite", obj_Pan: "Poêle", obj_Spatula: "Spatule", obj_Toaster: "Grille-pain", obj_Blender: "Mixeur", obj_Oven_Mitt: "Gant de Four", obj_Rolling_Pin: "Rouleau à Pâtisserie", obj_Whisk: "Fouet" },
        'ja': { obj_Apple: "リンゴ", obj_Banana: "バナナ", obj_Mug: "マグカップ", obj_Spoon: "スプーン", obj_Fork: "フォーク", obj_Plate: "お皿", obj_Pot: "鍋", obj_Pan: "フライパン", obj_Spatula: "ヘラ", obj_Toaster: "トースター", obj_Blender: "ミキサー", obj_Oven_Mitt: "ミトン", obj_Rolling_Pin: "麺棒", obj_Whisk: "泡立て器" },
        'bn': { obj_Apple: "আপেল", obj_Banana: "কলা", obj_Mug: "মগ", obj_Spoon: "চামচ", obj_Fork: "কাঁটাচামচ", obj_Plate: "থালা", obj_Pot: "হাঁড়ি", obj_Pan: "কড়াই", obj_Spatula: "খুন্তি", obj_Toaster: "টোস্টার", obj_Blender: "ব্লেন্ডার", obj_Oven_Mitt: "ওভেন মিট", obj_Rolling_Pin: "বেলন", obj_Whisk: "হুইস্ক" },
        'gu': { obj_Apple: "સફરજન", obj_Banana: "કેળું", obj_Mug: "મગ", obj_Spoon: "ચમચી", obj_Fork: "કાંટો", obj_Plate: "થાળી", obj_Pot: "તપેલી", obj_Pan: "તવી", obj_Spatula: "તવેથો", obj_Toaster: "ટોસ્ટર", obj_Blender: "બ્લેન્ડર", obj_Oven_Mitt: "ઓવન મિટ", obj_Rolling_Pin: "વેલણ", obj_Whisk: "વ્હીસ્ક" },
        'mr': { obj_Apple: "सफरचंद", obj_Banana: "केळे", obj_Mug: "मग", obj_Spoon: "चमचा", obj_Fork: "काटा", obj_Plate: "प्लेट", obj_Pot: "भांडे", obj_Pan: "तवा", obj_Spatula: "उलाथणे", obj_Toaster: "टोस्टर", obj_Blender: "मिक्सर", obj_Oven_Mitt: "ओव्हन मिट", obj_Rolling_Pin: "लाटणे", obj_Whisk: "रवी" },
        'kn': { obj_Apple: "ಸೇಬು", obj_Banana: "ಬಾಳೆಹಣ್ಣು", obj_Mug: "ಮಗ್", obj_Spoon: "ಚಮಚ", obj_Fork: "ಫೋರ್ಕ್", obj_Plate: "ತಟ್ಟೆ", obj_Pot: "ಮಡಕೆ", obj_Pan: "ತವಾ", obj_Spatula: "ಸಟ್ಟುಗ", obj_Toaster: "ಟೋಸ್ಟರ್", obj_Blender: "ಬ್ಲೆಂಡರ್", obj_Oven_Mitt: "ಓವನ್ ಮಿಟ್", obj_Rolling_Pin: "ಲಟ್ಟಣಿಗೆ", obj_Whisk: "ವಿಸ್ಕ್" },
        'ta': { obj_Apple: "ஆப்பிள்", obj_Banana: "வாழைப்பழம்", obj_Mug: "குவளை", obj_Spoon: "கரண்டி", obj_Fork: "முட்கரண்டி", obj_Plate: "தட்டு", obj_Pot: "பானை", obj_Pan: "பான்", obj_Spatula: "தோசைக்கல்", obj_Toaster: "டோஸ்டர்", obj_Blender: "மிக்சி", obj_Oven_Mitt: "ஓவன் மிட்", obj_Rolling_Pin: "சப்பாத்திக் கட்டை", obj_Whisk: "விஸ்க்" },
        'ml': { obj_Apple: "ആപ്പിൾ", obj_Banana: "വാഴപ്പഴം", obj_Mug: "മഗ്", obj_Spoon: "സ്പൂൺ", obj_Fork: "ഫോർക്ക്", obj_Plate: "പ്ലേറ്റ്", obj_Pot: "കലം", obj_Pan: "ചട്ടി", obj_Spatula: "ചട്ടുകം", obj_Toaster: "ടോസ്റ്റർ", obj_Blender: "മിക്സി", obj_Oven_Mitt: "ഓവൻ മിറ്റ്", obj_Rolling_Pin: "ചപ്പാത്തി കോൽ", obj_Whisk: "വിസ്ക്" },
        'pa': { obj_Apple: "ਸੇਬ", obj_Banana: "ਕੇਲਾ", obj_Mug: "ਮੱਗ", obj_Spoon: "ਚਮਚਾ", obj_Fork: "ਕਾਂਟਾ", obj_Plate: "ਥਾਲੀ", obj_Pot: "ਬਰਤਨ", obj_Pan: "ਤਵਾ", obj_Spatula: "ਖੁਰਪਾ", obj_Toaster: "ਟੋਸਟਰ", obj_Blender: "ਬਲੈਡਰ", obj_Oven_Mitt: "ਓਵਨ ਮਿਟ", obj_Rolling_Pin: "ਵੇਲਣ", obj_Whisk: "ਮਧਾਣੀ" },
        'sw': { obj_Apple: "Tufaha", obj_Banana: "Ndizi", obj_Mug: "Kikombe", obj_Spoon: "Kijiko", obj_Fork: "Uma", obj_Plate: "Sahani", obj_Pot: "Sufuria", obj_Pan: "Karai", obj_Spatula: "Kiwiko", obj_Toaster: "Kibaniko", obj_Blender: "Blenda", obj_Oven_Mitt: "Glovu ya Tanuri", obj_Rolling_Pin: "Mpini wa Kusukuma", obj_Whisk: "Mchapio" },
        'ms': { obj_Apple: "Epal", obj_Banana: "Pisang", obj_Mug: "Cawan", obj_Spoon: "Sudu", obj_Fork: "Garpu", obj_Plate: "Pinggan", obj_Pot: "Periuk", obj_Pan: "Kuali", obj_Spatula: "Sudip", obj_Toaster: "Pembakar Roti", obj_Blender: "Pengisar", obj_Oven_Mitt: "Sarung Tangan Ketuhar", obj_Rolling_Pin: "Penggelek Doh", obj_Whisk: "Pemukul" },
        'tl': { obj_Apple: "Mansanas", obj_Banana: "Saging", obj_Mug: "Tasa", obj_Spoon: "Kutsara", obj_Fork: "Tinidor", obj_Plate: "Plato", obj_Pot: "Kaldero", obj_Pan: "Kawali", obj_Spatula: "Spatula", obj_Toaster: "Toaster", obj_Blender: "Blender", obj_Oven_Mitt: "Oven Mitt", obj_Rolling_Pin: "Rolling Pin", obj_Whisk: "Whisk" }
    }
};
