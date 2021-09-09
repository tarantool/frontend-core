// @flow
import React from 'react';
import withSideEffect from 'react-side-effect';
import * as R from 'ramda';

import core from '../coreInstance';
import { setTitle } from '../store/actions/title';

const reducePropsToState = (propsList: AppTitleProps[]): { title: string, propsList: AppTitleProps[] } => {
  return { title: (R.last(propsList) || { title: '' }).title, propsList: propsList || [] };
};

const handleStateChange = ({ title, propsList = [] }: { title: string, propsList: AppTitleProps[] }): void => {
  core.dispatch('dispatchToken', setTitle({ title, propsList }));
};

const AppTitle = withSideEffect(reducePropsToState, handleStateChange)(() => null);

type AppTitlePropsDeprecated = AppTitleProps & { link?: string };

export default ({ title, path, link }: AppTitlePropsDeprecated) => <AppTitle title={title} path={path || link} />;
