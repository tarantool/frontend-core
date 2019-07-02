// @flow
import withSideEffect from 'react-side-effect';
import { setTitle } from '../store/title/actions';
import core from '../coreInstance';
import * as R from 'ramda';

type AppTitleProps = {
  title: string
};

const reducePropsToState = (propsList: AppTitleProps[]): string => {
  return (R.last(propsList) || {title: ''}).title;
};

const handleStateChange = (title: string): void => {
  core.dispatch(
    'dispatchToken',
    setTitle(title)
  );
};

export default withSideEffect(reducePropsToState, handleStateChange)(() => null);
