type AdjustedNote = {
  notation: string;
  chroma: string;
  octave: number;
  frequency: number;
};

const twelthRootOfTwo = Math.pow(2, 1 / 12);

const las = [
  // { frequency: 220, octave: 2 },
  { frequency: 440, octave: 3 },
  // { frequency: 880, octave: 4 },
];
export const notes: AdjustedNote[] = las.flatMap((la, laIndex) =>
  [
    { notation: "A", latine: "La" },
    {
      notation: "A#",
      latine: "La#",
      "alt-notation": "B♭",
      "alt-latine": "Si♭",
    },
    { notation: "B", latine: "Si" },
    { notation: "C", latine: "Do" },
    {
      notation: "C#",
      latine: "Do#",
      "alt-notation": "D♭",
      "alt-latine": "Ré♭",
    },
    { notation: "D", latine: "Ré" },
    {
      notation: "D#",
      latine: "Ré#",
      "alt-notation": "E♭",
      "alt-latine": "Mi♭",
    },
    { notation: "E", latine: "Mi" },
    { notation: "F", latine: "Fa" },
    {
      notation: "F#",
      latine: "Fa#",
      "alt-notation": "G♭",
      "alt-latine": "Sol♭",
    },
    { notation: "G", latine: "Sol" },
    {
      notation: "G#",
      latine: "Sol#",
      "alt-notation": "A♭",
      "alt-latine": "La♭",
    },
  ].map((note, index) => ({
    chroma: note.notation,
    notation: `${note.notation} (${index > 2 ? la.octave + 1 : la.octave})`,
    octave: la.octave,
    frequency: la.frequency * Math.pow(twelthRootOfTwo, index),
  }))
);
