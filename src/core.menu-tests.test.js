// @flow
import { refineMenuItem } from './core';
import type { CoreModule, halfMenuItem } from './core';
import { generateCoreWithStore, registerModule } from './test-utils/coreInstance';

const RootComponent = () => '';

const genModuleWithFilter = (() => {
  let namespaceId = 0;
  return (menu: halfMenuItem[]): CoreModule => ({
    namespace: `namespace-${namespaceId++}`,
    menu: menu.map(refineMenuItem),
    RootComponent,
    engine: 'react',
    menuMiddleware: () => void 0,
  });
})();

describe('page filter multi-module', () => {
  const { coreInstance: core } = generateCoreWithStore();
  const pageToHide: halfMenuItem = {
    path: '/test',
    label: 'Page to hide',
  };
  const visiblePage = {
    path: '/other-page',
    label: 'Other page',
  };

  const hidingModule = genModuleWithFilter([pageToHide]);

  const showingModule = genModuleWithFilter([pageToHide, visiblePage]);

  const hidingFilter = (menuItem) => menuItem.path !== pageToHide.path;
  const casualFilter = () => true;

  registerModule(core, showingModule);
  core.pageFilter.registerFilter(casualFilter);

  it('page should be VISIBLE when only "permissive" filters', () => {
    expect(core.pageFilter.filterPage(pageToHide)).toBe(true);
  });

  it("one module's page should be HIDDEN because of OTHER MODULE'S filter", () => {
    registerModule(core, hidingModule);
    core.pageFilter.registerFilter(hidingFilter);
    expect(core.pageFilter.filterPage(pageToHide)).toBe(false);

    // not-filtered page should remain VISIBLE
    expect(core.pageFilter.filterPage(visiblePage)).toBe(true);
  });
});
