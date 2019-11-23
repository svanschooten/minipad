const states = {
    none: "none",
    idle: "idle",
    playing: "playing",
    stopped: "stopped",
    paused: "paused",
    untrained: "untrained",
    training: "training",
    editing: "editing",
};

const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const localStorageTag = "minipad.elements";

const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};
