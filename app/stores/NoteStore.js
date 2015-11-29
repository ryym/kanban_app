import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);
    this.notes = [];

    this.exportPublicMethods({
      getLatestNote: this.getLatestNote.bind(this),
      get: this.get.bind(this)
    })
  }

  create(note) {
    const notes = this.notes;
    note.id = uuid.v4();
    this.setState({
      notes: notes.concat(note)
    });
  }

  update({id, task}) {
    const notes = this.notes;
    const idx = this.findNoteIdx(id);
    if (idx < 0) {
      return;
    }
    notes[idx].task = task;
     // Optional(Manipulating `this.notes` directly also work.)
    this.setState({notes});
  }

  delete(id) {
    const notes = this.notes;
    const idx = this.findNoteIdx(id);
    notes.splice(idx, 1);
    this.setState({
      notes: notes
    });
  }

  findNoteIdx(id) {
    const notes = this.notes;
    const idx = notes.findIndex((note) => note.id === id);
    if (idx < 0) {
      console.warn('Failed to find note', notes, id);
    }
    return idx;
  }

  getLatestNote() {
    const notes = this.notes;
    return notes.slice(-1)[0];
  }

  get(ids = []) {
    return ids
      .map((id) => this.notes[ this.findNoteIdx(id) ])
      .filter((note) => note);
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
