import { generateCoreWithStore } from './test-utils/coreInstance'

test('page filter', () => {
  const { coreInstance } = generateCoreWithStore()

  const testPage = {
    path: '/test'
  }

  const fnApply = jest.fn()
  const fnApplied = jest.fn()

  coreInstance.subscribe('core:pageFilter:apply', fnApply)
  coreInstance.subscribe('core:pageFilter:applied', fnApplied)

  const unregisterFilter = coreInstance.pageFilter.registerFilter(() => false)

  expect(fnApply).toBeCalled()
  expect(fnApplied).toBeCalled()

  expect(coreInstance.pageFilter.filterPage(testPage)).toBe(false)

  unregisterFilter()

  expect(fnApply).toBeCalledTimes(2)
  expect(fnApplied).toBeCalledTimes(2)

  expect(coreInstance.pageFilter.filterPage(testPage)).toBe(true)
})
