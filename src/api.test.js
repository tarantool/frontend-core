import axios from 'axios'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import nock from 'nock'
import gql from 'graphql-tag'

import { generateApiMethod } from './api'

const callFn = fn => (r, n) => {
  fn(r)
  return n(r)
}

const host = 'https://interceptors.com'

const scope = nock(host)

const localScope = nock('http://localhost')

test('api methods: subscribe and unsubscribe', async () => {
  const apiMethods = generateApiMethod()

  const axiosInstance = axios.create()
  apiMethods.axiosWizard(axiosInstance)

  const myMockFn1 = jest.fn()
  const myMockFn2 = jest.fn()

  const unsub1 = apiMethods.registerAxiosHandler('request', callFn(myMockFn1))
  const unsub2 = apiMethods.registerAxiosHandler('request', callFn(myMockFn2))

  scope.get('/rest/ok').reply(200, {
    content: 'content'
  })
  await axiosInstance.get(`${host}/rest/ok`)

  expect(myMockFn1).toBeCalled()
  expect(myMockFn2).toBeCalled()

  unsub1()

  scope.get('/rest/ok').reply(200, {
    content: 'content'
  })
  await axiosInstance.get(`${host}/rest/ok`)

  expect(myMockFn2.mock.calls.length).toBe(2)
  expect(myMockFn1.mock.calls.length).toBe(1)

  unsub2()

  scope.get('/rest/ok').reply(200, {
    content: 'content'
  })
  await axiosInstance.get(`${host}/rest/ok`)
  scope.get('/rest/ok').reply(200, {
    content: 'content'
  })

  expect(myMockFn2.mock.calls.length).toBe(2)
  expect(myMockFn1.mock.calls.length).toBe(1)
})

describe('api methods: rest', () => {
  it('rest: ok', async () => {
    const apiMethods = generateApiMethod()

    const axiosInstance = axios.create()
    apiMethods.axiosWizard(axiosInstance)

    const myMockFnRes = jest.fn()
    const myMockFnReq = jest.fn()

    apiMethods.registerAxiosHandler('response', callFn(myMockFnRes))
    apiMethods.registerAxiosHandler('request', callFn(myMockFnReq))

    scope.get('/rest/ok').reply(200, {
      content: 'content'
    })
    await axiosInstance.get(`${host}/rest/ok`)

    expect(myMockFnReq).toBeCalled()
    expect(myMockFnRes).toBeCalled()
  })
  it('rest: response error', async () => {
    const apiMethods = generateApiMethod()

    const axiosInstance = axios.create()
    apiMethods.axiosWizard(axiosInstance)

    const myMockFnRes = jest.fn()
    const myMockFnReq = jest.fn()

    apiMethods.registerAxiosHandler('responseError', callFn(myMockFnRes))
    apiMethods.registerAxiosHandler('request', callFn(myMockFnReq))

    scope.get('/rest/error').reply(502, 'Bad gateway')
    try {
      await axiosInstance.get(`${host}/rest/error`)
    } catch (e) {
      // nothing
    } finally {
      expect(myMockFnRes).toBeCalled()
      expect(myMockFnReq).toBeCalled()
    }
  })
})

test('api methods: graphql', async () => {
  const query = gql`
    query getInfo {
      repairList {
        t
      }
      records {
        t
      }
    }
  `
  const apiMethods = generateApiMethod()
  const httpLink = new HttpLink({
    uri: `http://localhost/graphql`,
    credentials: 'include',
    fetchOptions: {
      mode: 'no-cors'
    }
  })

  const cache = new InMemoryCache({
    addTypename: false
  })

  const graphqlClient = new ApolloClient({
    link: from([apiMethods.apolloLinkAfterware, apiMethods.apolloLinkMiddleware, httpLink]),
    cache,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache'
      },
      mutate: {
        fetchPolicy: 'no-cache'
      },
      watchQuery: {
        fetchPolicy: 'no-cache'
      }
    }
  })

  const middlewareFn = jest.fn()
  const afterwareFn = jest.fn()

  apiMethods.registerApolloHandler('middleware', callFn(middlewareFn))
  apiMethods.registerApolloHandler('afterware', callFn(afterwareFn))

  localScope.post('/graphql').reply(200, { data: { repairList: [], records: [] } })

  await graphqlClient.query({
    query
  })

  expect(middlewareFn).toBeCalled()
  expect(afterwareFn).not.toBeCalled()

  localScope.post('/graphql').reply(502, 'bad gateway')

  try {
    await graphqlClient.query({
      query
    })
  } catch (e) {
    // nothing
  } finally {
    expect(afterwareFn).toBeCalled()
    expect(middlewareFn.mock.calls.length).toBe(2)
  }
})