// @flow
import Core, { refineMenuItem } from './core';
import type { HalfMenuItem, InputCoreModule } from './core';

const RootComponent = () => '';

const genModuleWithFilter = (() => {
  let namespaceId = 0;
  return (menu: HalfMenuItem[]): InputCoreModule => ({
    namespace: `namespace-${namespaceId++}`,
    menu: menu.map(refineMenuItem),
    RootComponent,
    menuMiddleware: () => void 0,
  });
})();

describe('page filter multi-module', () => {
  const core = new Core();
  const pageToHide: HalfMenuItem = {
    path: '/test',
    label: 'Page to hide',
  };
  const visiblePage: HalfMenuItem = {
    path: '/other-page',
    label: 'Other page',
  };

  const hidingModule = genModuleWithFilter([pageToHide]);

  const showingModule = genModuleWithFilter([pageToHide, visiblePage]);

  const hidingFilter = (menuItem) => menuItem.path !== pageToHide.path;
  const casualFilter = () => true;

  core.registerModule(showingModule);
  core.pageFilter.registerFilter(casualFilter);

  it('page should be VISIBLE when only "permissive" filters', () => {
    expect(core.pageFilter.filterPage(refineMenuItem(pageToHide))).toBe(true);
  });

  it("one module's page should be HIDDEN because of OTHER MODULE'S filter", () => {
    core.registerModule(hidingModule);
    core.pageFilter.registerFilter(hidingFilter);
    expect(core.pageFilter.filterPage(refineMenuItem(pageToHide))).toBe(false);

    // not-filtered page should remain VISIBLE
    expect(core.pageFilter.filterPage(refineMenuItem(visiblePage))).toBe(true);
  });
});
