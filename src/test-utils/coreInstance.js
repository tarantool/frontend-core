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

export const registerModule = (core, module) => core.register(
  module.namespace,
  module.menu,
  module.RootComponent,
  module.engine,
  module.menuMiddleware,
  module.menuFilter
);
