import {Menu} from './Menu'
import renderer from 'react-test-renderer';
import * as React from 'react';
import * as constants from '../store/constants';

describe('Menu', () => {
  it('should not be called if no menu items', () => {
    const dispatch = jest.fn();
    const component = renderer.create(<Menu menu={[]} key={'menu'} dispatch={dispatch}/>);
    component.update(<Menu menu={[]} key={'menu'} dispatch={dispatch}/>)
    expect(dispatch).not.toBeCalled();
  })
  it('should not be called if has a selected item - single', () => {
    const dispatch = jest.fn();
    const testMenu = [
      {
        label: 'test',
        path: '/test',
        selected: true,
        expanded: false,
        loading: false,
        items: [],
      },
    ];
    const component = renderer.create(<Menu menu={testMenu} key={'menu'} dispatch={dispatch}/>);
    component.update(<Menu menu={testMenu} key={'menu'} dispatch={dispatch}/>);
    expect(dispatch).not.toBeCalled();
  })
  it('should not be called if no has a selected item - multi items', () => {
    const dispatch = jest.fn();
    const testMenu = [
      {
        label: 'test',
        path: '/test',
        selected: true,
        expanded: false,
        loading: false,
        items: [],
      },
      {
        label: 'rest',
        path: '/rest',
        selected: false,
        expanded: false,
        loading: false,
        items: [],
      },
    ];
    const component = renderer.create(<Menu menu={testMenu} key={'menu'} dispatch={dispatch}/>);
    component.update(<Menu menu={testMenu} key={'menu'} dispatch={dispatch}/>)
    expect(dispatch).not.toBeCalled();
  })
  it('should be called if have menu items with no selection - single', () => {
    const actions = [];
    const dispatch = jest.fn((action) => actions.push(action));
    const testMenu = [
      {
        label: 'test',
        path: '/test',
        selected: false,
        expanded: false,
        loading: false,
        items: [],
      },
    ];
    const component = renderer.create(<Menu menu={testMenu} key={'menu'} dispatch={dispatch}/>);
    component.update(<Menu menu={testMenu} key={'menu'} dispatch={dispatch}/>);
    expect(dispatch).toBeCalled();
    expect(actions).toHaveLength(2);
    const menuAction = actions[0];
    const pushAction = actions[1];
    expect(pushAction.payload.method).toBe('push');
    expect(pushAction.payload.args).toEqual(['/test']);
    expect(menuAction.type).toEqual(constants.SELECT_MENU);
    expect(menuAction.payload.path).toEqual('/test');
  })

  it('should be called if have menu items with no selection - multi', () => {
    const actions = [];
    const dispatch = jest.fn((action) => actions.push(action));
    const testMenu = [
      {
        label: 'test',
        path: '/test',
        selected: false,
        expanded: false,
        loading: false,
        items: [],
      },
      {
        label: 'rest',
        path: '/rest',
        selected: false,
        expanded: false,
        loading: false,
        items: [],
      },
    ];
    const component = renderer.create(<Menu menu={testMenu} key={'menu'} dispatch={dispatch}/>);
    component.update(<Menu menu={testMenu} key={'menu'} dispatch={dispatch}/>);
    expect(dispatch).toBeCalled();
    expect(actions).toHaveLength(2);
    const menuAction = actions[0];
    const pushAction = actions[1];
    expect(pushAction.payload.method).toBe('push');
    expect(pushAction.payload.args).toEqual(['/test']);
    expect(menuAction.type).toEqual(constants.SELECT_MENU);
    expect(menuAction.payload.path).toEqual('/test');
  })
})
