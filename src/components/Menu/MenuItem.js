import { APP_PATH_PREFIX } from '../../store/history'
import React from 'react'
import { Icon } from 'antd';
import { css, cx } from 'react-emotion'
import chevron from './chevron-up.svg'

const itemStyles = {
  item: css`
    height: 40px;
    position: relative;
    cursor: pointer;
    border: none;
    text-decoration: none;
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */

    &:hover{
      background: #212121;
    }
  `,
  itemSelected: css`
    background: #212121;
    &:after{
      display: block;
      height: 100%;
      left: 0;
      top: 0;
      width: 4px;
      background: #ff272c;
      content: '';
      position: absolute;
    }
  `,
  itemShort: css`
    
  `,
  itemHover: css`
  `,
  title: css`
    position: absolute;
    font-family: Open Sans;
    left: 50px;
    top: 50%;
    transform: translateY(-50%);
    line-height: 22px;
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    font-weight: normal;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 170px;
    &:hover, &:visited{
      color: #fff;
    }
  `,
  icon: css`
    position: absolute;
    height: 14px;
    width: 14px;
    top: 50%;
    transform: translateY(-50%);
    left: 24px;
    font-size: 14px;
    display: flex;
    color: #fff;
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
  `,
  expandButton: css`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
  `,
  expandButtonUnexpand: css`
    transform: translateY(-50%) rotate(180deg);
  `,
  submenuList: css`
    padding: 4px 0;
    background: #131313;
  `,
  titleSelected: css`
    font-weight: 600;
  `,
  collapse: css`
    opacity: 0.65;
    background: #212121;
    &:hover{
      opacity: 1;
    }
  `,
}

const subitemStyles = {
  item: css`
    ${itemStyles.item}
  `,
  itemSelected: css`
    background: #212121;
    ${itemStyles.itemSelected}
  `,
  title: css`
    ${itemStyles.title}
  `,
  titleSelected: css`
  
  `,
  itemShort: css`
  `,
}

const shortStyles = {
  item: css`
    height: 40px;
    position: relative;
    cursor: pointer;
    &:hover{
      background: #212121;
    }
  `,
  itemSelected: css`
    background: #212121;
    &:after{
      display: block;
      height: 100%;
      left: 0;
      top: 0;
      width: 4px;
      background: #ff272c;
      content: '';
      position: absolute;
    }
  `,
  icon: css`
    position: absolute;
    width: 14px;
    height: 14px;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    font-size: 14px;
    color: #fff;
    display: flex;
    color: #fff;
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
  `,
};

const MenuIcon = ({ icon, className }) => {
  if (typeof(icon) === 'string') {
    return <Icon type={icon} className={className}/>
  }
  return <div className={className}>{icon}</div>;
}

export const MenuItem = ({
  path,
  selected,
  label,
  loading,
  expanded,
  items = [],
  onClick,
  isSubitem = false,
  icon = 'hdd',
  short,
  expand,
  isCollapse,
}) => {
  if (short) {
    return <div
      className={`${shortStyles.item} ${(selected || (items && items.find(x => x.selected))) ? shortStyles.itemSelected : ''}`}
      onClick={evt => items.length > 0 ? expand(evt, path) : onClick(evt, path)}
      title={label}
    >
      {path
        ? (
          <a
            className={`${shortStyles.icon}`}
            href={APP_PATH_PREFIX + path}
          >
            <MenuIcon icon={icon} />
          </a>
        )
        : (
          <button
            className={`${shortStyles.icon}`}
            type="button"
          >
            <MenuIcon icon={icon} />
          </button>
        )}

    </div>
  }
  let subItems = null
  if (expanded && !short) {
    subItems = (
      <div className={itemStyles.submenuList}>
        {items.map(x => <MenuItem {...x} onClick={onClick} isSubitem={true}/>)}
      </div>
    )
  }

  const expandButton = items.length
    ? <img src={chevron} className={`${itemStyles.expandButton} ${expanded ? '' : itemStyles.expandButtonUnexpand}`}></img>
    : null

  const styleMap = isSubitem ? subitemStyles : itemStyles
  return (
    <React.Fragment>
      <div
        className={cx({
          [styleMap.item]: true,
          [styleMap.itemSelected]: selected,
          [itemStyles.collapse]: isCollapse,
        })}
        onClick={items && items.length ? evt => expand(evt, path) : evt => onClick(evt, path)}

      >
        { isSubitem ? null : <MenuIcon icon={icon} className={itemStyles.icon} /> }
        {path
          ? (
            <a
              className={cx(styleMap.title, selected ? styleMap.titleSelected : '')}
              title={label}
              href={APP_PATH_PREFIX + path}
            >
              {label}
            </a>
          )
          : (
            <button
              className={cx(styleMap.title, selected ? styleMap.titleSelected : '')}
              title={label}
              type="button"
            >
              {label}
            </button>
          )}

        {expandButton}

      </div>

      {subItems}
    </React.Fragment>
  )
}
