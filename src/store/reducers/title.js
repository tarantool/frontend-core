// @flow
import type { ResetTitleAction, SetAppNameAction, SetTitleAction } from '../actions/title';
import { APP_NAME_SET, TITLE_RESET, TITLE_SET } from '../constants';

export type AppTitleState = {
  appName: ?string,
  title: string,
  propsList: Array<AppTitleProps>,
};

type Action = SetAppNameAction | SetTitleAction | ResetTitleAction;

const initialState = {
  appName: null,
  title: '',
  propsList: [],
};

export default (state: AppTitleState = initialState, action: Action): AppTitleState => {
  switch (action.type) {
    case APP_NAME_SET:
      return {
        ...state,
        appName: action.payload,
      };

    case TITLE_SET:
      return {
        ...state,
        title: action.payload.title,
        propsList: action.payload.propsList,
      };

    case TITLE_RESET:
      return initialState;

    default:
      return state;
  }
};
