import notificationReducer, { garbageTimeout, initialState } from './notifications'
import {
  checkNotifications,
  clearNotifications,
  garbageNotifications,
  hideNotification,
  sendNotification
} from '../actions/notifications'

describe('notifications', () => {
  const example = {
    type: 'success',
    title: 'title',
    message: 'message'
  }

  it('send notification', () => {
    const action = sendNotification(example)

    const modifiedState = notificationReducer(initialState, action)

    expect(modifiedState.active).toHaveLength(1)

    expect(modifiedState.active[0].type).toBe(example.type)
    expect(modifiedState.active[0].title).toBe(example.title)
    expect(modifiedState.active[0].message).toBe(example.message)
  })

  it('dismiss notification', () => {
    const action = sendNotification(example)

    const modifiedState = notificationReducer(initialState, action)

    expect(modifiedState.active).toHaveLength(1)

    expect(modifiedState.active[0].type).toBe(example.type)
    expect(modifiedState.active[0].title).toBe(example.title)
    expect(modifiedState.active[0].message).toBe(example.message)

    const uuid = modifiedState.active[0].uuid

    const removedState = notificationReducer(modifiedState, hideNotification(uuid))

    expect(removedState.active).toHaveLength(0)
    expect(removedState.archive).toHaveLength(1)

    expect(removedState.archive[0].type).toBe(example.type)
    expect(removedState.archive[0].title).toBe(example.title)
    expect(removedState.archive[0].message).toBe(example.message)

    const clearState = notificationReducer(removedState, clearNotifications())

    expect(clearState.active).toHaveLength(0)
    expect(clearState.archive).toHaveLength(0)
  })

  it('timeout notification', () => {
    const action = sendNotification({ ...example, createdAt: 0, timeout: 1000 })

    const modifiedState = notificationReducer(initialState, action)

    expect(modifiedState.active).toHaveLength(1)

    expect(modifiedState.active[0].type).toBe(example.type)
    expect(modifiedState.active[0].title).toBe(example.title)
    expect(modifiedState.active[0].message).toBe(example.message)

    const timeoutState = notificationReducer(modifiedState, checkNotifications(2000))

    expect(timeoutState.active).toHaveLength(0)
    expect(timeoutState.archive).toHaveLength(1)

    expect(timeoutState.archive[0].type).toBe(example.type)
    expect(timeoutState.archive[0].title).toBe(example.title)
    expect(timeoutState.archive[0].message).toBe(example.message)

    const timeoutlessAction = sendNotification({ ...example, createdAt: 0, timeout: 0 })

    const timeoutlessState = notificationReducer(timeoutState, timeoutlessAction)

    const tryTimeoutState = notificationReducer(timeoutlessState, checkNotifications(9999999))

    expect(timeoutlessState).toEqual(tryTimeoutState)
    expect(tryTimeoutState.active).toHaveLength(1)

    const garbagedState = notificationReducer(tryTimeoutState, garbageNotifications(garbageTimeout + 1000))

    expect(garbagedState.active).toHaveLength(0)
    expect(garbagedState.archive).toHaveLength(0)
  })

  it('multiple notifications', () => {
    const exampleData = [
      {
        type: 'success',
        title: 'title 1',
        createdAt: 0
      },
      {
        type: 'error',
        title: 'something broken',
        createdAt: 0,
        timeout: 0
      },
      {
        type: 'default',
        title: 'default',
        createdAt: 0,
        message: '<p>PPPP <b>broken</b></p>'
      }
    ]

    const modifiedState = exampleData.reduce(
      (state, data) => notificationReducer(state, sendNotification(data)),
      initialState
    )

    expect(modifiedState.active).toHaveLength(3)

    const modActive = modifiedState.active

    for (let i = 0; i < exampleData.length; i++) {
      for (const p in exampleData[i]) {
        expect(modActive[i][p]).toBe(exampleData[i][p])
      }
    }

    const uuids = modActive.map(x => x.uuid)
    let dismissedState = modifiedState
    for (let i = 0; i < uuids.length; i++) {
      const uuid = uuids[i]
      expect(dismissedState.active).toHaveLength(exampleData.length - i)
      expect(dismissedState.archive).toHaveLength(i)
      dismissedState = notificationReducer(dismissedState, hideNotification(uuid))
      expect(dismissedState.active).toHaveLength(exampleData.length - (i + 1))
      expect(dismissedState.archive).toHaveLength(i + 1)
    }
  })
})