const createElement = () => {
    const uuid = uuidv4();
    return {
        uid: uuid,
        id: "element-" + uuid,
        name: "New Element",
        source: null,
        audio: "audio-" + uuid,
        filters: [],
        volume: 50,
        key: null,
        state: states.untrained,
        color: {
            r: randomBetween(0, 255),
            g: randomBetween(0, 255),
            b: randomBetween(0, 255),
        },
        media: {
            context: new AudioContext()
        }
    };
};

const findElement = (property, value) => {
    for (let idx in miniPad.elements) {
        if (miniPad.elements.hasOwnProperty(idx)) {
            if (miniPad.elements[idx][property] === value) {
                return miniPad.elements[idx];
            }
        }
    }
    return null;
};
