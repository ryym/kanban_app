import React from 'react';

export default class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    }

    this._bindThisContextTo([
      "renderEdit",
      "renderTask",
      "edit",
      "finishEdit",
      "checkEnter"
    ]);
  }

  _bindThisContextTo(methods) {
    methods.forEach((method) => {
      this[method] = this[method].bind(this);
    })
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
