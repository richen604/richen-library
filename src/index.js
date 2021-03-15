import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  split,
} from '@apollo/client'

import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

import { setContext } from 'apollo-link-context'
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: { ...headers, authorization: token ? `Bearer ${token}` : '' },
  }
})

// for production `https://richen-library.herokuapp.com:${process.env.PORT || 4000}/graphql`,
// for local development `http://localhost:${process.env.PORT || 4000}/graphql`
const httpLink = createHttpLink({
  uri: `http://localhost:${process.env.PORT || 4000}/graphql`,
  credentials: 'same-origin',
})

// for production `ws://richen-library.herokuapp.com:${process.env.PORT || 4000}/subscriptions`
// for local development `ws://localhost:${process.env.PORT || 4000}/subscriptions`
const wsLink = new WebSocketLink({
  uri: `ws://localhost:${process.env.PORT || 4000}/subscriptions`,
  options: { reconnect: true },
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
})

window.addEventListener('beforeunload', () => {
  // @ts-ignore - the function is private in typescript
  wsLink.subscriptionClient.close()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
)
