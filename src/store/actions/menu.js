import { EXPAND } from '../constants';

export const expand = (link, expanded) => ({
  type: EXPAND,
  payload: {
    expanded,
    location: {
      pathname: link,
    },
  },
});
