import React from 'react';
import Editable from './Editable.jsx';
import Note from './Note.jsx';
import LaneActions from '../actions/LaneActions';
import * as u from '../util.js';

class Notes extends React.Component {
  constructor(props) {
    super(props);

    u.bindMethodContexts(this, [
      'renderNote'
    ]);
  }

  render() {
    const notes = this.props.items;
    return (
      <ul className="notes">
        {notes.map(this.renderNote)}
      </ul>
    );
  }

  renderNote(note) {
    const {onEdit, onDelete} = this.props;
    return (
      <Note className="note"
        id={note.id} key={note.id}
        onMove={LaneActions.move}
      >
        <Editable
          value={note.task}
          onEdit={onEdit.bind(null, note.id)}
          onDelete={onDelete.bind(null, note.id)}
        />
      </Note>
    );
  }
}

Notes.propTypes = {
  items: React.PropTypes.array,
  onEdit: React.PropTypes.func,
  onDelete: React.PropTypes.func
};

Notes.defaultProps = {
  items: [],
  onEdit: () => {},
  onDelete: () => {}
};

export default Notes;
