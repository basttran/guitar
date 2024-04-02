// import { describe, it, expect, vi } from "vitest";

// check conf vitest dom > node
// describe("Play Note", () => {
//   const buildFakeAudioContext = () =>
//     ({
//       destination: {
//         connect: (destinationNode) => {
//           return destinationNode as AudioNode;
//         },
//       } as AudioDestinationNode,
//       createGain: () => {
//         return {
//           gain: {
//             value: 1,
//           } as GainNode["gain"],
//           connect: (destinationNode) => {
//             return destinationNode as AudioNode;
//           },
//         } as GainNode;
//       },
//       createOscillator: () => {
//         return {
//           frequency: {
//             value: 0,
//           } as OscillatorNode["frequency"],
//           start: () => {},
//           stop: () => {},
//           connect: (destinationNode: AudioNode | AudioParam) => {
//             return destinationNode as AudioNode;
//           },
//         } as OscillatorNode;
//       },
//     } as AudioContext);

//   it("playNote", () => {
//     // given
//     const audioContext = buildFakeAudioContext();
//     const createOscillator = vi.spyOn(audioContext, "createOscillator");
//     const createGain = vi.spyOn(audioContext, "createGain");
//     const { play, oscillator, gain, destination } =
//       doPlayNoteBegins(audioContext);
//     const oscillatorConnect = vi.spyOn(oscillator, "connect");
//     const gainConnect = vi.spyOn(gain, "connect");
//     const oscillatorStart = vi.spyOn(oscillator, "start");
//     const oscillatorStop = vi.spyOn(oscillator, "stop");
//     const la = 440;

//     // when
//     play(la);

//     //then
//     expect(createOscillator).toHaveBeenCalledTimes(1);
//     expect(createGain).toHaveBeenCalledTimes(1);
//     expect(oscillatorConnect).toHaveBeenCalledTimes(1);
//     expect(gainConnect).toHaveBeenCalledTimes(1);
//     expect(oscillatorConnect).toHaveReturnedWith(gain);
//     expect(gainConnect).toHaveReturnedWith(destination);
//     expect(oscillator.frequency.value).toEqual(440);
//     expect(oscillatorStart).toHaveBeenCalledTimes(1);
//     expect(oscillatorStop).toHaveBeenCalledTimes(1);
//   });
// });

export {};
