// Ensure the global registry exists
window.ISPY_SCENES = window.ISPY_SCENES || {};

window.ISPY_SCENES.beach = {
    id: 'beach',
    bgImage: 'assets/images/scenes/beach/scene_beach.jpg',
    // OrigWidth/Height will be populated dynamically at load time
    objects: [
        { id: "b_1", name: "Sun Hat", x: 25, y: 75, w: 6, imgUrl: "assets/images/scenes/beach/Sun_Hat.png" },
        { id: "b_2", name: "Sunglasses", x: 45, y: 85, w: 4, imgUrl: "assets/images/scenes/beach/Sunglasses.png" },
        { id: "b_3", name: "Beach Ball", x: 60, y: 80, w: 7, imgUrl: "assets/images/scenes/beach/Beach_Ball.png" },
        { id: "b_4", name: "Sandcastle", x: 30, y: 60, w: 10, imgUrl: "assets/images/scenes/beach/Sandcastle.png" },
        { id: "b_5", name: "Starfish", x: 80, y: 70, w: 5, imgUrl: "assets/images/scenes/beach/Starfish.png" },
        { id: "b_6", name: "Seashell", x: 15, y: 88, w: 4, imgUrl: "assets/images/scenes/beach/Seashell.png" },
        { id: "b_7", name: "Crab", x: 55, y: 92, w: 6, imgUrl: "assets/images/scenes/beach/Crab.png" },
        { id: "b_8", name: "Bucket", x: 75, y: 55, w: 6, imgUrl: "assets/images/scenes/beach/Bucket.png" },
        { id: "b_9", name: "Spade", x: 85, y: 88, w: 4, imgUrl: "assets/images/scenes/beach/Spade.png" },
        { id: "b_10", name: "Towel", x: 40, y: 65, w: 12, imgUrl: "assets/images/scenes/beach/Towel.png" },
        { id: "b_11", name: "Umbrella", x: 65, y: 45, w: 15, imgUrl: "assets/images/scenes/beach/Umbrella.png" },
        { id: "b_12", name: "Surfboard", x: 10, y: 50, w: 8, imgUrl: "assets/images/scenes/beach/Surfboard.png" },
        { id: "b_13", name: "Ice Cream", x: 20, y: 65, w: 4, imgUrl: "assets/images/scenes/beach/Ice_Cream.png" },
        { id: "b_14", name: "Flip Flops", x: 50, y: 75, w: 5, imgUrl: "assets/images/scenes/beach/Flip_Flops.png" }
    ],
    // Localized dictionary specific to this scene's items
    i18n: {
        en: {
            obj_Sun_Hat: "Sun Hat", obj_Sunglasses: "Sunglasses", obj_Beach_Ball: "Beach Ball", obj_Sandcastle: "Sandcastle", obj_Starfish: "Starfish", obj_Seashell: "Seashell", obj_Crab: "Crab", obj_Bucket: "Bucket", obj_Spade: "Spade", obj_Towel: "Towel", obj_Umbrella: "Umbrella", obj_Surfboard: "Surfboard", obj_Ice_Cream: "Ice Cream", obj_Flip_Flops: "Flip Flops"
        },
        es: {
            obj_Sun_Hat: "Sombrero de Sol", obj_Sunglasses: "Gafas de Sol", obj_Beach_Ball: "Pelota de Playa", obj_Sandcastle: "Castillo de Arena", obj_Starfish: "Estrella de Mar", obj_Seashell: "Concha", obj_Crab: "Cangrejo", obj_Bucket: "Cubo", obj_Spade: "Pala", obj_Towel: "Toalla", obj_Umbrella: "Sombrilla", obj_Surfboard: "Tabla de Surf", obj_Ice_Cream: "Helado", obj_Flip_Flops: "Chanclas"
        },
        hi: {
            obj_Sun_Hat: "सन हैट", obj_Sunglasses: "धूप का चश्मा", obj_Beach_Ball: "समुद्र तट की गेंद", obj_Sandcastle: "रेत का महल", obj_Starfish: "स्टारफ़िश", obj_Seashell: "सीशेल", obj_Crab: "केकड़ा", obj_Bucket: "बाल्टी", obj_Spade: "कुदाल", obj_Towel: "तौलिया", obj_Umbrella: "छाता", obj_Surfboard: "सर्फबोर्ड", obj_Ice_Cream: "आइसक्रीम", obj_Flip_Flops: "चप्पल"
        },
        zh: {
            obj_Sun_Hat: "遮阳帽", obj_Sunglasses: "太阳镜", obj_Beach_Ball: "沙滩球", obj_Sandcastle: "沙堡", obj_Starfish: "海星", obj_Seashell: "贝壳", obj_Crab: "螃蟹", obj_Bucket: "水桶", obj_Spade: "铲子", obj_Towel: "毛巾", obj_Umbrella: "雨伞", obj_Surfboard: "冲浪板", obj_Ice_Cream: "冰淇淋", obj_Flip_Flops: "人字拖"
        },
        'pt-PT': { obj_Sun_Hat: "Chapéu de Sol", obj_Sunglasses: "Óculos de Sol", obj_Beach_Ball: "Bola de Praia", obj_Sandcastle: "Castelo de Areia", obj_Starfish: "Estrela do Mar", obj_Seashell: "Concha", obj_Crab: "Caranguejo", obj_Bucket: "Balde", obj_Spade: "Pá", obj_Towel: "Toalha", obj_Umbrella: "Guarda-sol", obj_Surfboard: "Prancha de Surf", obj_Ice_Cream: "Gelado", obj_Flip_Flops: "Chinelos" },
        'pt-BR': { obj_Sun_Hat: "Chapéu de Sol", obj_Sunglasses: "Óculos de Sol", obj_Beach_Ball: "Bola de Praia", obj_Sandcastle: "Castelo de Areia", obj_Starfish: "Estrela-do-Mar", obj_Seashell: "Concha", obj_Crab: "Caranguejo", obj_Bucket: "Balde", obj_Spade: "Pá", obj_Towel: "Toalha", obj_Umbrella: "Guarda-sol", obj_Surfboard: "Prancha de Surfe", obj_Ice_Cream: "Sorvete", obj_Flip_Flops: "Chinelos" },
        'fr': { obj_Sun_Hat: "Chapeau de Soleil", obj_Sunglasses: "Lunettes de Soleil", obj_Beach_Ball: "Ballon de Plage", obj_Sandcastle: "Château de Sable", obj_Starfish: "Étoile de Mer", obj_Seashell: "Coquillage", obj_Crab: "Crabe", obj_Bucket: "Seau", obj_Spade: "Pelle", obj_Towel: "Serviette", obj_Umbrella: "Parasol", obj_Surfboard: "Planche de Surf", obj_Ice_Cream: "Glace", obj_Flip_Flops: "Tongs" },
        'ja': { obj_Sun_Hat: "麦わら帽子", obj_Sunglasses: "サングラス", obj_Beach_Ball: "ビーチボール", obj_Sandcastle: "砂の城", obj_Starfish: "ヒトデ", obj_Seashell: "貝殻", obj_Crab: "カニ", obj_Bucket: "バケツ", obj_Spade: "スコップ", obj_Towel: "タオル", obj_Umbrella: "パラソル", obj_Surfboard: "サーフボード", obj_Ice_Cream: "アイスクリーム", obj_Flip_Flops: "ビーチサンダル" },
        'bn': { obj_Sun_Hat: "টুপি", obj_Sunglasses: "রোদচশমা", obj_Beach_Ball: "বিচ বল", obj_Sandcastle: "বালির দুর্গ", obj_Starfish: "তারামাছ", obj_Seashell: "ঝিনুক", obj_Crab: "কাঁকড়া", obj_Bucket: "বালতি", obj_Spade: "কোদাল", obj_Towel: "তোয়ালে", obj_Umbrella: "ছাতা", obj_Surfboard: "সার্ফবোর্ড", obj_Ice_Cream: "আইসক্রিম", obj_Flip_Flops: "স্যান্ডেল" },
        'gu': { obj_Sun_Hat: "ટોપી", obj_Sunglasses: "ચશ્મા", obj_Beach_Ball: "બીચ બોલ", obj_Sandcastle: "રેતીનો કિલ્લો", obj_Starfish: "સ્ટારફિશ", obj_Seashell: "છીપ", obj_Crab: "કરચલો", obj_Bucket: "ડોલ", obj_Spade: "પાવડો", obj_Towel: "ટુવાલ", obj_Umbrella: "છત્રી", obj_Surfboard: "સર્ફબોર્ડ", obj_Ice_Cream: "આઈસ્ક્રીમ", obj_Flip_Flops: "ચંપલ" },
        'mr': { obj_Sun_Hat: "टोपी", obj_Sunglasses: "चष्मा", obj_Beach_Ball: "बीच बॉल", obj_Sandcastle: "वाळूचा किल्ला", obj_Starfish: "स्टारफिश", obj_Seashell: "शिंपला", obj_Crab: "खेकडा", obj_Bucket: "बादली", obj_Spade: "फावडे", obj_Towel: "टॉवेल", obj_Umbrella: "छत्री", obj_Surfboard: "सर्फबोर्ड", obj_Ice_Cream: "आईस्क्रीम", obj_Flip_Flops: "चपला" },
        'kn': { obj_Sun_Hat: "ಟೋಪಿ", obj_Sunglasses: "ಕನ್ನಡಕ", obj_Beach_Ball: "ಬೀಚ್ ಬಾಲ್", obj_Sandcastle: "ಮರಳಿನ ಕೋಟೆ", obj_Starfish: "ನಕ್ಷತ್ರಮೀನು", obj_Seashell: "ಚಿಪ್ಪು", obj_Crab: "ಏಡಿ", obj_Bucket: "ಬಕೆಟ್", obj_Spade: "ಗುದ್ದಲಿ", obj_Towel: "ಟವೆಲ್", obj_Umbrella: "ಛತ್ರಿ", obj_Surfboard: "ಸರ್ಫ್‌ಬೋರ್ಡ್", obj_Ice_Cream: "ಐಸ್ ಕ್ರೀಮ್", obj_Flip_Flops: "ಚಪ್ಪಲಿ" },
        'ta': { obj_Sun_Hat: "தொப்பி", obj_Sunglasses: "கண்ணாடி", obj_Beach_Ball: "பெரிய பந்து", obj_Sandcastle: "மணல் கோட்டை", obj_Starfish: "நட்சத்திர மீன்", obj_Seashell: "கிளிஞ்சல்", obj_Crab: "நண்டு", obj_Bucket: "வாளி", obj_Spade: "மண்வெட்டி", obj_Towel: "துண்டு", obj_Umbrella: "குடை", obj_Surfboard: "சர்போர்டு", obj_Ice_Cream: "ஐஸ்கிரீம்", obj_Flip_Flops: "செருப்பு" },
        'ml': { obj_Sun_Hat: "തൊപ്പി", obj_Sunglasses: "കൂളിംഗ് ഗ്ലാസ്", obj_Beach_Ball: "ബീച്ച് ബോൾ", obj_Sandcastle: "മണൽ കൊട്ടാരം", obj_Starfish: "നക്ഷത്രമത്സ്യം", obj_Seashell: "ചിപ്പി", obj_Crab: "ഞണ്ട്", obj_Bucket: "ബക്കറ്റ്", obj_Spade: "മൺവെട്ടി", obj_Towel: "തോർത്ത്", obj_Umbrella: "കുട", obj_Surfboard: "സർഫ്ബോർഡ്", obj_Ice_Cream: "ഐസ്ക്രീം", obj_Flip_Flops: "ചെരുപ്പ്" },
        'pa': { obj_Sun_Hat: "ਟੋਪੀ", obj_Sunglasses: "ਧੁੱਪ ਦੀਆਂ ਐਨਕਾਂ", obj_Beach_Ball: "ਬੀਚ ਬਾਲ", obj_Sandcastle: "ਰੇਤ ਦਾ ਕਿਲਾ", obj_Starfish: "ਸਟਾਰਫਿਸ਼", obj_Seashell: "ਸਿੱਪੀ", obj_Crab: "ਕੇਕੜਾ", obj_Bucket: "ਬਾਲਟੀ", obj_Spade: "ਕਹੀ", obj_Towel: "ਤੌਲੀਆ", obj_Umbrella: "ਛਤਰੀ", obj_Surfboard: "ਸਰਫਬੋਰਡ", obj_Ice_Cream: "ਆਈਸ ਕਰੀਮ", obj_Flip_Flops: "ਚੱਪਲਾਂ" },
        'sw': { obj_Sun_Hat: "Kofia ya Jua", obj_Sunglasses: "Miwani ya Jua", obj_Beach_Ball: "Mpira wa Ufuoni", obj_Sandcastle: "Kasri la Mchanga", obj_Starfish: "Kiti cha Samaki", obj_Seashell: "Kome", obj_Crab: "Kaa", obj_Bucket: "Ndoo", obj_Spade: "Koleo", obj_Towel: "Taulo", obj_Umbrella: "Mwamvuli", obj_Surfboard: "Ubao wa Kuteleza", obj_Ice_Cream: "Aiskrimu", obj_Flip_Flops: "Makubazi" },
        'ms': { obj_Sun_Hat: "Topi", obj_Sunglasses: "Cermin Mata Gelap", obj_Beach_Ball: "Bola Pantai", obj_Sandcastle: "Istana Pasir", obj_Starfish: "Tapak Sulaiman", obj_Seashell: "Cengkerang", obj_Crab: "Ketam", obj_Bucket: "Baldi", obj_Spade: "Penyodok", obj_Towel: "Tuala", obj_Umbrella: "Payung", obj_Surfboard: "Papan Luncur", obj_Ice_Cream: "Aiskrim", obj_Flip_Flops: "Selipar" },
        'tl': { obj_Sun_Hat: "Sumbrero", obj_Sunglasses: "Salamin sa Araw", obj_Beach_Ball: "Bola sa Dalampasigan", obj_Sandcastle: "Kastilyong Buhangin", obj_Starfish: "Starfish", obj_Seashell: "Kabibe", obj_Crab: "Alimango", obj_Bucket: "Timba", obj_Spade: "Pala", obj_Towel: "Tuwalya", obj_Umbrella: "Payong", obj_Surfboard: "Surfboard", obj_Ice_Cream: "Ice Cream", obj_Flip_Flops: "Tsinelas" }
    }
};
