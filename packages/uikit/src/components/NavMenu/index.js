// @flow
import * as React from 'react';
import { css, cx } from 'emotion';
import { Link } from 'react-router-dom';
import {
  navBgColor,
  navFontColor,
  navWidthExpanded
} from '../../variables';

const styles = {
  outer: css`
    display: flex;
    width: ${navWidthExpanded}; // ? : navWidthCollapsed
    height: 100%;
    background-color: ${navBgColor};
    color: ${navFontColor};
  `,
  list: css`
    list-style: none;
  `
}

type NavMenuSubItem = {
  label: string,
  path: string,
  selected?: boolean,
};

type NavMenuItem = {
  ...$Exact<NavMenuSubItem>,
  expanded?: boolean,
  icon?: string,
  items?: NavMenuItem[]
}

type NavMenuBottomLink = {
  icon?: string,
  label: string,
  path: string
}

type NavMenuProps = {
  bottomLinks: NavMenuBottomLink[],
  className?: string,
  collapsed: boolean,
  items: NavMenuItem[],
  onCollapse: () => void,
};

const NavMenu = ({
  bottomLinks,
  className,
  collapsed,
  items
}: NavMenuProps) => (
  <nav className={cx(className, styles.outer)}>
    <ul>
      {items && items.map(({
        expanded,
        icon,
        items,
        label,
        path,
        selected
      }) => (
        <li key={path}>
          <Link to={path}>{label}</Link>
          {items && !!items.length && (
            <button type="button">{expanded ? 'Expanded' : 'Not expanded'}</button>
          )}
          {items && !!items.length && expanded && (
            <ul>
              {items.map(({ label, path, selected }) => (
                <li><Link to={path}>{label}</Link></li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
    <ul>
      {bottomLinks && bottomLinks.map(({ icon, label, path }) => (
        <li key={path}>
          <a href={path} target='_blank' rel='noopener noreferrer'>{label}</a>
        </li>
      ))}
    </ul>
    <button type="button">{collapsed ? 'Expand menu' : 'Collapse menu'}</button>
  </nav>
);

export default NavMenu;
