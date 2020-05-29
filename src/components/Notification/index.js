import * as React from 'react'
import { css, cx } from 'emotion'
import { format } from 'date-fns'
import { Button } from '@tarantool.io/ui-kit'
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
    top: 19px;
    width: 22px;
    height: 22px;
  `,
  close: css`
    float: right;
    width: 12px;
    height: 12px;
    cursor: pointer;
    margin-left: 10px;
    margin-bottom: 4px;
  `,
  content: css`
    margin-left: 30px;
  `,
  title: css`
    display: block;
    font-weight: 600;
    font-family: Open Sans;
    margin-bottom: 8px;
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
  infoBlock: css`
    margin-top: 8px;
  `,
  detailsButton: css`
    background: #fff;
  `
}

const shortStyles = {
  container: css`
    padding-bottom: 7px;
    padding-left: 24px;
    position: relative;
  `,
  icon: css`
    position: absolute;
    left: 0;
    top: 3px;
    width: 16px;
    height: 16px;
  `,
  content: css`
    font-family: Open Sans;
    font-size: 14px;
    color: #000;
    display: block;
    margin: 0 0 4px 0;
  `,
  date: css`
    font-family: Open Sans;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    padding-bottom: 7px;
    margin-left: auto;
  `,
  infoBlock: css`
    display: flex;
    align-items: center;
  `,
  detailsButton: css`
    background: #fff;
  `
}

const styleMap = {
  success: styles.success,
  error: styles.error
}

const iconMap = {
  success: successCircle,
  error: failCircle
}

const getDetailsButtonText = type => (
  type === 'error' ? 'Error details' : 'More details'
);

export default ({
  title,
  message,
  details,
  onDetailsClick,
  type,
  uuid,
  dispatch,
  initedAt,
  className = '',
  isShort = false
}) => {
  const icon = iconMap[type] ? <img src={iconMap[type]} className={isShort ? shortStyles.icon : styles.icon} /> : null
  if (isShort) {
    return (
      <div className={cx(shortStyles.container, className)}>
        {icon}
        <div className={shortStyles.content}>{title}</div>
        {message ? <div className={shortStyles.content} dangerouslySetInnerHTML={{ __html: message }}></div> : null}
        <div className={shortStyles.infoBlock}>
          {details &&
            <Button
              onClick={() => onDetailsClick(details)}
              intent="secondary"
              size="s"
              className={shortStyles.detailsButton}
            >
              {getDetailsButtonText(type)}
            </Button>
          }
          <div className={shortStyles.date}>{format(initedAt, 'HH:mm d MMM yyyy')}</div>
        </div>
      </div>
    )
  }
  return (
    <div className={cx(styles.container, styleMap[type], className)} onClick={() => dispatch(hideNotification(uuid))}>
      {icon}
      <div className={styles.content}>
        <img src={close} className={styles.close} />
        {title ? (
          <span className={styles.title}>{title}</span>
        ) : null}
        {message ? <span className={styles.text} dangerouslySetInnerHTML={{ __html: message }}></span> : null}
        {details &&
          <div className={styles.infoBlock}>
            <Button onClick={() => onDetailsClick(details)} intent="secondary" className={styles.detailsButton}>
              {getDetailsButtonText(type)}
            </Button>
          </div>
        }
      </div>
    </div>
  )
}
