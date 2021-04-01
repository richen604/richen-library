import { useQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import { USER_INFO, FILTER_GENRES } from '../queries'

const FavoriteGenre = ({ user, books, setFavorite }) => {
  useEffect(() => {
    setFavorite(user.favoriteGenre)

    // eslint-disable-next-line
  }, [user.favoriteGenre])

  return (
    <div>
      <h2>books</h2>
      <p>
        books in your favorite genre <strong>{user.favoriteGenre}</strong>{' '}
      </p>
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

const UserInfo = () => {
  const [favorite, setFavorite] = useState('all')
  let user = useQuery(USER_INFO, {})

  let books = useQuery(FILTER_GENRES, {
    variables: {
      filter: favorite,
    },
    onError: (error) => {
      console.log(error)
    },
    pollInterval: 2000,
  })

  if (books.loading || user.loading) return <div>loading...</div>

  books = books.data.filterGenre
  user = user.data.me

  if (user.favoriteGenre) {
    return <FavoriteGenre {...{ user, books, setFavorite }} />
  }

  return (
    <div>
      Username: {user.username} <br /> Favorite Genre: None
    </div>
  )
}

export default UserInfo
