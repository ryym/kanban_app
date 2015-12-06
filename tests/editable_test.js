import React from 'react';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  findRenderedDOMComponentWithTag,
  Simulate
} from 'react-addons-test-utils';

import assert from 'assert';
import Editable from 'app/components/Editable.jsx';

describe('Editable',  () => {
  function renderEditable(props) {
    return renderIntoDocument(<Editable {...props} />);
  }

  function findValueDOM(component) {
    return findRenderedDOMComponentWithClass(component, 'value');
  }

  function findInputDOM(component) {
    return findRenderedDOMComponentWithTag(component, 'input');
  }

  it('renders value', () => {
    const value = 'valueToBeRendered';
    const component = renderEditable({value});
    const valueComponent = findValueDOM(component);
    assert.equal(valueComponent.textContent, value);
  });

  it('enters edit mode when clicked', () => {
    const value = 'valueToBeRendered';
    const component = renderEditable({value});;
    const valueComponent = findValueDOM(component);

    Simulate.click(valueComponent);
    const input = findInputDOM(component);

    assert.equal(input.value, value);
  });

  context('when exiting enter mode', () => {

    function inputAndExit(newValue, onEdit, exit) {
      const component = renderEditable({onEdit});
      const valueComponent = findValueDOM(component);

      Simulate.click(valueComponent);
      const input = findInputDOM(component);

      input.value = newValue;
      exit(input);
    }

    it('triggers onEdit by pressing enter', () => {
      let triggered = false;
      inputAndExit('new-value',
        ()    => triggered = true,
        input => Simulate.keyPress(input, {
          key: 'Enter', keyCode: 13, which: 13
        })
      );
      assert(triggered);
    });

    it('triggers onEdit by bluring', () => {
      let triggered = false;
      inputAndExit('new-value',
        ()    => triggered = true,
        input => Simulate.blur(input)
      );
      assert(triggered);
    });

    it('triggers onEdit with new value', () => {
      let newValue;
      inputAndExit('new-value',
        value => newValue = value,
        input => Simulate.blur(input)
      );
      assert.equal(newValue, 'new-value');
    });
  });

  context('with onDelete callback', () => {

    function findDeleteButton(component) {
      return findRenderedDOMComponentWithClass(component, 'delete');
    }

    it('renders delete button', () => {
      const onDelete = function() {};
      const component = renderEditable({onDelete});
      const deleteButton = findDeleteButton(component);
      assert.equal(deleteButton.tagName, 'BUTTON');
    });

    it('triggers onDelete when delete button clicked', () => {
      let triggered = false;
      const onDelete = () => triggered = true;
      const component = renderEditable({onDelete});
      const deleteButton = findDeleteButton(component);

      Simulate.click(deleteButton);
      assert(triggered);
    });
  });
});
