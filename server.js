require('dotenv').config()
const { ApolloServer } = require('apollo-server-express')

const express = require('express')
const app = express() // create express app
const mongoose = require('mongoose')
const schema = require('./schema/')
const cors = require('cors')

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const apolloServer = new ApolloServer(schema)

const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const bodyParser = require('body-parser')
const { SubscriptionServer } = require('subscriptions-transport-ws')

app.use(cors())
app.use(express.static('build'))

app.use('/graphql', bodyParser.json())

// for production
// for local development `http://localhost:${process.env.PORT || 4000}`
apolloServer.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: `http://localhost:${process.env.PORT || 4000}`,
  },
})

//health check get request handling
app.get('/health', (req, res) => {
  res.send('ok')
})

const server = createServer(app)

server.listen({ port: process.env.PORT || 4000 }, () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: server,
      path: '/subscriptions',
    },
  )
})
