import uuid from 'node-uuid';
import React from 'react';
import Notes from './Notes.jsx';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [
        {
          id: uuid.v4(),
          task: 'Learn Webpack'
        },
        {
          id: uuid.v4(),
          task: 'Learn React'
        },
        {
          id: uuid.v4(),
          task: 'Do laundry'
        }
      ]
    };

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
    this.addNote = this.addNote.bind(this);
  }

  render() {
    const notes = this.state.notes;
    return (
      <div>
        <button className="add-note" onClick={this.addNote}>+</button>
        <Notes items={notes} />
      </div>
    );
  }

  addNote() {
    this.setState({
      notes: this.state.notes.concat([
        {
          id: uuid.v4(),
          task: 'New task'
        }
      ])
    });
  }
}
