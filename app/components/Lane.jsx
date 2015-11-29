import uuid from 'node-uuid';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import AltContainer from 'alt-container';
import * as u from '../util.js';

export default class Lane extends React.Component {
  constructor(props) {
    super(props);
    u.bindMethodContexts(this, [
      'addNote',
      'editNote',
      'deleteNote'
    ]);
  }

  render() {
    const {lane, ...props} = this.props;

    return (
      <div {...props}>
        <div className="lane-header">
          <div className="lane-name">
            {lane.name}
          </div>
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            items: () => NoteStore.getState().notes
          }}
          >
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }

  addNote() {
    NoteActions.create({task: 'New Task'});
  }

  editNote(id, task) {
    NoteActions.update({id, task});
  }

  deleteNote(id) {
    NoteActions.delete(id);
  }
}

