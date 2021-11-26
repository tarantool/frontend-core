import React from 'react';
import { css } from '@emotion/css';
import { baseFontFamily } from '@tarantool.io/ui-kit';

const styles = {
  container: css`
    margin: 30px;
    font-family: ${baseFontFamily};
  `,
};

export default class NoComponent extends React.Component {
  render() {
    return <div className={styles.container}>Not loaded</div>;
  }
}
