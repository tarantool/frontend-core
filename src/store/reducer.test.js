import reducer, {defaultReducer} from './reducer'
import * as constants from './constants'
const {reduce, middleware, processModule} = reducer

test('reduce choose by part of path', () => {
  const action = {
    type: constants.LOCATION_CHANGE,
    payload: {
      location: {
        pathname: '/space_explorer/hosts',
      },
    },
  };

  const state = [{
    label: 'space_explorer',
    path: '/space_explorer',
    selected: false,
    expanded: false,
    loading: false,
    items: [],
  }];

  const newState = defaultReducer()(state, action);

  expect(newState[0].selected).toBe(true);
})

test('reduce choose by full path', () => {
  const action = {
    type: constants.LOCATION_CHANGE,
    payload: {
      location: {
        pathname: '/space_explorer',
      },
    },
  };

  const state = [{
    label: 'space_explorer',
    path: '/space_explorer',
    selected: false,
    expanded: false,
    loading: false,
    items: [],
  }];

  const newState = defaultReducer()(state, action);

  expect(newState[0].selected).toBe(true);
})

test('reduce not choose', () => {
  const action = {
    type: constants.LOCATION_CHANGE,
    payload: {
      location: {
        pathname: '/',
      },
    },
  };

  const state = [{
    label: 'space_explorer',
    path: '/space_explorer',
    selected: false,
    expanded: false,
    loading: false,
    items: [],
  }];

  const newState = defaultReducer()(state, action);

  expect(newState[0].selected).toBe(false);
})
