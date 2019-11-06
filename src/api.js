// @flow
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'

export type AxiosHandlerType = 'request' | 'response' | 'requestError' | 'responseError'
export type ApolloHandlerType = 'middleware' | 'afterware'

export type HandlerType = (result: any, handlers: Array<HandlerType>) => any

const responsibilityChain = (input, [handler, ...handlers] = []) => {
  if (handler) {
    return handler(input, x => responsibilityChain(x, handlers))
  }
  return input
}

export const generateApiMethod = () => {
  const axiosHandlers: { [AxiosHandlerType]: Array<Function> } = {
    request: [],
    response: [],
    requestError: [],
    responseError: []
  }

  const apolloHandlers: { [ApolloHandlerType]: Array<Function> } = {
    middleware: [],
    afterware: []
  }

  const registerAxiosHandler = (type: AxiosHandlerType, handler: HandlerType) => {
    axiosHandlers[type] = [handler, ...axiosHandlers[type]]
    return () => {
      axiosHandlers[type] = axiosHandlers[type].filter(x => x !== handler)
    }
  }

  const registerApolloHandler = (type: ApolloHandlerType, handler: HandlerType) => {
    apolloHandlers[type] = [handler, ...apolloHandlers[type]]
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

  const apolloLinkAfterware = onError(error => {
    responsibilityChain(error, apolloHandlers['afterware'])
  })

  return {
    registerAxiosHandler,
    registerApolloHandler,
    axiosWizard,
    apolloLinkMiddleware,
    apolloLinkAfterware
  }
}

export default generateApiMethod()
