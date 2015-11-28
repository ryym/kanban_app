import React from 'react';
import Note from './Note.jsx';

export default class Notes extends React.Component {
  constructor(props) {
    super(props);

    this.renderNote = this.renderNote.bind(this);
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
    const onEdit = this.props.onEdit;
    return (
      <li className="note" key={note.id}>
        <Note task={note.task} onEdit={onEdit.bind(null, note.id)}/>
      </li>
    );
  }
}
