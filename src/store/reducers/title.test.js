import reducer from './title'
import * as constants from '../constants'
import { generateInstance } from './menu'
import { locationAction } from './menu.test'

test('app name and title should be changed', () => {
  const title = 'Section first'
  const appName = 'Front app'

  const setTitleAction = {
    type: constants.TITLE_SET,
    payload: { title, propsList: [{ title }] }
  }

  const setAppNameAction = {
    type: constants.APP_NAME_SET,
    payload: appName
  }

  const initialState = {
    appName: null,
    title: '',
    propsList: []
  }

  const newState = reducer(reducer(initialState, setAppNameAction), setTitleAction)

  expect(newState.appName).toEqual(appName)
  expect(newState.title).toEqual(title)
})

test('title should be cleared', () => {
  const action = { type: constants.TITLE_RESET }

  const initialState = {
    title: 'Section second',
    propsList: [{ title: 'Section changed' }]
  }

  const newState = reducer(initialState, action)

  expect(newState.title).toEqual('')
})

test('title should be the same', () => {
  const title = 'Section second'
  const action = { type: 'SOME_ACTION', payload: { data: 'Big' } }
  const initialState = { appName: null, title, propsList: [{ title }] }

  const newState = reducer(initialState, action)

  expect(newState.title).toEqual(title)
  expect(newState.appName).toEqual(null)
})
