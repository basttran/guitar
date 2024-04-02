import { useState } from 'react';
import './App.css';
import { chordNames, doPlayChord } from './music/chords';
import { notes } from './music/notes';
import { doPlayNote } from './music/play';
import { doHandleInputChange } from './music/input';


const App = () => {
  const audioContext = new window.AudioContext();
  const playNote = doPlayNote(audioContext);
  const playChord = doPlayChord(playNote);


  const [note, setNote] = useState('');
  const [error, setError] = useState<string>('No input');

  const handleErrors = (error: string) => {
    setError(error);
    return error
  };
  const handleStates = (note: string) => {
    setNote(note);
    return note
  }

  const handleInputChange = doHandleInputChange(
    handleErrors,
    handleStates,
    playNote
  );
  
  return (
    <div className='lists'>

      <div className='col-small'>
        <h1>Notes</h1>
        <ul>
          { notes.map(note => (
            <li key={note.notation}>
              <div onClick={() => playNote(note.frequency)}>{note.notation}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className='col-small'>
        <h1>Chords</h1>
        <ul>
          { chordNames.map(chordName => (
            <li  key={chordName}>
              <div onClick={() => playChord(chordName)}>{chordName}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className='col-big'>
        <h1>Try me</h1>
        <input type='text' onChange={handleInputChange}></input>
        { !error && <div>Note: {note}</div>}
        { error && <div>Error: {error}</div>}
        { note === 'A' && 
          <img className='gif' src={'https://media.giphy.com/media/aWfKsJus6IGAw/giphy.gif?cid=790b7611a1zlil726pfsfbnysgwjgfpwmdzik0fd7jtko1fz&ep=v1_gifs_search&rid=giphy.gif&ct=g'}/>
        }
      </div>

    </div>
  );
}

export default App;
