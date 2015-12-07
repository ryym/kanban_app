import React from 'react';
import * as u from '../util.js';

// A generic component which can be edited and deleted.
class Editable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    }

    u.bindMethodContexts(this, [
      'renderEdit',
      'renderValue',
      'renderDelete',
      'edit',
      'finishEdit',
      'checkEnter',
      'onDelete',
    ]);
  }

  render() {
    const {value, onEdit, ...props} = this.props;
    const editing = this.state.editing;
    return (
      <div {...props}>
        {editing ? this.renderEdit() : this.renderValue()}
      </div>
    );
  }

  renderEdit() {
    return <input
      type = "input"
      autoFocus = {true}
      defaultValue = {this.props.value}
      onBlur = {this.finishEdit}
      onKeyPress = {this.checkEnter}
    />;
  }

  renderValue() {
    const onDelete = this.props.onDelete;
    return (
      <div onClick={this.edit}>
        <span className="value">{this.props.value}</span>
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

Editable.propTypes = {
  value: React.PropTypes.string,
  onEdit: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func,
};

Editable.defaultProps = {
  value: '',
  onEdit: () => {}
};

export default Editable;
