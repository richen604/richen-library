import React, { useState, useContext } from 'react'
import { useMutation, useApolloClient, useSubscription } from '@apollo/client'
import { CREATE_BOOK, BOOK_ADDED, FILTER_GENRES } from '../queries'
import SelectedContext from '../context/SelectedContext'
import { Form, Input, Button } from 'reactstrap'
import './NewBook.css'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const client = useApolloClient()
  const { selected } = useContext(SelectedContext)

  const updateCacheWith = (bookAdded) => {
    const includedIn = (set, object) => set.map((p) => p.id).includes(object.id)

    const dataInStore = client.readQuery({
      query: FILTER_GENRES,
      variables: { filter: selected.value },
    })
    if (!includedIn(dataInStore.filterGenre, bookAdded)) {
      client.writeQuery({
        query: FILTER_GENRES,
        data: { allBooks: dataInStore.filterGenre.concat(bookAdded) },
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    },
  })

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.log(error)
    },
    update: (store, response) => {
      updateCacheWith(response.data.addedBook)
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    createBook({ variables: { title, published, author, genres } })
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div id="newBook-container">
      <h2>New Book</h2>
      <Form id="newBook-form" onSubmit={submit}>
        <div>
          Title:
          <Input
            className="newBook-input"
            placeholder="Clean Code"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author:
          <Input
            className="newBook-input"
            placeholder="Robert Martin"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Published:
          <Input
            className="newBook-input"
            placeholder="2008"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          Genre:
          <Input
            placeholder="refactoring"
            className="newBook-input"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
        </div>
        <Button
          id="newBook-genre-button"
          className="newBook-button"
          onClick={addGenre}
          type="button"
        >
          add genre
        </Button>
        <div>Added Genres: {genres.join(' ')}</div>
        <Button
          id="newBook-book-button"
          className="newBook-button"
          type="submit"
        >
          create book
        </Button>
      </Form>
    </div>
  )
}

export default NewBook
