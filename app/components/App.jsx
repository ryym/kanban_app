import uuid from 'node-uuid';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import AltContainer from 'alt-container';
import * as u from '../util.js';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
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
      'addItem',
    ]);
  }

  render() {
    return (
      <div>
        <button className="add-lane" onClick={this.addItem}>+</button>
        <AltContainer
          stores={[LaneStore]}
          inject={{
            items: () => LaneStore.getState().lanes
          }}
        >
          <Lanes />
        </AltContainer>
      </div>
    );
  }

  addItem() {
    LaneActions.create({name: 'New Lane'});
  }
}
