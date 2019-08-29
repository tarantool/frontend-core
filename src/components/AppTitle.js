// @flow
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

export default withSideEffect(reducePropsToState, handleStateChange)(() => null)
