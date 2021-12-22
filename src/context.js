// @flow
import { createContext, createElement, useContext, useEffect } from 'react';
import type { ComponentType } from 'react';

import type Core from './core';
import { useForceUpdate } from './utils/hooks';

export const CoreContext = createContext<Core | null>(null);

export const useCore = () => useContext(CoreContext);

export const useAppReactTreeKey = (): number => {
  const core = useCore();
  const update = useForceUpdate();

  useEffect(() => {
    if (!core) {
      return;
    }

    return core.subscribe('core:updateReactTreeKey', update);
  }, [core, update]);

  return core ? core.reactTreeKey : 0;
};

export const withCore = (Component: ComponentType<any>): ComponentType<any> => {
  return ({ children, ...props }: { children?: React$Node }) => {
    const core = useCore();
    return core ? createElement(Component, { ...props, core }, children) : null;
  };
};
