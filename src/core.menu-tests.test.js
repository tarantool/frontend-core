// @flow
import { generateCoreWithStore, registerModule } from './test-utils/coreInstance'
import {
  refineMenuItem,
  type halfMenuItem,
  type CoreModule
} from './core'

const RootComponent = () => '';

const genModuleWithFilter = (() => {
  let namespaceId = 0;
  return (menu: halfMenuItem[], menuFilter): CoreModule => ({
    namespace: `namespace-${namespaceId++}`,
    menu: menu.map(refineMenuItem),
    RootComponent,
    engine: 'react',
    menuMiddleware: () => { },
    menuFilter
  });
})();

describe('page filter multi-module', () => {
  const { coreInstance: core } = generateCoreWithStore();
  const pageToHide: halfMenuItem = {
    path: '/test',
    label: 'Page to hide'
  };
  const visiblePage = {
    path: '/other-page',
    label: 'Other page'
  };

  const hidingModule = genModuleWithFilter(
    [
      pageToHide
    ],
    (menuItem) => menuItem.path !== pageToHide.path
  );

  const showingModule = genModuleWithFilter(
    [
      pageToHide,
      visiblePage
    ],
    (menuItem) => true
  );

  registerModule(core, showingModule);

  it('page should be VISIBLE when only "permissive" filters', () => {
    expect(core.pageFilter.filterPage(pageToHide)).toBe(true)
  });

  it('one module\'s page should be HIDDEN because of OTHER MODULE\'S filter', () => {
    registerModule(core, hidingModule);
    expect(core.pageFilter.filterPage(pageToHide)).toBe(false);

    // not-filtered page should remain VISIBLE
    expect(core.pageFilter.filterPage(visiblePage)).toBe(true);
  });
});
