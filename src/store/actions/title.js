// @flow
import { APP_NAME_SET, TITLE_RESET, TITLE_SET } from '../constants';

export type SetAppNameAction = {
  type: 'APP_NAME_SET',
  payload: string,
};

export type SetTitleAction = {
  type: 'TITLE_SET',
  payload: { title: string, propsList: AppTitleProps[] },
};

export type ResetTitleAction = {
  type: 'TITLE_RESET',
};

export const setTitle = ({ title, propsList }: { title: string, propsList: AppTitleProps[] }): SetTitleAction => ({
  type: TITLE_SET,
  payload: { title, propsList },
});

export const setAppName = (name: string): SetAppNameAction => ({
  type: APP_NAME_SET,
  payload: name,
});

export const resetTitle = (): ResetTitleAction => ({ type: TITLE_RESET });
