let miniPad;
const methods = {
    uploadSound: (element, event) => {
        event.stopPropagation();
        element.source = URL.createObjectURL(event.target.files[0]);
        element.name = event.target.files[0].name.split(".")[0];
        miniPad.$forceUpdate();
    },
    saveMiniPad: () => {
        localStorage.setItem(localStorageTag, JSON.stringify(miniPad.elements));
    },
    loadMiniPad: () => {
        miniPad.elements = JSON.parse(localStorage.getItem(localStorageTag));
    },
    clearMiniPad: () => {
        localStorage.removeItem(localStorageTag);
        miniPad.elements = {};
    },
    borderColor: (element) => {
        return `rgb(${element.color.r}, ${element.color.g}, ${element.color.b})`;
    },
    backgroundColor: (element) => {
        let checkStates = [states.playing, states.editing];
        let opacity = checkStates.indexOf(element.state) !== -1 ? 0.5 : 0.25;
        return `rgba(${element.color.r}, ${element.color.g}, ${element.color.b}, ${opacity})`;
    },
    clearFocus: () => {
        if (miniPad.state === states.editing) {
            miniPad.state = states.idle;
            updateAudioChain(miniPad.elements[miniPad.editing]);
            miniPad.editing = null;
        }
    },
    editElement: (element, event) => {
        event.stopPropagation();
        miniPad.state = states.editing;
        miniPad.editing = element.uid;
    },
    addElement: () => {
        let element = createElement();
        miniPad.elements[element.uid] = element;
        miniPad.$forceUpdate();
    },
    removeElement: (element) => {
        delete miniPad.elements[element.uid];
        miniPad.$forceUpdate();
    },
    trainElement: (element, event) => {
        event.stopPropagation();
        miniPad.state = states.training;
        miniPad.training = element.uid;
    },
    noOp: (event) => {
        event.stopPropagation();
    },
    updateValue: (filter, name, event) => {
        filter[name] = event.target.value;
    },
    scrollNumber: (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.target.value = parseInt(event.target.value) + (event.wheelDeltaY > 0 ? 1 : -1);
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        event.target.dispatchEvent(evt);
    },
    removeFilter: (element, filterIdx) => {
        element.filters.splice(filterIdx, 1);
        updateAudioChain(element);
        miniPad.$forceUpdate();
    },
    redraw: () => {
        miniPad.$forceUpdate();
    },
    createEmptyFilterData: createEmptyFilterData
};

miniPad = new Vue({
    el: '#minipad',
    data: {
        elements: {},
        state: states.idle,
        training: null,
        editing: null,
        filterTypes: filterTypes
    },
    methods: methods
});

window.addEventListener("keydown", (event) => {
    miniPad.clearFocus();
    if (miniPad.state === states.training) {
        const element = findElement("uid", miniPad.training);
        if (element !== null) {
            element.key = event.key;
            element.state = states.idle;
        }
        miniPad.training = null;
        miniPad.state = states.idle
    } else {
        const element = findElement("key", event.key);
        if (element !== null && element.source !== null) {
            element.state = states.playing;
            document.getElementById(element.audio).play().then(() => {}).catch(console.error);
            miniPad.$forceUpdate();
        }
    }
});

window.addEventListener("keyup", (event) => {
    if (miniPad.state !== states.training) {
        const element = findElement("key", event.key);
        if (element !== null && element.source !== null) {
            element.state = states.stopped;
            document.getElementById(element.audio).pause();
            document.getElementById(element.audio).currentTime = 0;
            miniPad.$forceUpdate();
        }
    }
});


