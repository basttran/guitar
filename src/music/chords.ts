import { O } from "../option/option";
import { notes } from "./notes";
import { pipe } from "../pipe/pipe";
import { isInaccessible } from "@testing-library/react";

export const chordNames: string[] = [
  "Amaj",
  "Amin",
  "B♭maj",
  "B♭min",
  "Bmaj",
  "Bmin",
  "Cmaj",
  "Cmin",
  "C#maj",
  "C#min",
  "Dmaj",
  "Dmin",
  "E♭maj",
  "E♭min",
  "Emaj",
  "Emin",
  "Fmaj",
  "Fmin",
  "F#maj",
  "Gmaj",
  "Gmin",
  "G#maj",
  "G#min",
];

export const chords: Record<string, string[]> = {
  Amaj: ["A", "C#", "E"],
  Amin: ["A", "C", "E"],
  // "B♭maj": ["A#", "D", "F"],
  // "B♭min": ["A#", "C#", "F"],
  Bmaj: ["B", "D#", "F#"],
  Bmin: ["B", "D", "F#"],
  Cmaj: ["C", "E", "G"],
  Cmin: ["C", "D#", "G"],
  // "C#maj": ["C#", "F", "G#"],
  // "C#min": ["C#", "E", "G#"],
  Dmaj: ["D", "F#", "A"],
  Dmin: ["D", "F", "A"],
  // "E♭maj": ["D#", "G", "A#"],
  // "E♭min": ["D#", "F#", "A#"],
  Emaj: ["E", "G#", "B"],
  Emin: ["E", "G", "B"],
  Fmaj: ["F", "A", "C"],
  Fmin: ["F", "G#", "C"],
  // "F#maj": ["F#", "A#", "C#"],
  // "F#min": ["F#", "A", "C#"],
  Gmaj: ["G", "B", "D"],
  Gmin: ["G", "A#", "D"],
  // "G#maj": ["G#", "C", "D#"],
  // "G#min": ["G#", "B", "D#"],
};

export const doPlayChord =
  (playNote: (frequency: number) => void) => (chordName: string) => {
    const playNotes = (frequencies: number[]): void =>
      frequencies.forEach((note) => playNote(note));
    pipe(
      chords[chordName],
      O.fromNullable,
      O.map(toFrequencies),
      O.filter(isNotUndefined),
      O.map(correctFrequencies),
      O.match(
        () => alert(`Unable to retrieve chord data for ${chordName}`), // on None
        playNotes // on Some
      )
    );
  };

const isNotUndefined = (value: any): boolean => value !== undefined;

const toFrequencies = (notes: string[]): Array<number | undefined> =>
  notes.map(getFrequency);

const correctFrequencies = (frequencies: number[]): number[] =>
  frequencies.map((frequency, index, self) => {
    if (index > 0 && frequency < self[0]) {
      return frequency * 2;
    }
    return frequency;
  });

const getFrequency = (chroma: string): number | undefined =>
  notes.find((note) => note.chroma === chroma)?.frequency;
