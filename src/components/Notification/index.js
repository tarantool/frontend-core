import * as React from 'react'
import { css, cx } from 'emotion'
import close from './close.svg'
import failCircle from './fail-circle.svg'
import successCircle from './success-circle.svg'
import { hideNotification } from '../../store/actions/notifications'

const styles = {
  container: css`
    width: 530px;
    padding: 16px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.25);
    cursor: pointer;
  `,

  success: css`
    background: #f6ffee;
    border-color: #b5ec8e;
  `,
  error: css`
    background: #fff1f0;
    border-color: #fea39e;
  `,
  icon: css`
    position: absolute;
    left: 16px;
    top: 16px;
    width: 22px;
    height: 22px;
  `,
  close: css`
    position: absolute;
    right: 16px;
    top: 22px;
    width: 12px;
    height: 12px;
    cursor: pointer;
  `,
  content: css`
    margin-left: 30px;
  `,
  title: css`
    display: inline-block;
    font-weight: 600;
    font-family: Open Sans;
    margin-bottom: 4px;
    line-height: 1.5;
    letter-spacing: 0.32px;
    color: #000000;
    
  `,
  text: css`
    font-family: Open Sans;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.57;
    color: #000000;
    b {
      font-weight: 600;
    }
  `,
}

const styleMap = {
  'success': styles.success,
  'error': styles.error,
}

const iconMap = {
  'success': successCircle,
  'error': failCircle,
}

export default ({ title, message, type, uuid, dispatch, className='' }) => {
  const icon = iconMap[type] ? <img src={iconMap[type]} className={styles.icon} /> : null
  return <div
    className={cx(styles.container, styleMap[type], className)}
    onClick={() => dispatch(hideNotification(uuid)) }
  >
    {icon}
    <div className={styles.content}>
      {title ? <div className={styles.title}>{title}</div> : null }
      {message ? <div className={styles.text} dangerouslySetInnerHTML={{__html: message}}></div> : null }
    </div>
    <img src={close} className={styles.close}/>
  </div>
}
