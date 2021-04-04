import { useQuery } from '@apollo/client'
import React, { useContext } from 'react'
import Select from 'react-select'
import { ALL_GENRES, FILTER_GENRES } from '../queries'
import './Books.css'
import { Table } from 'reactstrap'
import SelectedContext from '../context/SelectedContext'

const Books = () => {
  const { selected, setSelected } = useContext(SelectedContext)

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
