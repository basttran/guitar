import { pipe } from "../pipe/pipe";

const ONE_SECOND = 1;
const TOLERABLE_VOLUME = 0.1;

const setPitch =
  (frequency: number) =>
  (oscillator: OscillatorNode): OscillatorNode => {
    oscillator.frequency.value = frequency;
    return oscillator;
  };

const doSetValue =
  (audioContext: AudioContext) =>
  (duration: number) =>
  (oscillator: OscillatorNode): OscillatorNode => {
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    return oscillator;
  };

const connect = (nextNode: AudioNode) => (previousNode: AudioNode) => {
  return previousNode.connect(nextNode);
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

export const doPlayNote =
  (audioContext: AudioContext) => (frequency: number) => {
    const { oscillator, amplifier, speaker } = getHardware(audioContext);
    const { leftHand, rightHand } = doGetHands(audioContext, frequency);
    pipe(oscillator, amplifier, speaker);
    pipe(oscillator, leftHand, rightHand);
  };
