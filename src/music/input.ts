import "../App.css";
import { E } from "../either/either";
import { notes } from "./notes";
import { pipe } from "../pipe/pipe";

export const doHandleInputChange =
  (
    errorHandler: (error: string) => string,
    stateHandler: (note: string) => string,
    playNote: (frequency: number, duration?: number) => void
  ) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    errorHandler("");
    stateHandler("");
    pipe(
      inputValue,
      E.fromPredicate(isNotEmptyString, () => errorHandler("No input")),
      E.filterOrElse(isValidNotation, () => errorHandler("Invalid input")),
      E.map(stateHandler),
      E.map(getFrequency),
      E.filterOrElse(
        (val) => val > 0,
        () => errorHandler("Silly frequency")
      ),
      E.match(
        (e) => console.log(`${e}, no note to be played`),
        (frequency) => playNote(frequency)
      )
    );
  };

const isNotEmptyString = (value: string): boolean =>
  typeof value === "string" && !!value;
const isValidNotation = (value: string): boolean =>
  notes.map((note) => note.chroma).includes(value);
const getFrequency = (notation: string): number =>
  notes.find((note) => note.chroma === notation)?.frequency || 0;
