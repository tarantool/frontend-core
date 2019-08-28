import Header from './Header'
import renderer from 'react-test-renderer'
import * as React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux';

describe('Header component', () => {
  const initialState = {
    menu: [
      {
        selected: true,
        expanded: false,
        loading: false,
        items: [],
        label: 'Cluster',
        path: '/test/test2',
        namespace: 'test',
      },
      {
        selected: false,
        expanded: false,
        loading: false,
        items: [],
        label: 'Dashboard',
        path: '/test/test',
        namespace: 'test',
      },
    ],
    appTitle: {
      title: '',
      propsList: [],
    },
    notifications: [],
    ui: {
      showNotificationList: false,
    }
  }

  const initialStateWithTitle = {
    ...initialState,
    appTitle: {
      ...initialState.appTitle,
      title: 'App Title',
      propsList: [ { title: 'App Title'} ]
    },
  }

  it('use current menu item label, if appTitle is empty', () => {
    const mockStore = createStore(
      combineReducers({
        menu: (state = initialState.menu) => state,
        appTitle: (state = initialState.appTitle) => state,
        notifications: (state = initialState.notifications) => state,
        ui: (state = initialState.ui) => state,
      })
    )

    const component = renderer.create(<Provider store={mockStore}><Header /></Provider>)

    expect(component.root.findByType('h1').children[0]).toEqual('Cluster')
  })

  it('display appTitle.title', () => {
    const mockStore = createStore(
      combineReducers({
        menu: (state = initialStateWithTitle.menu) => state,
        appTitle: (state = initialStateWithTitle.appTitle) => state,
        notifications: (state = initialState.notifications) => state,
        ui: (state = initialState.ui) => state,
      })
    )

    const component = renderer.create(<Provider store={mockStore}><Header /></Provider>)

    expect(component.root.findByType('h1').children[0]).toEqual('App Title')
  })
})
