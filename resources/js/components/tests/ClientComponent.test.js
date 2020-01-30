import React from 'react';
import ClientComponent from "../ClientComponent"
import renderer from 'react-test-renderer';

test('ClientComponent starts only with Client selection', () => {
  const component = renderer.create( <
    ClientComponent / > ,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
