// @flow
import { generateCoreWithStore, registerModule } from './test-utils/coreInstance'
import {
  refineMenuItem,
  type MenuItemType,
  type CoreModule
} from './core'
import { selectMenu } from './store/selectors';

const RootComponent = () => '';

const genModuleWithFilter = (() => {
  let namespaceId = 0;
  return (menu: MenuItemType[], menuFilter): CoreModule => ({
    namespace: `namespace-${namespaceId++}`,
    menu: menu.map(refineMenuItem),
    RootComponent,
    engine: 'react',
    menuMiddleware: () => { }
  });
})();

const stubPage = (path, items = []): MenuItemType => ({
  path,
  label: '',
  icon: '',
  loading: false,
  selected: false,
  expanded: true,
  items
});

describe('page filter multi-module', () => {
  const { coreInstance: core } = generateCoreWithStore();
  const pageToHide = stubPage('/page-to-hide');
  const visiblePage = stubPage('/other-page');

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

describe('sub-page filtering', () => {
  const { coreInstance: core, store } = generateCoreWithStore();

  const hiddenSubPage = stubPage('/hidden-sub-page');
  const shownSubPage = stubPage('/shown-sub-page');

  const parentOfTwo = stubPage('/parent-of-two', [ hiddenSubPage, shownSubPage ]);
  const parentOfOneHiddenPage = stubPage('/parent-of-one-hidden-page', [ hiddenSubPage ]);

  registerModule(core, genModuleWithFilter(
    [
      parentOfTwo,
      parentOfOneHiddenPage
    ],
    (menuItem) => menuItem.path !== hiddenSubPage.path
  ));

  it('(make sure that subPage does NOT pass filter)', () => {
    expect(core.pageFilter.filterPage(hiddenSubPage)).toBe(false);
  });

  const resultMenu = selectMenu(store.getState());
  it('filtered out subPage should NOT present in the resulting menu', () => {
    expect(
      resultMenu[0].items
    ).toEqual([ shownSubPage ]);
  });

  it('PARENT should NOT present in menu, if all its CHILDREN are hidden', () => {
    expect(resultMenu.length).toBe(1);
    expect(resultMenu[0].path).toBe(parentOfTwo.path);
  });
});
