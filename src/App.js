import React, { useMemo, useState } from 'react'
import Header from './components/Header'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import UserInfo from './components/UserInfo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HomePage from './components/HomePage'
import './App.css'
import UserContext from './context/UserContext'

const App = () => {
  const [token, setToken] = useState(false)
  const providerValue = useMemo(() => ({ token, setToken }), [token, setToken])
  return (
    <UserContext.Provider value={providerValue}>
      <Router>
        <div id="background-triangle-1" />
        <div id="background-triangle-2" />
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/authors" component={Authors} />
          <Route path="/books" component={Books} />
          <Route path="/userinfo" component={UserInfo} />
          <Route path="/newbook" component={NewBook} />
          <Route path="/login" component={LoginForm} />
        </Switch>
      </Router>
    </UserContext.Provider>
  )
}

export default App
