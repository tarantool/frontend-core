import Core from '../core'
import { createCoreStore } from '../store'

export const generateCoreWithStore = () => {
  const coreInstance = new Core()
  const store = createCoreStore(coreInstance)
  return {
    coreInstance,
    store
  }
}
