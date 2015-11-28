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
      'edit',
      'finishEdit',
      'checkEnter'
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
    return <div onClick={this.edit}>{this.props.task}</div>;
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
}
