import React, { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { Link } from 'react-router-dom'

export default function Header() {
  const [token, setToken] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if (token) {
      setToken(token)
    }
  }, [])
  const client = useApolloClient()
  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  return (
    <>
      <div id="header-left-container">
        <Link to="/">Authors</Link>
        <Link to="/books">Books</Link>
        {token && <Link to="/userinfo">UserInfo</Link>}
      </div>
      <div id="header-right-container">
        {token !== null ? (
          <button onClick={() => handleLogout}>logout</button>
        ) : (
          <Link to="/login">login</Link>
        )}
      </div>
    </>
  )
}
