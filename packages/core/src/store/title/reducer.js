// @flow
import {
  TITLE_SET,
  TITLE_RESET,
} from '../constants';

import type { SetTitleAction, ResetTitleAction } from './actions';

export type AppTitleState = {
  title: string
};

type Action = SetTitleAction | ResetTitleAction;

const initialState = {
  title: '',
};

export default (state: AppTitleState = initialState, action: Action): AppTitleState => {
  switch (action.type) {
    case TITLE_SET:
      return {
        ...state,
        title: action.payload,
      };

    case TITLE_RESET:
      return initialState;

    default:
      return state;
  }
}