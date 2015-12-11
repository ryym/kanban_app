import uuid from 'node-uuid';
import React from 'react';
import Notes from './Notes.jsx';
import Editable from './Editable.jsx';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import NoteStore from '../stores/NoteStore';
import LaneStore from '../stores/LaneStore';
import AltContainer from 'alt-container';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';
import * as u from '../util.js';

const noteTarget = {
  hover(targetProps, monitor) {
    const tgtLaneId = targetProps.lane.id;
    const srcNoteProps = monitor.getItem();
    const srcNoteId = srcNoteProps.id;

    if (targetProps.lane.notes.length === 0) {
      LaneActions.attachToLane({
        laneId: tgtLaneId,
        noteId: srcNoteId
      });
    }
  }
}

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
class Lane extends React.Component {
  constructor(props) {
    super(props);
    const lane = props.lane;

    u.bindMethodContexts(this, [
      'editNote'
    ]);
    this.editName = this.editName.bind(this, lane.id);
    this.addNote = this.addNote.bind(this, lane.id);
    this.deleteNote = this.deleteNote.bind(this, lane.id);
  }

  render() {
    const {connectDropTarget, lane, ...props} = this.props;

    return connectDropTarget(
      <div {...props}>
        <div className="lane-header">
          <Editable
            className="lane-name"
            value={lane.name}
            onEdit={this.editName}
          />
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

  editName(id, name) {
    if (name) {
      LaneActions.update({id, name});
    }
    else {
      const idx = LaneStore.findLaneIdx(id);
      const lane = LaneStore.getState().lanes[idx];
      lane.notes.forEach((noteId) => this.deleteNote(noteId));
      LaneActions.delete(id);
    }
  }
}

const Props = React.PropTypes;

Lane.propTypes = {
  lane: Props.shape({
    id: Props.string.isRequired,
    name: Props.string,
    notes: Props.array
  }).isRequired,
  connectDropTarget: Props.func
};

Lane.defaultProps = {
  name: '',
  notes: []
};

export default Lane;

