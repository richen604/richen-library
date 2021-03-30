import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient, useSubscription } from '@apollo/client'
import UserInfo from './components/UserInfo'
import { FILTER_GENRES, BOOK_ADDED } from './queries'
//import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
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

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors show={page === 'authors'} />

        <Books
          show={page === 'books'}
          selected={selected}
          setSelected={setSelected}
        />
        <LoginForm show={page === 'login'} {...{ setToken, setPage }} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add book')}>add book</button>
        <button onClick={() => setPage('userinfo')}>userinfo</button>
        <button onClick={() => handleLogout()}>logout</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books
        show={page === 'books'}
        selected={selected}
        setSelected={setSelected}
      />

      <NewBook show={page === 'add book'} {...{ updateCacheWith }} />

      <UserInfo show={page === 'userinfo'} />
    </div>
  )
}

export default App
