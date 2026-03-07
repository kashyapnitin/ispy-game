// Ensure the global registry exists
window.ISPY_SCENES = window.ISPY_SCENES || {};

window.ISPY_SCENES.playground = {
    id: 'playground',
    bgImage: 'assets/images/scenes/scene_playground.jpg',
    activeCount: 14,
    // Bounding boxes loaded from scripts/data/hotspots/playground.json at runtime.
    allObjectsLoaded: false,
    allObjects: [],

    i18n: {
        en: {
            // Legacy keys
            obj_Slide: "Slide", obj_Swing: "Swing", obj_Sandbox: "Sandbox", obj_Seesaw: "Seesaw", obj_Ball: "Ball", obj_KitePg: "Kite", obj_Bicycle: "Bicycle", obj_Bench: "Bench", obj_Tree: "Tree", obj_Bird: "Bird", obj_Cloud: "Cloud", obj_Flower: "Flower",
            // New hotspot objects
            obj_Bag: "Bag",
            obj_Flag: "Flag",
            obj_Swings: "Swings",
            obj_Climbing_Net: "Climbing Net",
            obj_Merry_Go_Round: "Merry Go Round",
            obj_Bridge: "Bridge",
            obj_Playhouse: "Playhouse",
            obj_Toy_Truck: "Toy Truck",
            obj_Dinosaur: "Dinosaur",
            obj_Bucket: "Bucket",
            obj_Shovel: "Shovel",
            obj_Backpack: "Backpack",
            obj_Treasure_Chest: "Treasure Chest",
            obj_Dog: "Dog",
            obj_Lizard: "Lizard",
            obj_Squirrel: "Squirrel",
            obj_Butterfly: "Butterfly",
            obj_Lamp_Post: "Lamp Post",
            obj_Flower_Patch: "Flower Patch",
            obj_Clouds: "Clouds",
            obj_Flowers: "Flowers",
            obj_Sand_Castles: "Sand Castles",
            obj_Fence: "Fence",
            obj_Bushes: "Bushes",
            obj_Toy_Dinosaur: "Toy Dinosaur",
            obj_Slides: "Slides",
            obj_Chameleon: "Chameleon",
            obj_Boots: "Boots"
        },
        es: {
            obj_Slide: "Tobogán", obj_Swing: "Columpio", obj_Sandbox: "Cajón de Arena", obj_Seesaw: "Balancín", obj_Ball: "Pelota", obj_KitePg: "Cometa", obj_Bicycle: "Bicicleta", obj_Bench: "Banco", obj_Tree: "Árbol", obj_Bird: "Pájaro", obj_Cloud: "Nube", obj_Flower: "Flor",
            obj_Bag: "Bolsa",
            obj_Flag: "Bandera",
            obj_Swings: "Columpios",
            obj_Climbing_Net: "Red de Escalar",
            obj_Merry_Go_Round: "Tiovivo",
            obj_Bridge: "Puente",
            obj_Playhouse: "Casita",
            obj_Toy_Truck: "Camión de Juguete",
            obj_Dinosaur: "Dinosaurio",
            obj_Bucket: "Cubo",
            obj_Shovel: "Pala",
            obj_Backpack: "Mochila",
            obj_Treasure_Chest: "Cofre del Tesoro",
            obj_Dog: "Perro",
            obj_Lizard: "Lagartija",
            obj_Squirrel: "Ardilla",
            obj_Butterfly: "Mariposa",
            obj_Lamp_Post: "Farola",
            obj_Flower_Patch: "Parche de Flores",
            obj_Clouds: "Nubes",
            obj_Flowers: "Flores",
            obj_Sand_Castles: "Castillos de Arena",
            obj_Fence: "Valla",
            obj_Bushes: "Arbustos",
            obj_Toy_Dinosaur: "Dinosaurio de Juguete",
            obj_Slides: "Toboganes",
            obj_Chameleon: "Camaleón",
            obj_Boots: "Botas"
        },
        hi: {
            obj_Slide: "फिसलपट्टी", obj_Swing: "झूला", obj_Sandbox: "बालू का डिब्बा", obj_Seesaw: "सी-सॉ", obj_Ball: "गेंद", obj_KitePg: "पतंग", obj_Bicycle: "साइकिल", obj_Bench: "बेंच", obj_Tree: "पेड़", obj_Bird: "पक्षी", obj_Cloud: "बादल", obj_Flower: "फूल",
            obj_Bag: "बैग",
            obj_Flag: "झंडा",
            obj_Swings: "झूले",
            obj_Climbing_Net: "चढ़ने की जाली",
            obj_Merry_Go_Round: "घूमने वाला झूला",
            obj_Bridge: "पुल",
            obj_Playhouse: "छोटा घर",
            obj_Toy_Truck: "खिलौना ट्रक",
            obj_Dinosaur: "डायनासोर",
            obj_Bucket: "बाल्टी",
            obj_Shovel: "फावड़ा",
            obj_Backpack: "बैग",
            obj_Treasure_Chest: "खजाने का बक्सा",
            obj_Dog: "कुत्ता",
            obj_Lizard: "छिपकली",
            obj_Squirrel: "गिलहरी",
            obj_Butterfly: "तितली",
            obj_Lamp_Post: "लैम्प पोस्ट",
            obj_Flower_Patch: "फूलों की क्यारी",
            obj_Clouds: "बादल",
            obj_Flowers: "फूल",
            obj_Sand_Castles: "रेत के किले",
            obj_Fence: "बाड़",
            obj_Bushes: "झाड़ियाँ",
            obj_Toy_Dinosaur: "खिलौना डायनासोर",
            obj_Slides: "फिसलपट्टियाँ",
            obj_Chameleon: "गिरगिट",
            obj_Boots: "जूते"
        },
        zh: {
            obj_Slide: "滑梯", obj_Swing: "秋千", obj_Sandbox: "沙坑", obj_Seesaw: "跷跷板", obj_Ball: "球", obj_Jump_Rope: "跳绳", obj_KitePg: "风筝", obj_Bicycle: "自行车", obj_Bench: "长椅", obj_Tree: "树", obj_Bird: "鸟", obj_Cloud: "云", obj_Sun: "太阳", obj_Flower: "花",
            obj_Bag: "包", obj_Flag: "旗子", obj_Swings: "秋千架", obj_Climbing_Net: "攀爬网", obj_Merry_Go_Round: "转盘", obj_Bridge: "桥", obj_Playhouse: "小房子",
            obj_Toy_Truck: "玩具卡车", obj_Dinosaur: "恐龙", obj_Bucket: "桶", obj_Shovel: "铲子", obj_Backpack: "书包", obj_Treasure_Chest: "宝箱",
            obj_Dog: "狗", obj_Lizard: "蜥蜴", obj_Squirrel: "松鼠", obj_Butterfly: "蝴蝶", obj_Lamp_Post: "路灯", obj_Flower_Patch: "花丛",
            obj_Clouds: "云朵", obj_Flowers: "花朵", obj_Sand_Castles: "沙堡", obj_Fence: "栅栏", obj_Bushes: "灌木丛", obj_Toy_Dinosaur: "玩具恐龙",
            obj_Slides: "滑梯组", obj_Chameleon: "变色龙", obj_Boots: "靴子"
        },
        'pt-PT': {
            obj_Slide: "Escorrega", obj_Swing: "Balanço", obj_Sandbox: "Caixa de Areia", obj_Seesaw: "Balancé", obj_Ball: "Bola", obj_Jump_Rope: "Corda de Saltar", obj_KitePg: "Papagaio", obj_Bicycle: "Bicicleta", obj_Bench: "Banco", obj_Tree: "Árvore", obj_Bird: "Pássaro", obj_Cloud: "Nuvem", obj_Sun: "Sol", obj_Flower: "Flor",
            obj_Bag: "Mala", obj_Flag: "Bandeira", obj_Swings: "Baloiços", obj_Climbing_Net: "Rede de Escalada", obj_Merry_Go_Round: "Carrossel", obj_Bridge: "Ponte", obj_Playhouse: "Casinha",
            obj_Toy_Truck: "Camião de Brincar", obj_Dinosaur: "Dinossauro", obj_Bucket: "Balde", obj_Shovel: "Pá", obj_Backpack: "Mochila", obj_Treasure_Chest: "Baú do Tesouro",
            obj_Dog: "Cão", obj_Lizard: "Lagarto", obj_Squirrel: "Esquilo", obj_Butterfly: "Borboleta", obj_Lamp_Post: "Candeeiro de Rua", obj_Flower_Patch: "Cantero de Flores",
            obj_Clouds: "Nuvens", obj_Flowers: "Flores", obj_Sand_Castles: "Castelos de Areia", obj_Fence: "Cerca", obj_Bushes: "Arbustos", obj_Toy_Dinosaur: "Dinossauro de Brincar",
            obj_Slides: "Escorregas", obj_Chameleon: "Camaleão", obj_Boots: "Botas"
        },
        'pt-BR': {
            obj_Slide: "Escorregador", obj_Swing: "Balanço", obj_Sandbox: "Tanque de Areia", obj_Seesaw: "Gangorra", obj_Ball: "Bola", obj_Jump_Rope: "Corda de Pular", obj_KitePg: "Pipa", obj_Bicycle: "Bicicleta", obj_Bench: "Banco", obj_Tree: "Árvore", obj_Bird: "Pássaro", obj_Cloud: "Nuvem", obj_Sun: "Sol", obj_Flower: "Flor",
            obj_Bag: "Bolsa", obj_Flag: "Bandeira", obj_Swings: "Balanços", obj_Climbing_Net: "Rede de Escalada", obj_Merry_Go_Round: "Carrossel", obj_Bridge: "Ponte", obj_Playhouse: "Casinha",
            obj_Toy_Truck: "Caminhão de Brinquedo", obj_Dinosaur: "Dinossauro", obj_Bucket: "Balde", obj_Shovel: "Pá", obj_Backpack: "Mochila", obj_Treasure_Chest: "Baú do Tesouro",
            obj_Dog: "Cachorro", obj_Lizard: "Lagarto", obj_Squirrel: "Esquilo", obj_Butterfly: "Borboleta", obj_Lamp_Post: "Poste de Luz", obj_Flower_Patch: "Canteiro de Flores",
            obj_Clouds: "Nuvens", obj_Flowers: "Flores", obj_Sand_Castles: "Castelos de Areia", obj_Fence: "Cerca", obj_Bushes: "Arbustos", obj_Toy_Dinosaur: "Dinossauro de Brinquedo",
            obj_Slides: "Escorregadores", obj_Chameleon: "Camaleão", obj_Boots: "Botas"
        },
        'fr': {
            obj_Slide: "Toboggan", obj_Swing: "Balançoire", obj_Sandbox: "Bac à Sable", obj_Seesaw: "Tape-cul", obj_Ball: "Ballon", obj_Jump_Rope: "Corde à Sauter", obj_KitePg: "Cerf-volant", obj_Bicycle: "Vélo", obj_Bench: "Banc", obj_Tree: "Arbre", obj_Bird: "Oiseau", obj_Cloud: "Nuage", obj_Sun: "Soleil", obj_Flower: "Fleur",
            obj_Bag: "Sac", obj_Flag: "Drapeau", obj_Swings: "Balançoires", obj_Climbing_Net: "Filet d'Escalade", obj_Merry_Go_Round: "Manège", obj_Bridge: "Pont", obj_Playhouse: "Cabane",
            obj_Toy_Truck: "Camion Jouet", obj_Dinosaur: "Dinosaure", obj_Bucket: "Seau", obj_Shovel: "Pelle", obj_Backpack: "Sac à Dos", obj_Treasure_Chest: "Coffre au Trésor",
            obj_Dog: "Chien", obj_Lizard: "Lézard", obj_Squirrel: "Écureuil", obj_Butterfly: "Papillon", obj_Lamp_Post: "Réverbère", obj_Flower_Patch: "Parterre de Fleurs",
            obj_Clouds: "Nuages", obj_Flowers: "Fleurs", obj_Sand_Castles: "Châteaux de Sable", obj_Fence: "Clôture", obj_Bushes: "Buissons", obj_Toy_Dinosaur: "Dinosaure Jouet",
            obj_Slides: "Toboggans", obj_Chameleon: "Caméléon", obj_Boots: "Bottes"
        },
        'ja': {
            obj_Slide: "すべり台", obj_Swing: "ブランコ", obj_Sandbox: "砂場", obj_Seesaw: "シーソー", obj_Ball: "ボール", obj_Jump_Rope: "縄跳び", obj_KitePg: "凧", obj_Bicycle: "自転車", obj_Bench: "ベンチ", obj_Tree: "木", obj_Bird: "鳥", obj_Cloud: "雲", obj_Sun: "太陽", obj_Flower: "花",
            obj_Bag: "かばん", obj_Flag: "はた", obj_Swings: "ブランコたち", obj_Climbing_Net: "クライミングネット", obj_Merry_Go_Round: "メリーゴーラウンド", obj_Bridge: "橋", obj_Playhouse: "小さな家",
            obj_Toy_Truck: "おもちゃのトラック", obj_Dinosaur: "恐竜", obj_Bucket: "バケツ", obj_Shovel: "シャベル", obj_Backpack: "リュックサック", obj_Treasure_Chest: "宝箱",
            obj_Dog: "犬", obj_Lizard: "トカゲ", obj_Squirrel: "リス", obj_Butterfly: "ちょうちょ", obj_Lamp_Post: "街灯", obj_Flower_Patch: "花だん",
            obj_Clouds: "雲たち", obj_Flowers: "花たち", obj_Sand_Castles: "砂のお城", obj_Fence: "フェンス", obj_Bushes: "茂み", obj_Toy_Dinosaur: "おもちゃの恐竜",
            obj_Slides: "すべり台たち", obj_Chameleon: "カメレオン", obj_Boots: "ブーツ"
        },
        'bn': {
            obj_Slide: "স্লাইড", obj_Swing: "দোলনা", obj_Sandbox: "স্যান্ডবক্স", obj_Seesaw: "সিস", obj_Ball: "বল", obj_Jump_Rope: "লাফ দড়ি", obj_KitePg: "ঘুড়ি", obj_Bicycle: "সাইকেল", obj_Bench: "বেঞ্চ", obj_Tree: "গাছ", obj_Bird: "পাখি", obj_Cloud: "মেঘ", obj_Sun: "সূর্য", obj_Flower: "ফুল",
            obj_Bag: "ব্যাগ", obj_Flag: "পতাকা", obj_Swings: "দোলনা", obj_Climbing_Net: "আরোহণের জাল", obj_Merry_Go_Round: "মেরি-গো-রাউন্ড", obj_Bridge: "সেতু", obj_Playhouse: "ছোট ঘর",
            obj_Toy_Truck: "খেলনা ট্রাক", obj_Dinosaur: "ডাইনোসর", obj_Bucket: "বালতি", obj_Shovel: "কোদাল", obj_Backpack: "পিঠব্যাগ", obj_Treasure_Chest: "ধনভাণ্ডার",
            obj_Dog: "কুকুর", obj_Lizard: "টিকটিকি", obj_Squirrel: "কাঠবিড়ালি", obj_Butterfly: "প্রজাপতি", obj_Lamp_Post: "ল্যাম্পপোস্ট", obj_Flower_Patch: "ফুলের বাগান",
            obj_Clouds: "মেঘগুলো", obj_Flowers: "ফুলগুলো", obj_Sand_Castles: "বালুর দুর্গ", obj_Fence: "বেড়া", obj_Bushes: "ঝোপঝাড়", obj_Toy_Dinosaur: "খেলনা ডাইনোসর",
            obj_Slides: "স্লাইডগুলো", obj_Chameleon: "গিরগিটি", obj_Boots: "বুট"
        },
        'gu': {
            obj_Slide: "લપસણી", obj_Swing: "હીંચકો", obj_Sandbox: "સેન્ડબોક્સ", obj_Seesaw: "સીસો", obj_Ball: "દડો", obj_Jump_Rope: "દોરડા કૂદ", obj_KitePg: "પતંગ", obj_Bicycle: "સાયકલ", obj_Bench: "બાંકડો", obj_Tree: "ઝાડ", obj_Bird: "પક્ષી", obj_Cloud: "વાદળ", obj_Sun: "સૂર્ય", obj_Flower: "ફૂલ",
            obj_Bag: "થેલી", obj_Flag: "ધ્વજ", obj_Swings: "ઝૂલાઓ", obj_Climbing_Net: "ચડવાની જાળ", obj_Merry_Go_Round: "કેરોસલ", obj_Bridge: "પુલ", obj_Playhouse: "નાનું ઘર",
            obj_Toy_Truck: "ખિલૌના ટ્રક", obj_Dinosaur: "ડાઈનાસોર", obj_Bucket: "બાલ્ટી", obj_Shovel: "ફાવડો", obj_Backpack: "બૅકપૅક", obj_Treasure_Chest: "ખજાનાનું પેટી",
            obj_Dog: "કૂતરો", obj_Lizard: "છિપકલી", obj_Squirrel: "ખિસકોલી", obj_Butterfly: "પતંગિયા", obj_Lamp_Post: "દીવટાનો થાંભલો", obj_Flower_Patch: "ફૂલોનુ ખેતર",
            obj_Clouds: "વાદળો", obj_Flowers: "ફૂલો", obj_Sand_Castles: "રેતીના કિલ્લા", obj_Fence: "વાડ", obj_Bushes: "ઝાડીઓ", obj_Toy_Dinosaur: "ખિલૌના ડાઈનાસોર",
            obj_Slides: "સ્લાઇડ્સ", obj_Chameleon: "ગિરગિટ", obj_Boots: "બૂટ"
        },
        'mr': {
            obj_Slide: "घसरगुंडी", obj_Swing: "झोपाळा", obj_Sandbox: "वाळूचा खड्डा", obj_Seesaw: "सी-सॉ", obj_Ball: "चेंडू", obj_Jump_Rope: "दोरीच्या उड्या", obj_KitePg: "पतंग", obj_Bicycle: "सायकल", obj_Bench: "बाक", obj_Tree: "झाड", obj_Bird: "पक्षी", obj_Cloud: "ढग", obj_Sun: "सूर्य", obj_Flower: "फूल",
            obj_Bag: "पिशवी", obj_Flag: "ध्वज", obj_Swings: "झुले", obj_Climbing_Net: "चढाईची जाळी", obj_Merry_Go_Round: "मेरी-गो-राउंड", obj_Bridge: "पूल", obj_Playhouse: "छोटंसं घर",
            obj_Toy_Truck: "खेळण्याचा ट्रक", obj_Dinosaur: "डायनासोर", obj_Bucket: "बादली", obj_Shovel: "फावडा", obj_Backpack: "पाठीची बॅग", obj_Treasure_Chest: "खजिन्याची पेटी",
            obj_Dog: "कुत्रा", obj_Lizard: "पाल", obj_Squirrel: "खार", obj_Butterfly: "फुलपाखरू", obj_Lamp_Post: "दिव्याचा खांब", obj_Flower_Patch: "फुलांची वाफा",
            obj_Clouds: "ढग", obj_Flowers: "फुले", obj_Sand_Castles: "वाळूचे किल्ले", obj_Fence: "तटबंदी", obj_Bushes: "झुडपे", obj_Toy_Dinosaur: "खेळण्याचा डायनासोर",
            obj_Slides: "घसरगुंड्या", obj_Chameleon: "सरडा", obj_Boots: "बूट"
        },
        'kn': {
            obj_Slide: "ಜಾರುಬಂಡಿ", obj_Swing: "ಉಯ್ಯಾಲೆ", obj_Sandbox: "ಮರಳಿನ ಗುಂಡಿ", obj_Seesaw: "ಸೀಸಾ", obj_Ball: "ಚೆಂಡು", obj_Jump_Rope: "ಜಿಗಿಯುವ ಹಗ್ಗ", obj_KitePg: "ಗಾಳಿಪಟ", obj_Bicycle: "ಸೈಕಲ್", obj_Bench: "ಬೆಂಚು", obj_Tree: "ಮರ", obj_Bird: "ಹಕ್ಕಿ", obj_Cloud: "ಮೋಡ", obj_Sun: "ಸೂರ್ಯ", obj_Flower: "ಹೂವು",
            obj_Bag: "ಚೀಲ", obj_Flag: "ಧ್ವಜ", obj_Swings: "ಉಯ್ಯಾಲೆಗಳು", obj_Climbing_Net: "ಹತ್ತುವ ಬಲೆ", obj_Merry_Go_Round: "ಮೇರಿ-ಗೋ-ರೌಂಡ್", obj_Bridge: "ಸೇತುವೆ", obj_Playhouse: "ಸಣ್ಣ ಮನೆ",
            obj_Toy_Truck: "ಆಟದ ಲಾರಿ", obj_Dinosaur: "ಡೈನೋಸಾರ್", obj_Bucket: "ಬಕೆಟ್", obj_Shovel: "ಗುಡಾಳಿ", obj_Backpack: "ಮೂಟೆ", obj_Treasure_Chest: "ಧನಪೆಟ್ಟಿಗೆ",
            obj_Dog: "ನಾಯಿ", obj_Lizard: "ಹಳ್ಳಿಯ", obj_Squirrel: "ಅಡಿಕೆಲಿ", obj_Butterfly: "ಚಿಟ್ಟೆ", obj_Lamp_Post: "ದೀಪಸ್ತಂಭ", obj_Flower_Patch: "ಹೂಗಿಡ",
            obj_Clouds: "ಮೋಡಗಳು", obj_Flowers: "ಹೂಗಳು", obj_Sand_Castles: "ಮರಳಿನ ಕೋಟೆಗಳು", obj_Fence: "ಗೇಟ್", obj_Bushes: "ಗಿಡಗುಂಪು", obj_Toy_Dinosaur: "ಆಟದ ಡೈನೋಸಾರ್",
            obj_Slides: "ಜಾರುಬಂಡಿಗಳು", obj_Chameleon: "ಉರಗ", obj_Boots: "ಬೂಟುಗಳು"
        },
        'ta': {
            obj_Slide: "சறுக்குமரம்", obj_Swing: "ஊஞ்சல்", obj_Sandbox: "மணல் பெட்டி", obj_Seesaw: "சீசா", obj_Ball: "பந்து", obj_Jump_Rope: "ஸ்கிப்பிங் கயிறு", obj_KitePg: "பட்டம்", obj_Bicycle: "மிதிவண்டி", obj_Bench: "பெஞ்ச்", obj_Tree: "மரம்", obj_Bird: "பறவை", obj_Cloud: "மேகம்", obj_Sun: "சூரியன்", obj_Flower: "பூ",
            obj_Bag: "பை", obj_Flag: "கொடி", obj_Swings: "ஊஞ்சல்கள்", obj_Climbing_Net: "ஏறும் வலை", obj_Merry_Go_Round: "மேறி கோ ரவுண்ட்", obj_Bridge: "பாலம்", obj_Playhouse: "சிறு வீடு",
            obj_Toy_Truck: "விளையாட்டு லாரி", obj_Dinosaur: "டையாக்னோசர்", obj_Bucket: "வாளி", obj_Shovel: "கரண்டி", obj_Backpack: "பைகளிமை", obj_Treasure_Chest: "செல்வப் பெட்டி",
            obj_Dog: "நாய்", obj_Lizard: "பல்லி", obj_Squirrel: "அணில்", obj_Butterfly: "வண்ணத்துப்பூச்சி", obj_Lamp_Post: "விளக்கு தூண்", obj_Flower_Patch: "மலர் புல்வெளி",
            obj_Clouds: "மேகங்கள்", obj_Flowers: "மலர்கள்", obj_Sand_Castles: "மணல் கோட்டைகள்", obj_Fence: "வேலி", obj_Bushes: "புதர்கள்", obj_Toy_Dinosaur: "விளையாட்டு டையாக்னோசர்",
            obj_Slides: "சறுக்குமரங்கள்", obj_Chameleon: "பச்சோந்தி", obj_Boots: "செருப்பு"
        },
        'ml': {
            obj_Slide: "സ്ലൈഡ്", obj_Swing: "ഊഞ്ഞാൽ", obj_Sandbox: "മണൽക്കുഴി", obj_Seesaw: "സീസോ", obj_Ball: "പന്ത്", obj_Jump_Rope: "ചാട്ടക്കയർ", obj_KitePg: "പട്ടം", obj_Bicycle: "സൈക്കിൾ", obj_Bench: "ബെഞ്ച്", obj_Tree: "മരം", obj_Bird: "പക്ഷി", obj_Cloud: "മേഘം", obj_Sun: "സൂര്യൻ", obj_Flower: "പൂവ്",
            obj_Bag: "ബാഗ്", obj_Flag: "കോടി", obj_Swings: "ഊഞ്ഞാലുകൾ", obj_Climbing_Net: "കയറുന്ന വല", obj_Merry_Go_Round: "മെറി ഗോ റൗണ്ട്", obj_Bridge: "പാലം", obj_Playhouse: "ചെറിയ വീട്",
            obj_Toy_Truck: "കളിപ്പാട്ട ട്രക്ക്", obj_Dinosaur: "ഡൈനോസർ", obj_Bucket: "ബക്കറ്റ്", obj_Shovel: "കരണ്ടി", obj_Backpack: "ബാക്ക്പാക്ക്", obj_Treasure_Chest: "നിധിപ്പെട്ടി",
            obj_Dog: "നായ", obj_Lizard: "ഒല", obj_Squirrel: "അണലി", obj_Butterfly: "ശലഭം", obj_Lamp_Post: "ദീപസ്തംഭം", obj_Flower_Patch: "പുഷ്പത്തറ",
            obj_Clouds: "മേഘങ്ങൾ", obj_Flowers: "പൂക്കൾ", obj_Sand_Castles: "മണൽ കൊട്ടാരങ്ങൾ", obj_Fence: "കമ്പിവേലി", obj_Bushes: "പുതങ്ങൾ", obj_Toy_Dinosaur: "കളിപ്പാട്ട ഡൈനോസർ",
            obj_Slides: "സ്ലൈഡുകൾ", obj_Chameleon: "ഛലക", obj_Boots: "ബൂട്ടുകൾ"
        },
        'pa': {
            obj_Slide: "ਸਲਾਈਡ", obj_Swing: "ਝੂਲਾ", obj_Sandbox: "ਸੈਂਡਬੌਕਸ", obj_Seesaw: "ਸੀ-ਸਾ", obj_Ball: "ਗੇਂਦ", obj_Jump_Rope: "ਕੁੱਦਣ ਵਾਲੀ ਰੱਸੀ", obj_KitePg: "ਪਤੰਗ", obj_Bicycle: "ਸਾਈਕਲ", obj_Bench: "ਬੈਂਚ", obj_Tree: "ਰੁੱਖ", obj_Bird: "ਪੰਛੀ", obj_Cloud: "ਬੱਦਲ", obj_Sun: "ਸੂਰਜ", obj_Flower: "ਫੁੱਲ",
            obj_Bag: "ਬੈਗ", obj_Flag: "ਝੰਡਾ", obj_Swings: "ਝੂਲੇ", obj_Climbing_Net: "ਚੜ੍ਹਾਈ ਵਾਲਾ ਜਾਲ", obj_Merry_Go_Round: "ਮੇਰੀ ਗੋ ਰਾਊਂਡ", obj_Bridge: "ਪੁਲ", obj_Playhouse: "ਛੋਟਾ ਘਰ",
            obj_Toy_Truck: "ਖਿਡੌਣਾ ਟਰੱਕ", obj_Dinosaur: "ਡਾਇਨਾਸੋਰ", obj_Bucket: "ਬਾਲਟੀ", obj_Shovel: "ਫਾਵੜਾ", obj_Backpack: "ਬੈਗ", obj_Treasure_Chest: "ਖਜਾਨੇ ਦਾ ਸੰਦੂਕ",
            obj_Dog: "ਕੁੱਤਾ", obj_Lizard: "ਛਿਪਕਲੀ", obj_Squirrel: "ਗਿਲਹਿਰੀ", obj_Butterfly: "ਤਿਤਲੀ", obj_Lamp_Post: "ਲਾਈਟ ਦਾ ਖੰਭਾ", obj_Flower_Patch: "ਫੁੱਲਾਂ ਦਾ ਟੁਕੜਾ",
            obj_Clouds: "ਬੱਦਲ", obj_Flowers: "ਫੁੱਲਾਂ", obj_Sand_Castles: "ਰੇਤ ਦੇ ਕਿਲ੍ਹੇ", obj_Fence: "ਬਾੜ", obj_Bushes: "ਝਾੜੀਆਂ", obj_Toy_Dinosaur: "ਖਿਡੌਣਾ ਡਾਇਨਾਸੋਰ",
            obj_Slides: "ਸਲਾਈਡਾਂ", obj_Chameleon: "ਗਿਰਗਿੱਟ", obj_Boots: "ਜੁੱਤੇ"
        },
        'sw': {
            obj_Slide: "Slaidi", obj_Swing: "Bembea", obj_Sandbox: "Sanduku la Mchanga", obj_Seesaw: "Bembesani", obj_Ball: "Mpira", obj_Jump_Rope: "Kamba ya Kuruka", obj_KitePg: "Kishada", obj_Bicycle: "Baiskeli", obj_Bench: "Benchi", obj_Tree: "Mti", obj_Bird: "Ndege", obj_Cloud: "Wingu", obj_Sun: "Jua", obj_Flower: "Ua",
            obj_Bag: "Mfuko", obj_Flag: "Bendera", obj_Swings: "Bembea", obj_Climbing_Net: "Wavu wa Kupanda", obj_Merry_Go_Round: "Merry-go-round", obj_Bridge: "Daraja", obj_Playhouse: "Nyumba Ndogo",
            obj_Toy_Truck: "Gari la Watoto", obj_Dinosaur: "Dinosauri", obj_Bucket: "Ndoo", obj_Shovel: "Koleo", obj_Backpack: "Begilau", obj_Treasure_Chest: "Sanduku la Hazina",
            obj_Dog: "Mbwa", obj_Lizard: "Mjusi", obj_Squirrel: "Kindi", obj_Butterfly: "Kipepeo", obj_Lamp_Post: "Taa ya Barabarani", obj_Flower_Patch: "Sehemu ya Maua",
            obj_Clouds: "Mawingu", obj_Flowers: "Maua", obj_Sand_Castles: "Majumba ya Mchanga", obj_Fence: "Uzio", obj_Bushes: "Vichaka", obj_Toy_Dinosaur: "Dinosauri ya Watoto",
            obj_Slides: "Slaidi", obj_Chameleon: "Kinyonga", obj_Boots: "Buti"
        },
        'ms': {
            obj_Slide: "Papan Gelongsor", obj_Swing: "Buaian", obj_Sandbox: "Kotak Pasir", obj_Seesaw: "Jongkang-jongket", obj_Ball: "Bola", obj_Jump_Rope: "Tali Lompat", obj_KitePg: "Layang-layang", obj_Bicycle: "Basikal", obj_Bench: "Bangku", obj_Tree: "Pokok", obj_Bird: "Burung", obj_Cloud: "Awan", obj_Sun: "Matahari", obj_Flower: "Bunga",
            obj_Bag: "Beg", obj_Flag: "Bendera", obj_Swings: "Buaian", obj_Climbing_Net: "Jaring Panjat", obj_Merry_Go_Round: "Karusel", obj_Bridge: "Jambatan", obj_Playhouse: "Rumah Mainan",
            obj_Toy_Truck: "Lori Mainan", obj_Dinosaur: "Dinosaur", obj_Bucket: "Baldi", obj_Shovel: "Penyodok", obj_Backpack: "Beg Galas", obj_Treasure_Chest: "Peti Harta Karun",
            obj_Dog: "Anjing", obj_Lizard: "Cicak", obj_Squirrel: "Tupai", obj_Butterfly: "Rama-rama", obj_Lamp_Post: "Tiang Lampu", obj_Flower_Patch: "Kawasan Bunga",
            obj_Clouds: "Awan", obj_Flowers: "Bunga-bunga", obj_Sand_Castles: "Istana Pasir", obj_Fence: "Pagar", obj_Bushes: "Belukar", obj_Toy_Dinosaur: "Dinosaur Mainan",
            obj_Slides: "Papan Gelongsor", obj_Chameleon: "Sesumpah", obj_Boots: "But"
        },
        'tl': {
            obj_Slide: "Dulasan", obj_Swing: "Duyan", obj_Sandbox: "Sandbox", obj_Seesaw: "Seesaw", obj_Ball: "Bola", obj_Jump_Rope: "Lubid na Panlaktaw", obj_KitePg: "Saranggola", obj_Bicycle: "Bisikleta", obj_Bench: "Benko", obj_Tree: "Puno", obj_Bird: "Ibon", obj_Cloud: "Ulap", obj_Sun: "Araw", obj_Flower: "Bulaklak",
            obj_Bag: "Bag", obj_Flag: "Bandila", obj_Swings: "Duyan", obj_Climbing_Net: "Climbing Net", obj_Merry_Go_Round: "Merry-go-round", obj_Bridge: "Tulay", obj_Playhouse: "Maliit na Bahay",
            obj_Toy_Truck: "Laruan na Truck", obj_Dinosaur: "Dinosaur", obj_Bucket: "Balde", obj_Shovel: "Pala", obj_Backpack: "Backpack", obj_Treasure_Chest: "Kahon ng Kayamanan",
            obj_Dog: "Aso", obj_Lizard: "Butiki", obj_Squirrel: "Oras", obj_Butterfly: "Paruparo", obj_Lamp_Post: "Poste ng Ilaw", obj_Flower_Patch: "Hardin ng Bulaklak",
            obj_Clouds: "Mga Ulap", obj_Flowers: "Mga Bulaklak", obj_Sand_Castles: "Mga Kastilyong Bula", obj_Fence: "Bakod", obj_Bushes: "Palumpong", obj_Toy_Dinosaur: "Laruan na Dinosaur",
            obj_Slides: "Mga Dulasan", obj_Chameleon: "Kamyelyon", obj_Boots: "Bota"
        }
    }
};
