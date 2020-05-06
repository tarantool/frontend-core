// @flow
import { generateCoreWithStore, registerModule } from './test-utils/coreInstance'
import {
  refineMenuItem,
  type halfMenuItem,
  type MenuItemType,
  type CoreModule
} from './core'
import { selectMenu } from './store/selectors';

const RootComponent = () => '';

const genModuleWithFilter = (() => {
  let namespaceId = 0;
  return (menu: (MenuItemType[] | halfMenuItem[]), menuFilter): CoreModule => ({
    namespace: `namespace-${namespaceId++}`,
    menu: menu.map(refineMenuItem),
    RootComponent,
    engine: 'react',
    menuMiddleware: () => { }
  });
})();

describe('page filter multi-module', () => {
  const { coreInstance: core } = generateCoreWithStore();
  const pageToHide: halfMenuItem = {
    path: '/page-to-hide',
    label: 'Page to hide'
  };
  const visiblePage = {
    path: '/other-page',
    label: 'Other page'
  };

  const hidingModule = genModuleWithFilter(
    [
      pageToHide
    ]
  );

  const showingModule = genModuleWithFilter(
    [
      pageToHide,
      visiblePage
    ]
  );

  const hidingFilter = (menuItem) => menuItem.path !== pageToHide.path
  const casualFilter = (menuItem) => true

  registerModule(core, showingModule);
  core.pageFilter.registerFilter(casualFilter)

  it('page should be VISIBLE when only "permissive" filters', () => {
    expect(core.pageFilter.filterPage(pageToHide)).toBe(true)
  });

  it('one module\'s page should be HIDDEN because of OTHER MODULE\'S filter', () => {
    registerModule(core, hidingModule);
    core.pageFilter.registerFilter(hidingFilter)
    expect(core.pageFilter.filterPage(pageToHide)).toBe(false);

    // not-filtered page should remain VISIBLE
    expect(core.pageFilter.filterPage(visiblePage)).toBe(true);
  });
});


describe('subpage filter', () => {
  const { coreInstance: core, store } = generateCoreWithStore();
  const subPage: MenuItemType = {
    path: '/sub-page',
    label: '',
    icon: '',
    loading: false,
    selected: false,
    expanded: true,
  };

  const parentPage: MenuItemType = {
    path: '/parent-page',
    label: '',
    icon: '',
    loading: false,
    selected: false,
    expanded: true,
    items: [
      subPage
    ]
  };

  registerModule(core, genModuleWithFilter(
    [
      parentPage
    ],
    (menuItem) => menuItem.path !== subPage.path
  ));

  it('(make sure that subPage does NOT pass filter)', () => {
    expect(core.pageFilter.filterPage(subPage)).toBe(false);
  });

  it('subPage should NOT present in the resulting menu', () => {
    expect(
      selectMenu(store.getState())[0].items
    ).toEqual([]);
  });

});