import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import Select from 'react-select'
import { ALL_GENRES, FILTER_GENRES, BOOK_ADDED } from '../queries'
import { useApolloClient, useSubscription } from '@apollo/client'

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
    <div>
      <h2>books</h2>
      Filter:{' '}
      <button onClick={() => setSelected({ value: 'all', label: 'all' })}>
        {' '}
        Show All{' '}
      </button>
      <br />
      <Select
        defaultValue={selected}
        onChange={setSelected}
        options={options}
      />
      <table>
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
      </table>
    </div>
  )
}

export default Books
