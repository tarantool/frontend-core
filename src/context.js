// @flow
import { createContext, createElement, useContext } from 'react';
import type { ComponentType } from 'react';

import type Core from './core';

export const CoreContext = createContext<Core | null>(null);

export const useCore = () => useContext(CoreContext);

export const withCore = (Component: ComponentType<any>): ComponentType<any> => {
  return ({ children, ...props }: { children?: React$Node }) => {
    const core = useCore();
    return core ? createElement(Component, { ...props, core }, children) : null;
  };
};
