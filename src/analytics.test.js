// @flow
import { generateAnalyticModule } from './analytics'
import * as R from 'ramda'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('analytics module', () => {
  it('pageview event', () => {
    const analyticModule = generateAnalyticModule()
    const pageviewEvent = {
      type: 'pageview',
      url: 'https://tarantool.io'
    }
    analyticModule.sendEvent(pageviewEvent)
    expect(analyticModule.__storage).toHaveLength(1)
    expect(analyticModule.__storage[0]).toBe(pageviewEvent)
    analyticModule.sendEvent(pageviewEvent)
    expect(analyticModule.__storage).toHaveLength(2)
  })
  it('action event', () => {
    const analyticModule = generateAnalyticModule()
    const action = 'action'
    const actionEvent = {
      type: 'action',
      category: 'category',
      action
    }
    analyticModule.sendEvent(actionEvent)
    expect(analyticModule.__storage).toHaveLength(3)
    const actionsName = R.map(R.prop('action'), analyticModule.__storage)
    expect(actionsName).toContain(action)
    expect(actionsName).toContain(`first_${action}`)
    expect(actionsName).toContain(`session_${action}`)
    analyticModule.sendEvent(actionEvent)
    expect(analyticModule.__storage).toHaveLength(4)
  })

  it('effect', () => {
    const analyticModule = generateAnalyticModule()
    const pageviewEvent = {
      type: 'pageview',
      url: 'https://tarantool.io'
    }
    const fn = jest.fn()
    analyticModule.sendEvent(pageviewEvent)
    expect(fn).not.toBeCalled()
    const unsub = analyticModule.effect(fn)
    expect(fn).toBeCalled()
    analyticModule.sendEvent(pageviewEvent)
    expect(fn).toBeCalledTimes(2)
    expect(fn).toBeCalledWith(pageviewEvent)
    unsub()
    analyticModule.sendEvent(pageviewEvent)
    expect(fn).toBeCalledTimes(2)
    const newEffect = jest.fn()
    analyticModule.effect(newEffect)
    expect(newEffect).toBeCalledTimes(3)
  })

  it('clear storage', async () => {
    const analyticModule = generateAnalyticModule()
    analyticModule.__timerInterval = 0
    const pageviewEvent = {
      type: 'pageview',
      url: 'https://tarantool.io'
    }
    const fn = jest.fn()
    analyticModule.effect(fn)
    analyticModule.sendEvent(pageviewEvent)
    analyticModule.sendEvent(pageviewEvent)
    analyticModule.sendEvent(pageviewEvent)
    analyticModule.sendEvent(pageviewEvent)
    expect(fn).toBeCalled()
    await sleep(50)
    const anotherFn = jest.fn()
    expect(analyticModule.__storage).toHaveLength(0)
    analyticModule.effect(anotherFn)
    expect(anotherFn).not.toHaveBeenCalled()
    analyticModule.sendEvent(pageviewEvent)
    expect(anotherFn).toHaveBeenCalledTimes(1)
  })
})
