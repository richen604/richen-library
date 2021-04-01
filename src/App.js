import React from 'react'
import Header from './components/Header'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import UserInfo from './components/UserInfo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HomePage from './components/HomePage'

const App = () => {
  return (
    <Router>
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
  )
}

export default App
