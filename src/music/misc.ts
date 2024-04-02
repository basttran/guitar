import { pipe } from "../pipe/pipe";

const ONE_SECOND = 1;
const TOLERABLE_VOLUME = 0.1;

// From documentation
export const doPlayNote_Origins =
  (audioContext: AudioContext) => (frequency: number) => {
    // get audio nodes
    const oscillator = new OscillatorNode(audioContext);
    const gain = new GainNode(audioContext);
    gain.gain.value = TOLERABLE_VOLUME; // hardcoded gain value 0.1
    const destination = audioContext.destination;

    // connect nodes
    oscillator.connect(gain);
    gain.connect(destination);

    // set oscillator to the provided frequency
    oscillator.frequency.value = frequency;
    // start oscillation and stop it after a hardcoded duration 1''
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + ONE_SECOND);
  };

// Extract audio nodes definitions
const getAudioNodes = (audioContext: AudioContext) => {
  const oscillator = new OscillatorNode(audioContext);
  const gain = new GainNode(audioContext);
  gain.gain.value = TOLERABLE_VOLUME;
  const destination = audioContext.destination;
  return {
    oscillator,
    gain,
    destination,
  };
};

export const doPlayNote_Begins =
  (audioContext: AudioContext) => (frequency: number) => {
    // get audio nodes
    const { oscillator, gain, destination } = getAudioNodes(audioContext);

    // connect nodes
    oscillator.connect(gain);
    gain.connect(destination);

    // set oscillator to the provided frequency
    oscillator.frequency.value = frequency;
    // start oscillation and stop it after a hardcoded duration
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + ONE_SECOND);
  };

// Extracted oscillator frequency assignation
const setPitch =
  (frequency: number) =>
  (oscillator: OscillatorNode): OscillatorNode => {
    oscillator.frequency.value = frequency;
    return oscillator;
  };

// Extracted
const doSetValue =
  (audioContext: AudioContext) =>
  (duration: number) =>
  (oscillator: OscillatorNode): OscillatorNode => {
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    return oscillator;
  };

export const doPlayNote_Evolved =
  (audioContext: AudioContext) => (frequency: number) => {
    const { oscillator, gain, destination } = getAudioNodes(audioContext);
    const setValue = doSetValue(audioContext);

    oscillator.connect(gain);
    gain.connect(destination);

    setPitch(frequency)(oscillator);
    setValue(ONE_SECOND)(oscillator);
  };

const connect = (nextNode: AudioNode) => (previousNode: AudioNode) => {
  return previousNode.connect(nextNode);
};

export const doPlayNote_Untold =
  (audioContext: AudioContext) => (frequency: number) => {
    const { oscillator, gain, destination } = getAudioNodes(audioContext);
    const setValue = doSetValue(audioContext);

    connect(gain)(oscillator);
    connect(destination)(gain);

    setPitch(frequency)(oscillator);
    setValue(ONE_SECOND)(oscillator);
  };

export const doPlayNote_Apocalypse =
  (audioContext: AudioContext) => (frequency: number) => {
    const { oscillator, gain, destination } = getAudioNodes(audioContext);
    const setValue = doSetValue(audioContext);

    connect(destination)(connect(gain)(oscillator));
    setValue(ONE_SECOND)(setPitch(frequency)(oscillator));
  };

export const doPlayNote_Aftermath =
  (audioContext: AudioContext) => (frequency: number) => {
    const { oscillator, gain, destination } = getAudioNodes(audioContext);
    const setValue = doSetValue(audioContext);

    pipe(oscillator, connect(gain), connect(destination));
    pipe(oscillator, setPitch(frequency), setValue(ONE_SECOND));
  };

const getHardware = (audioContext: AudioContext) => {
  const oscillator = new OscillatorNode(audioContext);
  const gain = new GainNode(audioContext);
  gain.gain.value = TOLERABLE_VOLUME;
  const amplifier = connect(gain);
  const speaker = connect(audioContext.destination);

  return {
    oscillator,
    amplifier,
    speaker,
  };
};

const doGetHands = (audioContext: AudioContext, frequency: number) => {
  const setValue = doSetValue(audioContext);

  return {
    leftHand: setPitch(frequency),
    rightHand: setValue(ONE_SECOND),
  };
};

export const doPlayNote_Rebirth =
  (audioContext: AudioContext) => (frequency: number) => {
    const { oscillator, amplifier, speaker } = getHardware(audioContext);
    const { leftHand, rightHand } = doGetHands(audioContext, frequency);
    pipe(oscillator, amplifier, speaker);
    pipe(oscillator, leftHand, rightHand);
  };

const plugHardware = pipe;

const playString = (
  oscillator: OscillatorNode,
  leftHand: (oscillator: OscillatorNode) => OscillatorNode,
  rightHand: (oscillator: OscillatorNode) => OscillatorNode
) => pipe(oscillator, leftHand, rightHand);

const getExtraHardware = (audioContext: AudioContext) => {
  const delay = connect(
    new DelayNode(audioContext, {
      delayTime: 4,
    })
  );
  const compressor = connect(
    new DynamicsCompressorNode(audioContext, {
      attack: 1,
      knee: 1,
      ratio: 0.3,
      release: 1,
      threshold: 0.02,
    })
  );

  return {
    delay,
    compressor,
  };
};

export const doPlayNote_Beyond =
  (audioContext: AudioContext) => (frequency: number) => {
    const { oscillator, amplifier, speaker } = getHardware(audioContext);
    const { compressor, delay } = getExtraHardware(audioContext);
    const { leftHand, rightHand } = doGetHands(audioContext, frequency);
    plugHardware(oscillator, compressor, delay, amplifier, speaker);
    playString(oscillator, leftHand, rightHand);
  };

type Notes = {
  notation: string;
  chroma: string;
  octave: number;
  frequency: number;
};

const twelthRootOfTwo = Math.pow(2, 1 / 12);
const las = [{ frequency: 440, octave: 3 }];

export const notes: Notes[] = las.flatMap((la) =>
  ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"].map(
    (note, index) => ({
      chroma: note,
      notation: `${note} (${index > 2 ? la.octave + 1 : la.octave})`,
      octave: la.octave,
      frequency: la.frequency * Math.pow(twelthRootOfTwo, index),
    })
  )
);
