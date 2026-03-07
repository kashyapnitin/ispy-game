const fs = require('fs');

const scenes = {
    "bedroom": ["Bed", "Pillow", "Blanket", "Lamp", "Closet", "Pajamas", "Rug", "Window", "Bookshelf", "Teddy Bear", "Slippers", "Mirror", "Curtains", "Clock"],
    "bathroom": ["Bathtub", "Towel", "Soap", "Toothbrush", "Mirror", "Sink", "Toilet", "Shower", "Sponge", "Shampoo", "Toilet Paper", "Comb", "Toothpaste", "Rubber Duck"],
    "farm": ["Cow", "Pig", "Sheep", "Tractor", "Barn", "Horse", "Chicken", "Duck", "Goat", "Hay", "Fence", "Farmer", "Dog", "Cat"],
    "supermarket": ["Milk", "Bread", "Eggs", "Banana", "Cart", "Apple", "Cheese", "Juice", "Cereal", "Tomato", "Carrot", "Meat", "Cash Register", "Bag"],
    "zoo": ["Lion", "Elephant", "Giraffe", "Tiger", "Monkey", "Zebra", "Hippo", "Rhino", "Bear", "Penguin", "Snake", "Crocodile", "Kangaroo", "Parrot"],
    "beach": ["Sand", "Shell", "Umbrella", "Boat", "Crab", "Sun", "Towel", "Ball", "Bucket", "Spade", "Starfish", "Sunglasses", "Ice Cream", "Palm Tree"],
    "street": ["Car", "Bus", "Traffic Light", "Building", "Stop Sign", "Tree", "Bicycle", "Motorcycle", "Truck", "Pedestrian", "Crosswalk", "Streetlamp", "Mailbox", "Bench"],
    "classroom": ["Desk", "Book", "Pencil", "Apple", "Crayon", "Blackboard", "Teacher", "Chair", "Globe", "Clock", "Ruler", "Eraser", "Backpack", "Computer"],
    "livingroom": ["Sofa", "TV", "Rug", "Plant", "Cushion", "Table", "Lamp", "Window", "Painting", "Book", "Remote", "Armchair", "Clock", "Fireplace"],
    "garden": ["Tree", "Flower", "Butterfly", "Watering Can", "Grass", "Bird", "Bee", "Snail", "Worm", "Spade", "Pot", "Hose", "Sun", "Cloud"],
    "airport": ["Airplane", "Suitcase", "Ticket", "Pilot", "Runway", "Helicopter", "Control Tower", "Passport", "Luggage Cart", "Security", "Gate", "Stewardess", "Cloud", "Sun"],
    "hospital": ["Doctor", "Stethoscope", "Bandage", "Wheelchair", "Nurse", "Bed", "Syringe", "Thermometer", "Ambulance", "Medicine", "Crutches", "Plaster", "Pill", "X-Ray"]
};

let scriptTags = [];

for (const [sceneId, items] of Object.entries(scenes)) {
    const filePath = `js/data/scenes/scene-${sceneId}.js`;
    scriptTags.push(`<script src="${filePath}"></script>`);

    let objectsStr = [];
    let enDict = [];
    let esDict = [];
    let hiDict = [];
    let zhDict = [];

    items.forEach((item, i) => {
        const safeName = item.replace(/ /g, "_");
        const objId = `${sceneId.substring(0, 3)}_${i + 1}`;
        const px = Math.floor(Math.random() * 80) + 10;
        const py = Math.floor(Math.random() * 80) + 10;

        objectsStr.push(`        { id: "${objId}", name: "${item}", x: ${px}, y: ${py}, w: 6, imgUrl: "assets/images/scenes/${sceneId}/${safeName}.png" }`);
        enDict.push(`obj_${safeName}: "${item}"`);
        esDict.push(`obj_${safeName}: "${item} (ES)"`);
        hiDict.push(`obj_${safeName}: "${item} (HI)"`);
        zhDict.push(`obj_${safeName}: "${item} (ZH)"`);
    });

    const content = `// Ensure the global registry exists
window.ISPY_SCENES = window.ISPY_SCENES || {};

window.ISPY_SCENES.${sceneId} = {
    id: '${sceneId}',
    bgImage: 'assets/images/scenes/${sceneId}/scene_${sceneId}.jpg',
    // OrigWidth/Height will be populated dynamically at load time
    objects: [
${objectsStr.join(",\n")}
    ],
    // Localized dictionary specific to this scene's items
    i18n: {
        en: {
            ${enDict.join(", ")}
        },
        es: {
            ${esDict.join(", ")}
        },
        hi: {
            ${hiDict.join(", ")}
        },
        zh: {
            ${zhDict.join(", ")}
        }
    }
};
`;
    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath}`);
}

let html = fs.readFileSync("index.html", "utf8");
if (!html.includes("scene-bedroom.js")) {
    const injectStr = scriptTags.join("\n    ");
    const target = `<script src="js/data/scenes/scene-playground.js"></script>`;
    if (html.includes(target)) {
        html = html.replace(target, target + "\n    " + injectStr);
        fs.writeFileSync("index.html", html);
        console.log("Injected script tags into index.html");
    }
}
