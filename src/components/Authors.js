import React, { useContext, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'
import { ALL_AUTHORS, EDIT_AUTHOR_BORN } from '../queries'
import { Form, Input, Button, Table } from 'reactstrap'
import './Authors.css'
import UserContext from '../context/UserContext'

const Authors = () => {
  const { token } = useContext(UserContext)
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
        <h2 id="authors-title">Authors</h2>
        {token && (
          <div id="authors-birth-container">
            <h6>Change Author Birth Year</h6>
            <Form id="authors-form" onSubmit={submit}>
              <Select
                placeholder="Select Author..."
                className="authors-input"
                defaultValue={selected}
                onChange={setSelected}
                options={options}
              />
              <div>
                <Input
                  placeholder="Authors New Birth Year..."
                  className="authors-input"
                  value={born}
                  onChange={({ target }) => setBorn(target.value)}
                />
              </div>
              <Button id="authors-button" type="submit">
                Change Birth Year
              </Button>
            </Form>
          </div>
        )}
        <Table id="authors-table">
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
                <td>{a.books.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default Authors
