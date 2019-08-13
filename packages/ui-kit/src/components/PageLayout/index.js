// @flow
import * as React from 'react';
import { css, cx } from 'emotion'

const styles = {
  outer: css`
    display: flex;
    height: 100%;
  `
}

type PageLayoutProps = {
  className?: string,
  children?: React.Node,
  sideContent?: React.Node
};

export default ({ children, className, sideContent }: PageLayoutProps) => (
  <div className={cx(className, styles.outer)}>
    <div>{sideContent}</div>
    <div>{children}</div>
  </div>
);
