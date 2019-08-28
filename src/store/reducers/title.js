// @flow
import {
  TITLE_SET,
  TITLE_RESET,
} from '../constants';

import type { SetTitleAction, ResetTitleAction } from '../actions/title';

export type AppTitleState = {
  title: string,
  propsList: Array<AppTitleProps>,
};

type Action = SetTitleAction | ResetTitleAction;

const initialState = {
  title: '',
  propsList: [],
};

export default (state: AppTitleState = initialState, action: Action): AppTitleState => {
  switch (action.type) {
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
}
