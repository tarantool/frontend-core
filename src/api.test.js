import axios from 'axios'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import nock from 'nock'
import gql from 'graphql-tag'

import { generateApiMethod } from './api'

axios.defaults.adapter = require('axios/lib/adapters/http')

const callFn = fn => (r, n) => {
  fn(r)
  return n(r)
}

const host = 'https://interceptors.com'

const scope = nock(host)

const localScope = nock('http://localhost')

test('api methods: priority', async() => {
  const apiMethods = generateApiMethod()
  const axiosInstance = axios.create()
  apiMethods.axiosWizard(axiosInstance)

  let log = []

  const myMockFn1 = jest.fn(() => log.push('innerPriority 1'))
  const myMockFn2 = jest.fn(() => log.push('innerPriority 2'))

  apiMethods.registerAxiosHandler('request', callFn(myMockFn1))
  apiMethods.registerAxiosHandler('request', callFn(myMockFn2))

  scope.get('/rest/ok').reply(200, {
    content: 'content'
  })

  await axiosInstance.get(`${host}/rest/ok`)

  expect(myMockFn1).toBeCalled()
  expect(myMockFn2).toBeCalled()

  expect(log).toEqual(['innerPriority 2', 'innerPriority 1'])

  scope.get('/rest/ok').reply(200, {
    content: 'content'
  })

  log = []

  const myMockFnBefore = jest.fn(() => log.push('priority -1'))
  const myMockFnAfter = jest.fn(() => log.push('priority 1'))

  apiMethods.registerAxiosHandler('request', callFn(myMockFnBefore), -1)
  apiMethods.registerAxiosHandler('request', callFn(myMockFnAfter), 1)

  await axiosInstance.get(`${host}/rest/ok`)

  expect(myMockFnBefore).toBeCalled()

  expect(log).toEqual(['priority -1', 'innerPriority 2', 'innerPriority 1', 'priority 1'])
})

test('api methods: subscribe and unsubscribe', async() => {
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
  it('rest: ok', async() => {
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
  it('rest: response error', async() => {
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

test('api methods: graphql', async() => {
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
    uri: 'http://localhost/graphql',
    credentials: 'include',
    fetchOptions: {
      mode: 'no-cors'
    }
  })

  const cache = new InMemoryCache({
    addTypename: false
  })

  const graphqlClient = new ApolloClient({
    link: from([
      apiMethods.apolloLinkAfterware,
      apiMethods.apolloLinkOnError,
      apiMethods.apolloLinkMiddleware,
      httpLink
    ]),
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

  let log = []

  const middlewareFn1 = jest.fn(() => log.push('middleware priority -1'))
  const middlewareFn2 = jest.fn(() => log.push('middleware innerPriority 1'))
  const middlewareFn3 = jest.fn(() => log.push('middleware innerPriority 2'))
  const middlewareFn4 = jest.fn(() => log.push('middleware priority 1'))

  const afterwareFn1 = jest.fn(() => log.push('afterware priority -1'))
  const afterwareFn2 = jest.fn(() => log.push('afterware innerPriority 1'))
  const afterwareFn3 = jest.fn(() => log.push('afterware innerPriority 2'))
  const afterwareFn4 = jest.fn(() => log.push('afterware priority 1'))

  const onErrorFn1 = jest.fn(() => log.push('onError priority -1'))
  const onErrorFn2 = jest.fn(() => log.push('onError innerPriority 1'))
  const onErrorFn3 = jest.fn(() => log.push('onError innerPriority 2'))
  const onErrorFn4 = jest.fn(() => log.push('onError priority 1'))

  apiMethods.registerApolloHandler('middleware', callFn(middlewareFn1), -1)
  apiMethods.registerApolloHandler('middleware', callFn(middlewareFn4), 1)
  apiMethods.registerApolloHandler('middleware', callFn(middlewareFn2))
  apiMethods.registerApolloHandler('middleware', callFn(middlewareFn3))

  apiMethods.registerApolloHandler('afterware', callFn(afterwareFn1), -1)
  apiMethods.registerApolloHandler('afterware', callFn(afterwareFn4), 1)
  apiMethods.registerApolloHandler('afterware', callFn(afterwareFn2))
  apiMethods.registerApolloHandler('afterware', callFn(afterwareFn3))

  apiMethods.registerApolloHandler('onError', callFn(onErrorFn1), -1)
  apiMethods.registerApolloHandler('onError', callFn(onErrorFn4), 2)
  apiMethods.registerApolloHandler('onError', callFn(onErrorFn2))
  apiMethods.registerApolloHandler('onError', callFn(onErrorFn3))

  localScope.post('/graphql').reply(200, { data: { repairList: [], records: [] } })

  await graphqlClient.query({
    query
  })

  expect(log).toEqual([
    'middleware priority -1',
    'middleware innerPriority 2',
    'middleware innerPriority 1',
    'middleware priority 1',
    'afterware priority -1',
    'afterware innerPriority 2',
    'afterware innerPriority 1',
    'afterware priority 1'
  ])

  expect(onErrorFn1).not.toBeCalled()

  log = []

  localScope.post('/graphql').reply(502, 'bad gateway')

  try {
    await graphqlClient.query({
      query
    })
  } catch (e) {
    // nothing
  } finally {
    expect(log).toEqual([
      'middleware priority -1',
      'middleware innerPriority 2',
      'middleware innerPriority 1',
      'middleware priority 1',
      'onError priority -1',
      'onError innerPriority 2',
      'onError innerPriority 1',
      'onError priority 1'
    ])
    expect(middlewareFn1.mock.calls.length).toBe(2)
  }
})
