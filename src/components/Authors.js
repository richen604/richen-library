import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'
import { ALL_AUTHORS, EDIT_AUTHOR_BORN } from '../queries'

const Authors = () => {
  const [born, setBorn] = useState('')
  const [selected, setSelected] = useState(null)
  const [changeBorn] = useMutation(EDIT_AUTHOR_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error)
    },
  })
  const result = useQuery(ALL_AUTHORS, { polling: 2000 })

  if (result.loading) return <div>loading...</div>

  const authors = result.data.allAuthors

  const options = authors.map((author) => {
    const option = { value: author.name, label: author.name }
    return option
  })

  const submit = (event) => {
    event.preventDefault()

    if (!selected) return
    changeBorn({
      variables: {
        name: selected.value,
        born: Number(born),
      },
    })
    setBorn('')
    setSelected(null)
  }

  return (
    <>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Change Author Birth Year</h2>

        <form onSubmit={submit}>
          <Select
            defaultValue={selected}
            onChange={setSelected}
            options={options}
          />
          <div>
            born{' '}
            <input
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type="submit">Change Birth Year</button>
        </form>
      </div>
    </>
  )
}

export default Authors
