import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { Form, Input, Button } from 'reactstrap'
import './LoginFormDropdown.css'

const LoginFormDropdown = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data]) // eslint-disable-line
  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <>
      <Form id="login-dropdown-form" onSubmit={submit}>
        <Input
          className="login-dropdown-input"
          value={username}
          placeholder="Username..."
          onChange={({ target }) => setUsername(target.value)}
        />
        <Input
          className="login-dropdown-input"
          type="password"
          placeholder="Password..."
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button id="login-dropdown-button" type="submit">
          Sign In
        </Button>
      </Form>
      <div id="login-dropdown-info">
        <p>
          <strong>Username:</strong> admin <br /> <strong>Password:</strong>{' '}
          admin
        </p>
        <p></p>
      </div>
    </>
  )
}

export default LoginFormDropdown
