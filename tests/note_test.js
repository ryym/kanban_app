import React from 'react';
import TestUtils from 'react-addons-test-utils';
import TestBackend from 'react-dnd-test-backend';
import {DragDropContext} from 'react-dnd';
import assert from 'assert';
import Note from 'app/components/Note.jsx';

describe('Note', () => {
  // https://gaearon.github.io/react-dnd/docs-testing.html
  function wrapTestContext(DecoratedComponent) {
    @DragDropContext(TestBackend)
    class TestContextContainer extends React.Component {
      render() {
        return <DecoratedComponent {...this.props} id="_" />;
      }
    }
    return TestContextContainer;
  }

  function findListDOM(component) {
    return TestUtils.findRenderedDOMComponentWithTag(component, 'li');
  }

  it('renders children', () => {
    const children = 'test';
    const NoteContent = wrapTestContext(Note);
    const root = TestUtils.renderIntoDocument(
      <NoteContent>{children}</NoteContent>
    );

    assert.equal(root.props.children, children);
  });

  it('become transparent while dragging', () => {
    const NoteContent = wrapTestContext(Note);
    const root = TestUtils.renderIntoDocument(
      <NoteContent />
    );
    const backend = root.getManager().getBackend();

    assert.equal(findListDOM(root).style.opacity, 1);

    const note = TestUtils.findRenderedComponentWithType(root, Note);
    backend.simulateBeginDrag([ note.getHandlerId() ]);

    assert.equal(findListDOM(root).style.opacity, 0);
  });

});
