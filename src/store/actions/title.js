// @flow
import {
  TITLE_SET,
  TITLE_RESET,
} from '../constants';


export type SetTitleAction = {
  type: 'TITLE_SET',
  payload: {title: string, propsList: AppTitleProps[]}
};

export type ResetTitleAction = {
  type: 'TITLE_RESET'
};

export const setTitle = ({title, propsList}: {title: string, propsList: AppTitleProps[]}): SetTitleAction => ({
  type: TITLE_SET,
  payload: {title, propsList}
});

export const resetTitle = (): ResetTitleAction => ({ type: TITLE_RESET });
