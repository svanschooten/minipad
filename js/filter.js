const createFilter = (data, context) => {
    let filter;
    switch (data.filter) {
        case 'biquad':
            filter = context.createBiquadFilter();
            filter.type = data.type;
            filter.gain.value = data.gain;
            filter.frequency.value = data.frequency;
    }
    return filter;
};

const updateAudioChain = (element) => {
    if (!element.media.source) {
        element.media.source = element.media.context.createMediaElementSource(document.getElementById(element.audio));
    }
    let source = element.media.source;
    for (let filterIdx in element.filters) {
        source.disconnect();
        if (element.filters.hasOwnProperty(filterIdx)) {
            let filterData = element.filters[filterIdx];
            let filter = createFilter(filterData, element.media.context);
            source.connect(filter);
            source = filter;
        }
    }
    source.connect(element.media.context.destination);
};

const createEmptyFilterData = (element) => {
    element.filters.push({
        title: "New filter",
        filter: 'biquad',
        type: 'lowpass',
        frequency: 500,
        gain: 25,
        q: 1
    });
    miniPad.$forceUpdate();
};

const filterTypes = {
    biquad: {
        lowpass: {
            description: "Standard second-order resonant lowpass filter with 12dB/octave rolloff. Frequencies below the cutoff pass through; frequencies above it are attenuated.",
            frequency: true,
            gain: false,
            q: true
        },
        highpass: {
            description: "Standard second-order resonant highpass filter with 12dB/octave rolloff. Frequencies below the cutoff are attenuated; frequencies above it pass through.",
            frequency: true,
            gain: false,
            q: true
        },
        bandpass: {
            description: "Standard second-order bandpass filter. Frequencies outside the given range of frequencies are attenuated; the frequencies inside it pass through.",
            frequency: true,
            gain: false,
            q: true
        },
        lowshelf: {
            description: "Standard second-order lowshelf filter. Frequencies lower than the frequency get a boost, or an attenuation; frequencies over it are unchanged.",
            frequency: true,
            gain: true,
            q: false
        },
        highshelf: {
            description: "Standard second-order highshelf filter. Frequencies higher than the frequency get a boost or an attenuation; frequencies lower than it are unchanged.",
            frequency: true,
            gain: true,
            q: false
        },
        peaking: {
            description: "Frequencies inside the range get a boost or an attenuation; frequencies outside it are unchanged.",
            frequency: true,
            gain: true,
            q: true
        },
        notch: {
            description: "Standard notch filter, also called a band-stop or band-rejection filter. It is the opposite of a bandpass filter: frequencies outside the give range of frequencies pass through; frequencies inside it are attenuated.",
            frequency: true,
            gain: false,
            q: true
        },
        allpass: {
            description: "Standard second-order allpass filter. It lets all frequencies through, but changes the phase-relationship between the various frequencies.",
            frequency: true,
            gain: false,
            q: true
        }
    }
};
