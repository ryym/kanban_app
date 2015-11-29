import React from 'react';
import * as u from '../util.js';

export default class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    }

    u.bindMethodContexts(this, [
      'renderEdit',
      'renderTask',
      'renderDelete',
      'edit',
      'finishEdit',
      'checkEnter',
      'onDelete',
    ]);
  }

  render() {
    const editing = this.state.editing;
    return (
      <div>
        {editing ? this.renderEdit() : this.renderTask()}
      </div>
    );
  }

  renderEdit() {
    return <input
      type = "input"
      autoFocus = {true}
      defaultValue = {this.props.task}
      onBlur = {this.finishEdit}
      onKeyPress = {this.checkEnter}
    />;
  }

  renderTask() {
    const onDelete = this.props.onDelete;
    return (
      <div onClick={this.edit}>
        <span className="task">{this.props.task}</span>
        {onDelete ? this.renderDelete() : null}
      </div>
    );
  }

  renderDelete() {
    return (
      <button className="delete" onClick={this.onDelete}>x</button>
    );
  }

  edit() {
    this.setState({
      editing: true
    });
  }

  checkEnter(e) {
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  }

  finishEdit(e) {
    this.props.onEdit(e.target.value);
    this.setState({
      editing: false
    });
  }

  onDelete(e) {
    // edit() を発火しないようにする。
    e.stopPropagation();
    this.props.onDelete(e);
  }
}
