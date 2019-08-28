import reducer from './title';
import * as constants from '../constants';

test('title should be changed', () => {
  const title = 'Section first';

  const action = {
    type: constants.TITLE_SET,
    payload: { title, propsList: [{ title }] }
  };

  const initialState = {
    title: '',
    propsList: [],
  };

  const newState = reducer(initialState, action);

  expect(newState.title).toEqual(title);
});

test('title should be cleared', () => {
  const action = { type: constants.TITLE_RESET };

  const initialState = {
    title: 'Section second',
    propsList: [{title: 'Section changed'}],
  };

  const newState = reducer(initialState, action);

  expect(newState.title).toEqual('');
});

test('title should be the same', () => {
  const title = 'Section second';
  const action = { type: 'SOME_ACTION', payload: { data: 'Big' } };
  const initialState = { title, propsList: [{ title }] };

  const newState = reducer(initialState, action);

  expect(newState.title).toEqual(title);
});
