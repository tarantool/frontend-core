// @flow

import { css, keyframes } from 'react-emotion'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import type { MenuItemType } from '../../core'
import logo from '../tarantool-logo.svg'
import shortLogo from './tarantool-logo-collapse.svg'
import { MenuItem } from './MenuItem'
import Scrollbar from '../Scrollbar'
import { expand } from '../../store/actions/menu'
import information from './information.svg'
import leftArrow from './arrow-left.svg'

const translateFromRight = keyframes`
  from{
    transform: translate3d(200px, 0, 0);
  }
  to{
    transform: translate3d(0, 0, 0);
  }
`

const styles = {
  container: css`
    border-top: none;
    overflow: hidden;
    width: 256px;
    padding: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 6px 0 rgba(0, 21, 41, 0.35);
  `,
  shortContainer: css`
    width: 62px;
  `,
  menuTitle: css`
    display: block;
    font-size: 14px;
    margin-left: 20px;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.65);
  `,
  menuList: css`
    flex-grow: 1;
    overflow: hidden;
  `,
  item: css`
    height: 40px;
    margin-bottom: 4px;
    position: relative;
  `,
  expandButton: css`
    position: absolute;
    right: 28px;
    top: 11px;
    &:after {
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid #fff;
    }
  `,
  expandButtonUnexpand: css`
    &:after {
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
    :hover {
      color: #e32636;
      text-decoration: none;
      outline: none;
    }
  `,
  selectedMenuItem: css`
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255, 39, 44, 1);
    cursor: default;
    :hover {
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
    :before {
      content: '> ';
      display: inline-block;
      width: 20px;
      position: relative;
    }
    :hover {
      color: #ca0009;
      :before {
        content: '@';
        display: inline-block;
        width: 20px;
        position: relative;
      }
    }
    animation: ${translateFromRight} 1s;
  `,
  submenuList: css`
    display: block;
    margin-top: 10px;
    margin-left: 10px;
  `,
  itemLoading: css``,
  logoContainer: css`
    padding: 22px 0 22px 0;
    text-align: center;
  `,
  logo: css`
    width: 210px;
    height: 25px;
    display: inline-block;
  `,
  shortLogo: css`
    width: 46px;
    height: 25px;
  `,
  separator: css`
    display: block;
    height: 1px;
    margin-bottom: 15px;
    align-self: center;
    position: relative;
    width: 100%;
    &:after {
      position: absolute;
      background: rgba(255, 255, 255, 0.2);
      content: '';
      left: 24px;
      right: 24px;
      bottom: 0;
      top: 0;
    }
  `,
  bottomButtons: css`
    flex-grow: 0;
    flex-shrink: 0;
    margin-top: 16px;
  `
}

type MenuProps = {
  menu: Array<MenuItemType>,
  dispatch: Function,
  path: string,
  className: string
}

export function Index (props: MenuProps) {
  const { menu, dispatch, path, className } = props
  const [isInited, setIsInited] = useState(path !== '/')

  const [isShort, setIsShort] = useState(document && document.body ? document.body.clientWidth < 1200 : false)

  if (!isInited) {
    if (menu.length > 0) {
      const notSelected = menu.filter(x => x.selected).length === 0
      if (notSelected) {
        const path = menu[0].path
        dispatch(push(path))
      }
      setIsInited(true)
    }
  }

  const onClick = (evt, path) => {
    evt.preventDefault()
    dispatch(push(path))
  }

  const onExpand = (evt, path) => {
    evt.preventDefault()
    if (isShort) {
      setIsShort(false)
    }
    dispatch(expand(path))
  }

  return (
    <div className={`${styles.container} ${className} ${isShort ? styles.shortContainer : ''}`}>
      <div className={styles.logoContainer}>
        {isShort ? <img src={shortLogo} className={styles.shortLogo} /> : <img src={logo} className={styles.logo} />}
      </div>
      <div className={styles.separator}></div>
      <Scrollbar track={'#212121'}>
        <div className={styles.menuList}>
          {menu.map((x, i) => (
            <MenuItem key={i} {...x} onClick={onClick} expand={onExpand} short={isShort} />
          ))}
        </div>
      </Scrollbar>
      <div className={styles.bottomButtons}>
        <MenuItem
          key={'documentation'}
          icon={<img src={information} style={{ height: 14, width: 14 }} />}
          label={'Documentation'}
          onClick={(evt, path) => window.open(path, '_blank')}
          short={isShort}
          path={'https://www.tarantool.io/en/doc'}
        />
        <MenuItem
          key={'collapse'}
          isCollapse={true}
          icon={
            <img
              src={leftArrow}
              style={{
                height: 14,
                width: 14,
                transform: isShort ? 'rotate(180deg)' : ''
              }}
            />
          }
          label={'Collapse menu'}
          onClick={e => {
            e.preventDefault()
            setIsShort(!isShort)
          }}
          short={isShort}
        />
      </div>
    </div>
  )
}

export default connect(({ menu, router }) => {
  return {
    menu,
    path: router.location.pathname
  }
})(Index)
