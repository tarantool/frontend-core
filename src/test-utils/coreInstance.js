import Core from '../core'
import { createCoreStore } from '../store'
import { createHistory } from '../store/history'

export const generateCoreWithStore = () => {
  const coreInstance = new Core()
  const store = createCoreStore(coreInstance)
  return {
    coreInstance,
    store,
  }
}
