// @flow
import React from 'react';
import withSideEffect from 'react-side-effect';
import * as R from 'ramda';

import { useCore } from '../context';
import type Core from '../core';
import { setTitle } from '../store/actions/title';

type AppTitleWithCoreProps = AppTitleProps & { core: Core };

type HandleStateChangeProps = {
  core: Core | null,
  title: string,
  propsList: AppTitleWithCoreProps[],
};

const reducePropsToState = (propsList: AppTitleWithCoreProps[]): HandleStateChangeProps => {
  const last = R.last(propsList) || { core: null, title: '' };
  return { core: last.core || null, title: last.title || '', propsList: propsList || [] };
};

const handleStateChange = ({ core, title, propsList = [] }: HandleStateChangeProps): void => {
  if (core) {
    core.dispatch(
      'dispatchToken',
      setTitle({
        title,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        propsList: propsList.map(({ core, ...other }) => other),
      })
    );
  }
};

const AppTitle = withSideEffect(reducePropsToState, handleStateChange)(() => null);

type AppTitlePropsDeprecated = AppTitleProps & { link?: string };

export default ({ title, path, link }: AppTitlePropsDeprecated) => {
  const core = useCore();
  return core ? <AppTitle core={core} title={title} path={path || link} /> : null;
};
