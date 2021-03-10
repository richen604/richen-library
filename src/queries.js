import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
        born
        bookCount
      }
      id
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author {
        name
        born
      }
      genres
    }
  }
`;

export const EDIT_AUTHOR_BORN = gql`
  mutation editAuthorBorn($name: String!, $born: Int!) {
    editAuthorBorn(name: $name, born: $born) {
      name
      born
      bookCount
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`;

export const FILTER_GENRES = gql`
  query filterGenre($filter: String!) {
    filterGenre(filter: $filter) {
      title
      published
      author {
        name
        born
      }
      genres
      id
    }
  }
`;

export const USER_INFO = gql`
  query {
    me {
      favoriteGenre
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {
        name
        born
      }
      genres
      id
    }
  }
`