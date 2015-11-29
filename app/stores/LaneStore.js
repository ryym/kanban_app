import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteStore from './NoteStore';
import LaneActions from '../actions/LaneActions';
import update from 'react/lib/update';

class LaneStore {
  constructor() {
    this.bindActions(LaneActions);
    this.lanes = [];

    this.exportPublicMethods({
      findLaneIdx: this.findLaneIdx.bind(this)
    });
  }

  create(lane) {
    const lanes = this.lanes;
    lane.id = uuid.v4();
    lane.notes = lane.notes || [];

    this.setState({
      lanes: lanes.concat(lane)
    });
  }

  update({id, name}) {
    const lanes = this.lanes;
    const idx = this.findLaneIdx(id);
    if (idx < 0) {
      return;
    }

    lanes[idx].name = name;
    this.setState({lanes});
  }

  delete(id) {
    const lanes = this.lanes;
    const idx = this.findLaneIdx(id);
    if (0 <= idx) {
      lanes.splice(idx, 1);
      this.setState({lanes});
    }
  }

  attachToLane({laneId, noteId}) {
    if (! noteId) {
      this.waitFor(NoteStore);
      noteId = NoteStore.getLatestNote().id;
    }

    const lanes = this.lanes;
    const targetIdx = this.findLaneIdx(laneId);
    if (targetIdx < 0) {
      return;
    }

    const lane = lanes[targetIdx];
    if (lane.notes.indexOf(noteId) === -1) {
      lane.notes.push(noteId);
      this.setState({lanes});
    }
    else {
      console.warn('Already attached note to lane', lanes);
    }
  }

  dettachFromLane({laneId, noteId}) {
    const lanes = this.lanes;
    const targetIdx = this.findLaneIdx(laneId);
    if (targetIdx < 0) {
      return;
    }

    const lane  = lanes[targetIdx];
    const notes = lane.notes;
    const rmIdx = notes.indexOf(noteId);
    if (0 <= rmIdx) {
      lane.notes.splice(rmIdx, 1);
      this.setState({lanes});
    }
    else {
      console.warn("Failed to remove note from a lane as it did'nt exist", lanes);
    }
  }

  findLaneIdx(id) {
    const lanes = this.lanes;
    const idx = lanes.findIndex((lane) => lane.id === id);
    if (idx < 0) {
      console.warn('Failed to find lane', lanes, id);
    }
    return idx;
  }

  move({sourceId, targetId}) {
    const srcLane = this.findLaneWhichHas(sourceId);
    const tgtLane = this.findLaneWhichHas(targetId);
    const srcNoteIdx = srcLane.notes.indexOf(sourceId);
    const tgtNoteIdx = tgtLane.notes.indexOf(targetId);

    if (srcLane === tgtLane) {
      srcLane.notes = update(srcLane.notes, {
        $splice: [
          // Remove the source note.
          [srcNoteIdx, 1],
          // Insert the source note before the target one.
          [tgtNoteIdx, 0, sourceId]
        ]
      });
    }
    else {
      srcLane.notes.splice(srcNoteIdx, 1);
      tgtLane.notes.splice(tgtNoteIdx, 0, sourceId);
    }

    this.setState({
      lanes: this.lanes
    });
  }

  findLaneWhichHas(noteId) {
    return this.lanes.filter((lane) => {
      return 0 <= lane.notes.indexOf(noteId);
    })[0];
  }
}

export default alt.createStore(LaneStore, 'LaneStore');
