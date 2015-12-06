import assert from 'assert';
import 'array.prototype.findIndex';
import NoteActions from 'app/actions/NoteActions';
import NoteStore from 'app/stores/NoteStore';
import alt from 'app/libs/alt';

describe('Note Store', () => {
  beforeEach(() => {
    alt.flush(); // Clear states.
  });

  it('creates note', () => {
    const task = 'test-task';
    NoteActions.create({task});

    const notes = NoteStore.getState().notes;
    assert.equal(notes.length, 1);
    assert.equal(notes[0].task, task);
  });

  it('updates note', () => {
    NoteActions.create({task: 'initial'});

    const note = NoteStore.getState().notes[0];
    note.task = 'changed task';
    NoteActions.update(note);

    const notes = NoteStore.getState().notes;
    assert.equal(notes.length, 1);
    assert.equal(notes[0].task, 'changed task');
  });

  it('deletes note', () => {
    NoteActions.create({task: 'task'});

    let notes = NoteStore.getState().notes;
    assert.equal(notes.length, 1);

    NoteActions.delete(notes[0].id);
    notes = NoteStore.getState().notes;
    assert.equal(notes.length, 0);
  });

  it('gets notes', () => {
    NoteActions.create({task: 'first'});
    NoteActions.create({task: 'second'});

    const notes = NoteStore.getState().notes;
    assert.equal(notes.length, 2);

    const notesByGet = NoteStore.get(notes.map(n => n.id));
    assert.deepEqual(notes, notesByGet);
  })
});
