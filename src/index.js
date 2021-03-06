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
import 'bootstrap/dist/css/bootstrap.min.css'

import { setContext } from 'apollo-link-context'
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: { ...headers, authorization: token ? `Bearer ${token}` : '' },
  }
})

//local dev uri: `http://localhost:${process.env.PORT || 4000}/graphql`,
//production uri: '/graphql',
const httpLink = createHttpLink({
  uri: `/graphql`,
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/subscriptions`,
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

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
)
