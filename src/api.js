// @flow
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'

export type AxiosHandlerType = 'request' | 'response' | 'requestError' | 'responseError'
export type ApolloHandlerType = 'middleware' | 'onError' | 'afterware'

export type CallbackType = (result: any, next: Function) => any

let innerPriority = 0

export type HandlerInfo = {
  priority: number,
  callback: CallbackType,
  innerPriority: number
}

const responsibilityChain = (input: any, [handler, ...handlers]: Array<HandlerInfo> = []) => {
  if (handler) {
    return handler.callback(input, x => responsibilityChain(x, handlers))
  }
  return input
}

export const generateApiMethod = () => {
  const axiosHandlers: { [AxiosHandlerType]: Array<HandlerInfo> } = {
    request: [],
    response: [],
    requestError: [],
    responseError: []
  }

  const apolloHandlers: { [ApolloHandlerType]: Array<HandlerInfo> } = {
    middleware: [],
    onError: [],
    afterware: []
  }

  const registerAxiosHandler = (type: AxiosHandlerType, callback: CallbackType, priority: number = 0) => {
    const handler: HandlerInfo = {
      callback,
      priority,
      innerPriority: innerPriority++
    }
    axiosHandlers[type] = [handler, ...axiosHandlers[type]].sort((a, b) =>
      a.priority - b.priority === 0 ? b.innerPriority - a.innerPriority : a.priority - b.priority
    )
    return () => {
      axiosHandlers[type] = axiosHandlers[type].filter(x => x !== handler)
    }
  }

  const registerApolloHandler = (type: ApolloHandlerType, callback: CallbackType, priority: number = 0) => {
    const handler: HandlerInfo = {
      callback,
      priority,
      innerPriority: innerPriority++
    }
    apolloHandlers[type] = [handler, ...apolloHandlers[type]].sort(
      (a, b) => (a.priority - b.priority === 0 ? b.innerPriority - a.innerPriority : a.priority - b.priority) // !!!
    )
    return () => {
      apolloHandlers[type] = apolloHandlers[type].filter(x => x !== handler)
    }
  }

  const axiosWizard = (axios: Object) => {
    if (!axios.interceptors) throw new Error('need interceptors')

    axios.interceptors.request.use(
      config => {
        return responsibilityChain(config, axiosHandlers['request'])
      },
      error => {
        return Promise.reject(responsibilityChain(error, axiosHandlers['requestError']))
      }
    )

    axios.interceptors.response.use(
      response => {
        return responsibilityChain(response, axiosHandlers['response'])
      },
      error => {
        return Promise.reject(responsibilityChain(error, axiosHandlers['responseError']))
      }
    )
  }

  const apolloLinkMiddleware = new ApolloLink((operation, forward) => {
    const modOperation = responsibilityChain(operation, apolloHandlers['middleware'])
    return forward(modOperation)
  })

  const apolloLinkOnError = onError(error => {
    responsibilityChain(error, apolloHandlers['onError'])
  })

  const apolloLinkAfterware = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => responsibilityChain(response, apolloHandlers['afterware']))
  })

  return {
    registerAxiosHandler,
    registerApolloHandler,
    axiosWizard,
    apolloLinkMiddleware,
    apolloLinkOnError,
    apolloLinkAfterware
  }
}

export default generateApiMethod()
