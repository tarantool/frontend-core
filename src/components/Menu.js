import { css, keyframes } from 'react-emotion'
import React, { Component, useState } from 'react';
import { connect } from 'react-redux'
import { mainColor } from '../colorConfig';
import { push } from 'connected-react-router'
import * as constants from '../store/constants'
import { APP_PATH_PREFIX } from '../store/history';

const translateFromRight = keyframes`
  from{
    transform: translate3d(200px, 0, 0);
  }
  to{
    transform: translate3d(0, 0, 0);
  }
`;


const styles = {
  container: css`
    display: block;
    border-top: none;
    overflow: hidden;
  `,
  menuTitle: css`
    display: block;
    font-size: 14px;
    margin-left: 20px;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.65);
  `,
  menuList: css`
    
  `,
  item: css`
    margin-bottom: 12px;
    position: relative;
  `,
  expandButton: css`
    position: absolute;
    right: 28px;
    top: 11px;
    &:after{
      width: 0; 
      height: 0; 
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid #fff;
    }
  `,
  expandButtonUnexpand: css`
    &:after{
      width: 0; 
      height: 0; 
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 7px solid #fff;
    }
  `,
  menuItem: css`
    display: block;
    font-size: 19px;
    font-family: Roboto;
    font-weight: 400;
    text-align: left;
    cursor: pointer;
    color: white;
    width: 154px;
    padding: 0 0 5px;
    border: none;
    background-color: transparent;
    transition: color 300ms;
    text-decoration: none;
    :focus,
    :hover{
      color: #e32636;
      text-decoration: none;
      outline: none
    }
  `,
  selectedMenuItem: css`
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255, 39, 44, 1);   
    cursor: default;
    :hover{
      color: rgba(255, 39, 44, 1);
    }
  `,
  submenuItem: css`
    display: block;
    margin-bottom: 15px;
    font-size: 18px;
    color: white;
    margin-left: 30px;
    cursor: pointer;
    :before{ content: '> '; display: inline-block; width: 20px; position: relative;}
    :hover{
      color: #ca0009;
      :before{ content: '@'; display: inline-block; width: 20px; position: relative;}
    }
    animation: ${translateFromRight} 1s;
  `,
  submenuList: css`
    display: block;
    margin-top: 10px;
    margin-left: 10px;
  `,
  itemLoading: css`
  `,
};

const MenuItem = ({ path, selected, label, loading, expanded, items = [], onClick }) => {
  let subItems = null;
  if (expanded) {
    subItems = (
      <div className={styles.submenuList}>
        {items.map(x => <MenuItem {...x} onClick={onClick} />)}
      </div>
    );
  }

  const expandButton = items.length
    ? <div className={`${styles.expandButton} ${expanded ? '' : styles.expandButtonUnexpand}`}></div>
    : null;

  return (
    <div className={styles.item}>
      {path
        ? (
          <a
            className={`${styles.menuItem} ${selected ? styles.selectedMenuItem : ''}`}
            onClick={evt => onClick(evt, path)}
            href={APP_PATH_PREFIX + path}
          >
            {label}
          </a>
        )
        : (
          <button
            className={`${styles.menuItem} ${selected ? styles.selectedMenuItem : ''}`}
            onClick={evt => onClick(evt, path)}
            type="button"
          >
            {label}
          </button>
        )}
      {expandButton}
      {loading && <div className={styles.itemLoading}></div>}
      {subItems}
    </div>
  );
}


export function Menu(props) {
  const { menu, dispatch, path } = props;
  const [isInited, setIsInited] = useState(path !== '/');

  if (!isInited) {
    if (menu.length > 0) {
      const notSelected = menu.filter(x => x.selected).length === 0;
      if (notSelected) {
        const path = menu[0].path;
        dispatch({ type: constants.SELECT_MENU, payload: { path: path } })
        dispatch(push(path));
      }
      setIsInited(true);
    }
  }

  const onClick = (evt, path) => {
    evt.preventDefault();
    dispatch({ type: constants.SELECT_MENU, payload: { path: path } });
    dispatch(push(path));
  };

  return <div className={styles.container}>
    <div className={styles.menuList}>
      {menu.map(x => <MenuItem {...x} key={x.path} onClick={onClick} />)}
    </div>
  </div>;
}

export default connect(({ menu, router }) => {
  return {
    menu,
    path: router.location.pathname,
  }
})(Menu)
