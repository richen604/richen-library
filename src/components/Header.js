import React, { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { Link } from 'react-router-dom'
import {
  Navbar,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import './Header.css'
import LoginFormDropdown from './LoginFormDropdown'

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
    <Navbar id="header">
      <div id="header-left-container">
        <NavbarBrand id="header-brand" href="/">
          Library
        </NavbarBrand>
      </div>
      <div id="header-right-container">
        <Link className="header-links" to="/authors">
          Authors
        </Link>
        <Link className="header-links" to="/books">
          Books
        </Link>
        {token && (
          <Link className="header-links" to="/userinfo">
            UserInfo
          </Link>
        )}
        {token !== null ? (
          <button onClick={() => handleLogout()}>logout</button>
        ) : (
          <UncontrolledDropdown inNavbar>
            <DropdownToggle id="header-login-button" nav>
              Sign In
            </DropdownToggle>
            <DropdownToggle id="header-login-logo-wrapper" nav>
              <FontAwesomeIcon id="header-login-logo" icon={faSignInAlt} />
            </DropdownToggle>
            <DropdownMenu id="header-dropdown-box" right>
              <LoginFormDropdown {...{ setToken }} />
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
      </div>
    </Navbar>
  )
}
