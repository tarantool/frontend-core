// @flow
import { useCallback, useState } from 'react';

export const useForceUpdate = () => {
  const [, setState] = useState(0);
  return useCallback(() => void setState((x) => x + 1));
};
