import uuid from 'node-uuid';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import AltContainer from 'alt-container';
import * as u from '../util.js';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    // NOTE:
    //  `addNote`が実際に呼び出される時、Reactは`this`を自動で
    //  この`App`インスタンスにはバインドしてくれない。そのため
    //  このような処理が必要になる。他の方法として、es7の
    //  `property-initializer`を先取りして`addNote`というプロパティに
    //  Arrow Function を持たせておく手もある(es6ではクラスに直接プロパティを
    //  定義できない)。しかしこの方法は、今だと`constructor()`内での処理に変換される
    //  っぽい。`constructor()`の変更は Hot-loading で自動更新できず、ページごと
    //  再読み込みする必要がある。`addNote`の変更もやはり自動更新されないので、ひとまず
    //  `constructor()`でバインドだけする方法を取る事にする。
    u.bindMethodContexts(this, [
      'addNote',
      'editNote',
      'deleteNote'
    ]);
  }

  render() {
    return (
      <div>
        <button className="add-note" onClick={this.addNote}>+</button>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            items: () => NoteStore.getState().notes
          }}
        >
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }

  addNote() {
    NoteActions.create({task: 'New Task'});
  }

  editNote(id, task) {
    NoteActions.update({id, task});
  }

  deleteNote(id) {
    NoteActions.delete(id);
  }
}
