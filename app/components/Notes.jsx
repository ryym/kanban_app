import React from 'react';
import Note from './Note.jsx';
import * as u from '../util.js';

export default class Notes extends React.Component {
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
      <li className="note" key={note.id}>
        <Note
          task={note.task}
          onEdit={onEdit.bind(null, note.id)}
          onDelete={onDelete.bind(null, note.id)}
        />
      </li>
    );
  }
}
