import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import Select from 'react-select'
import { ALL_GENRES, FILTER_GENRES, BOOK_ADDED } from '../queries'
import { useApolloClient, useSubscription } from '@apollo/client'
import './Books.css'
import { Table } from 'reactstrap'

const Books = () => {
  const [selected, setSelected] = useState({ value: 'all', label: 'all' })
  const client = useApolloClient()

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

  let books = useQuery(FILTER_GENRES, {
    variables: {
      filter: selected.value,
    },
    onError: (error) => {
      console.log(error)
    },
  })

  let genres = useQuery(ALL_GENRES, {
    pollInterval: 2000,
  })

  if (books.loading || genres.loading) return <div>loading...</div>

  books = books.data.filterGenre
  genres = genres.data.allGenres.concat(['all']).reverse()

  const options = genres.map((genre) => {
    const option = { value: genre, label: genre }
    return option
  })

  return (
    <div id="books-container">
      <div id="books-select-container">
        <h2>Books</h2>
        Filter: <br />
        <Select
          id="books-select"
          defaultValue={selected}
          onChange={setSelected}
          options={options}
        />
      </div>
      <Table id="books-table">
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Books
