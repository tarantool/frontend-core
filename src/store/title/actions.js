// @flow
import {
  TITLE_SET,
  TITLE_RESET,
} from '../constants';

export type SetTitleAction = {
  type: 'TITLE_SET',
  payload: string
};

export type ResetTitleAction = {
  type: 'TITLE_RESET'
};

export const setTitle = (title: string): SetTitleAction => ({
  type: TITLE_SET,
  payload: title,
});

export const resetTitle = (): ResetTitleAction => ({ type: TITLE_RESET });
