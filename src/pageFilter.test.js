import Core from './core';

test('page filter', () => {
  const core = new Core();

  const testPage = {
    path: '/test',
  };

  const fnApply = jest.fn();
  const fnApplied = jest.fn();

  core.subscribe('core:pageFilter:apply', fnApply);
  core.subscribe('core:pageFilter:applied', fnApplied);

  const unregisterFilter = core.pageFilter.registerFilter(() => false);

  expect(fnApply).toBeCalled();
  expect(fnApplied).toBeCalled();

  expect(core.pageFilter.filterPage(testPage)).toBe(false);

  unregisterFilter();

  expect(fnApply).toBeCalledTimes(2);
  expect(fnApplied).toBeCalledTimes(2);

  expect(core.pageFilter.filterPage(testPage)).toBe(true);
});
