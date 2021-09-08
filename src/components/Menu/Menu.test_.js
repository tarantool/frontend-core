import React from 'react';
import renderer from 'react-test-renderer';

import { Index } from '.';

jest.mock('../Scrollbar.js', () => ({ children }) => <div>{children}</div>);

describe('Menu', () => {
  const rootPath = '/';
  const testPath = '/test';

  it('should not be called if no menu items', () => {
    const dispatch = jest.fn();
    const component = renderer.create(<Index path={rootPath} menu={[]} key={'menu'} dispatch={dispatch} />);
    component.update(<Index path={rootPath} menu={[]} key={'menu'} dispatch={dispatch} />);
    expect(dispatch).not.toBeCalled();
  });
  it('should not be called if no root location and menu', () => {
    const dispatch = jest.fn();

    const component = renderer.create(<Index path={testPath} menu={[]} key={'menu'} dispatch={dispatch} />);
    component.update(<Index path={testPath} menu={[]} key={'menu'} dispatch={dispatch} />);
    expect(dispatch).not.toBeCalled();
  });
  it('should not be called if no root location', () => {
    const dispatch = jest.fn();
    const otherMenu = [
      {
        label: 'other',
        path: '/other',
        selected: false,
        expanded: false,
        loading: false,
        items: [],
      },
    ];
    const component = renderer.create(<Index path={testPath} menu={otherMenu} key={'menu'} dispatch={dispatch} />);
    component.update(<Index path={testPath} menu={otherMenu} key={'menu'} dispatch={dispatch} />);
    expect(dispatch).not.toBeCalled();
  });
  it('should not be called if no root location and change menu items in progress', () => {
    const dispatch = jest.fn();
    const otherMenu = [
      {
        label: 'other',
        path: '/other',
        selected: false,
        expanded: false,
        loading: false,
        items: [],
      },
    ];
    const testMenu = [
      {
        label: 'other',
        path: '/other',
        selected: false,
        expanded: false,
        loading: false,
        items: [],
      },
      {
        label: 'test',
        path: '/test',
        selected: true,
        expanded: false,
        loading: false,
        items: [],
      },
    ];
    const component = renderer.create(<Index path={testPath} menu={otherMenu} key={'menu'} dispatch={dispatch} />);
    component.update(<Index path={testPath} menu={testMenu} key={'menu'} dispatch={dispatch} />);
    expect(dispatch).not.toBeCalled();
  });
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
    const component = renderer.create(<Index path={rootPath} menu={testMenu} key={'menu'} dispatch={dispatch} />);
    component.update(<Index path={rootPath} menu={testMenu} key={'menu'} dispatch={dispatch} />);
    expect(dispatch).not.toBeCalled();
  });
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
    const component = renderer.create(<Index path={rootPath} menu={testMenu} key={'menu'} dispatch={dispatch} />);
    component.update(<Index path={rootPath} menu={testMenu} key={'menu'} dispatch={dispatch} />);
    expect(dispatch).not.toBeCalled();
  });
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
    const component = renderer.create(<Index path={rootPath} menu={testMenu} key={'menu'} dispatch={dispatch} />);
    component.update(<Index path={rootPath} menu={testMenu} key={'menu'} dispatch={dispatch} />);
    expect(dispatch).toBeCalled();
    expect(actions).toHaveLength(1);
    const pushAction = actions[0];
    expect(pushAction.payload.method).toBe('push');
    expect(pushAction.payload.args).toEqual(['/test']);
  });

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
    const component = renderer.create(<Index path={rootPath} menu={testMenu} key={'menu'} dispatch={dispatch} />);
    component.update(<Index path={rootPath} menu={testMenu} key={'menu'} dispatch={dispatch} />);
    expect(dispatch).toBeCalled();
    expect(actions).toHaveLength(1);
    const pushAction = actions[0];
    expect(pushAction.payload.method).toBe('push');
    expect(pushAction.payload.args).toEqual(['/test']);
  });
});
