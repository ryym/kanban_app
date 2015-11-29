import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteStore from './NoteStore';
import LaneActions from '../actions/LaneActions';

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
}

export default alt.createStore(LaneStore, 'LaneStore');
