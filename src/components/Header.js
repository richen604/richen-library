import React, { useContext, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { Link } from 'react-router-dom'
import {
  Navbar,
  NavbarBrand,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Button,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faSignInAlt,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'

import './Header.css'
import LoginFormDropdown from './LoginFormDropdown'
import UserContext from '../context/UserContext'

export default function Header() {
  const client = useApolloClient()
  const { token, setToken } = useContext(UserContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen((prevState) => !prevState)

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

  return (
    <Navbar id="header">
      <div id="header-left-container">
        <FontAwesomeIcon id="header-main-logo" icon={faBookOpen} />
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
          <>
            <Link className="header-links" to="/newbook">
              New Book
            </Link>
            <Link className="header-links" to="/userinfo">
              UserInfo
            </Link>
          </>
        )}
        {token !== null ? (
          <>
            <Button id="header-logout-wrapper" onClick={() => handleLogout()}>
              <FontAwesomeIcon
                id="header-logout-icon"
                onClick={() => handleLogout()}
                icon={faSignOutAlt}
              />
            </Button>

            <Button id="header-logout-button" onClick={() => handleLogout()}>
              Sign Out
            </Button>
          </>
        ) : (
          <Dropdown inNavbar isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle id="header-login-button" nav>
              Sign In
            </DropdownToggle>
            <DropdownToggle id="header-login-logo-wrapper" nav>
              <FontAwesomeIcon id="header-login-logo" icon={faSignInAlt} />
            </DropdownToggle>
            <DropdownMenu id="header-dropdown-box" right>
              <LoginFormDropdown {...{ setToken }} />
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </Navbar>
  )
}
