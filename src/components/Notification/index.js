import * as React from 'react'
import { css, cx } from '@emotion/css'
import { format } from 'date-fns'
import { Button, baseFontFamily } from '@tarantool.io/ui-kit'
import failCircle from './fail-circle.svg'
import successCircle from './success-circle.svg'

const styles = {
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
    font-family: ${baseFontFamily};
    font-size: 14px;
    color: #000;
    display: block;
    margin: 0 0 4px 0;
  `,
  date: css`
    font-family: ${baseFontFamily};
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    padding-bottom: 7px;
    margin-left: auto;
  `,
  infoBlock: css`
    display: flex;
    align-items: center;
  `
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
  className = ''
}) => {
  return (
    <div className={cx(styles.container, className)}>
      {iconMap[type] ? <img src={iconMap[type]} className={styles.icon} /> : null}
      <div className={styles.content}>{title}</div>
      {message ? <div className={styles.content} dangerouslySetInnerHTML={{ __html: message }}></div> : null}
      <div className={styles.infoBlock}>
        {details &&
          <Button
            onClick={() => onDetailsClick(details)}
            intent='base'
            size='s'
          >
            {getDetailsButtonText(type)}
          </Button>
        }
        <div className={styles.date}>{initedAt ? format(initedAt, 'HH:mm d MMM yyyy') : ''}</div>
      </div>
    </div>
  )
}
