// @flow
import * as React from 'react'
import withSideEffect from 'react-side-effect'
import { setTitle } from '../store/actions/title'
import core from '../coreInstance'
import * as R from 'ramda'

const reducePropsToState = (propsList: AppTitleProps[]): { title: string, propsList: AppTitleProps[] } => {
  return { title: (R.last(propsList) || { title: '' }).title, propsList: propsList || [] }
}

const handleStateChange = ({ title, propsList = [] }: { title: string, propsList: AppTitleProps[] }): void => {
  core.dispatch('dispatchToken', setTitle({ title, propsList }))
}

const AppTitle = withSideEffect(reducePropsToState, handleStateChange)(() => null)

type AppTitlePropsDeprecated = AppTitleProps & { link?: string }

export default ({ title, path, link }: AppTitlePropsDeprecated) => (
  <AppTitle
    title={title}
    path={path || link}
  />
)
