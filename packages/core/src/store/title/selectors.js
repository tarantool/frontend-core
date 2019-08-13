// @flow
import { type State } from '../index'
import { selectCurrentMenuItemLabel } from '../selectors'

export const selectTitle = (state: State) => state.appTitle.title || selectCurrentMenuItemLabel(state)
