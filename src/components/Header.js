// @flow
import    * as React from 'react';
import { connect } from 'react-redux';
import { css, cx } from 'react-emotion';
import { selectTitle } from '../store/selectors'
import { push } from 'connected-react-router';
import core from '../coreInstance';
import * as R from 'ramda';
import { selectBreadcrumbs } from '../store/selectors'
import NotificationWidget from './NotificationWidget'

const styles = {
  header: css`
    height: 69px;
    background: #FFFFFF;
    width: 100%;
    display: flex;
    box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
    padding: 0 32px;
    box-sizing: border-box;
    flex-direction: row;
    align-items: center;
  `,
  logoWrap: css`
    position: relative;
    flex-shrink: 0;
    width: 243px;
  `,
  logo: css`
    position: absolute;
    left: 12px; 
    top: -1px;
    width: 146px;
    height: 53px;
  `,
  titleContainer: css`
    flex-grow: 1;
    flex-shrink: 0;
  `,
  title: css`
    font-size: 24px;
    font-family: Open Sans;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: 0.72px;
    color: #000000;
    margin: 0;
    text-transform: uppercase;
  `,
  infoContainer: css`
    flex-grow: 0;
    flex-shrink: 0;
  `,
  breadcrumbs: css`
    font-family: Open Sans;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  `,
  breadcrumbElement: css`
    font-family: Open Sans;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    display: inline-block;
  `,
  breadcrumbNoInteract: css`
    color: rgba(0, 0, 0, 0.45);
  `,
  breadcrumbDelimeter: css`
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    margin: 0 8px;
  `,
  breadcrumbActive: css`
    color: rgba(0, 0, 0, 0.65);
    text-decoration: none;
  `
};

type HeaderProps = {
  title: string,
  breadcrumbs: AppTitleProps[],
  dispatch: Function,
};

class Header extends React.Component<HeaderProps> {
  componentDidMount() {
    core.subscribe('setHeaderComponent', () => {
      this.forceUpdate();
    });
  }

  render() {
    const { title, breadcrumbs, dispatch } = this.props;
    const breadcrumbsComponents = R.flatten(breadcrumbs.map(
      ({link, title}, i) => [
        <span key={`delimiter_${i}`} className={`${styles.breadcrumbDelimeter} ${styles.breadcrumbElement}`}>/</span>,
        link
          ?
          <a
            key={`title_${i}`}
            href={link}
            onClick={(e) => {e.preventDefault(); dispatch(push(link))}}
            className={cx(styles.breadcrumbActive, styles.breadcrumbElement)}>
            {title}
          </a>
          :
          <span
            key={`title_${i}`}
            className={cx(styles.breadcrumbActive, styles.breadcrumbElement)}
          >
            {title}
          </span>
      ]
    ))
    return (
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.breadcrumbs}>
            <span className={cx(styles.breadcrumbNoInteract, styles.breadcrumbElement)}>Tarantool</span>
            {breadcrumbsComponents}
          </div>
        </div>
        <div className={styles.infoContainer}>
          <NotificationWidget/>
          {core.getHeaderComponent()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  title: selectTitle(state),
  breadcrumbs: selectBreadcrumbs(state),
});

export default connect(mapStateToProps)(Header);
