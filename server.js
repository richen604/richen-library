require('dotenv').config()
const { ApolloServer } = require('apollo-server-express')

const express = require('express')
const app = express() // create express app
const mongoose = require('mongoose')
const { typeDefs, resolvers } = require('./schema/')
const cors = require('cors')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

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

const { createServer } = require('http')

app.use(
  cors({
    credentials: true,
    origin: `http://localhost:${process.env.PORT || 4000}`,
  }),
)

app.use(express.static('build'))

//health check get request handling
app.get('/health', (req, res) => {
  res.send('ok')
})

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        `${process.env.JWT_SECRET}`,
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
  subscriptions: {
    path: '/subscriptions',
    onConnect: () => {
      console.log('Connected to Apollo Websocket!')
    },
    onDisconnect: () => {
      console.log('Disconnected from Apollo Websocket')
    },
  },
})

apolloServer.applyMiddleware({
  app,
  path: '/graphql',
  cors: {
    credentials: true,
    origin: `http://localhost:${process.env.PORT || 4000}`,
  },
})

const server = createServer(app)
apolloServer.installSubscriptionHandlers(server)

server.listen({ port: process.env.PORT || 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`)
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`,
  )
})
