require('dotenv').config()
const {
  UserInputError,
  AuthenticationError,
  gql,
  PubSub,
} = require('apollo-server-express')
const Book = require('../models/book')
const Author = require('../models/author')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const pubsub = new PubSub()

const typeDefs = gql`
  type Subscription {
    bookAdded: Book!
  }
  type User {
    username: String!
    favoriteGenre: String
    id: ID!
  }
  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type Author {
    id: ID!
    name: String!
    born: Int
    books: [Book]!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks: [Book!]!
    allAuthors: [Author!]!
    me: User
    filterGenre(filter: String!): [Book!]!
    allGenres: [String!]!
  }
  type Mutation {
    addBook(
      title: String!
      published: Int!
      genres: [String!]!
      author: String!
    ): Book
    addAuthor(name: String!, born: Int): Author
    editAuthorBorn(name: String!, born: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async () => {
      return await Book.find({}).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({}).populate('books')
      return authors
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    filterGenre: async (root, args) => {
      if (args.filter === 'all') return await Book.find({}).populate('author')

      const filter = await Book.find({
        genres: { $in: [`${args.filter}`] },
      }).populate('author')

      return filter
    },
    allGenres: async () => {
      const books = await Book.find({})
      const genresSet = new Set(
        [].concat.apply(
          [],
          books.map((book) => book.genres),
        ),
      )
      const genres = [...genresSet]
      return genres
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      //find an author if one exists
      const author = await Author.findOne({ name: args.author })
        .populate('books')
        .populate('bookCount')

      //return for handling !author edge case
      if (!author)
        return console.log(
          'create the author before supplying a book with the author object',
        )
      const book = new Book({ ...args, author })
      author.books.push(book)

      try {
        await book.save()
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      await pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    addAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const author = await Author.findOne({ name: args.name })
      if (author) {
        throw new UserInputError('Author already exists', {
          invalidArgs: args,
        })
      }

      const newAuthor = new Author({ ...args, books: [] })

      try {
        await newAuthor.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return newAuthor
    },
    editAuthorBorn: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.born

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'admin') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: jwt.sign(userForToken, `${process.env.JWT_SECRET}`),
      }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = {
  typeDefs,
  resolvers,
}
