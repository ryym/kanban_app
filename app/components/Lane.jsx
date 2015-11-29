import uuid from 'node-uuid';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import NoteStore from '../stores/NoteStore';
import AltContainer from 'alt-container';
import * as u from '../util.js';

export default class Lane extends React.Component {
  constructor(props) {
    super(props);
    const lane = props.lane;

    u.bindMethodContexts(this, [
      'editNote'
    ]);
    this.addNote = this.addNote.bind(this, lane.id);
    this.deleteNote = this.deleteNote.bind(this, lane.id);
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
            items: () => NoteStore.get(lane.notes)
          }}
          >
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }

  addNote(laneId) {
    NoteActions.create({task: 'New Task'});
    LaneActions.attachToLane({laneId});
  }

  editNote(id, task) {
    NoteActions.update({id, task});
  }

  deleteNote(laneId, noteId) {
    LaneActions.dettachFromLane({laneId, noteId});
    NoteActions.delete(noteId);
  }
}

