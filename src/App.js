import React, { useMemo, useState } from 'react'
import Header from './components/Header'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import UserInfo from './components/UserInfo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HomePage from './components/HomePage'
import './App.css'
import UserContext from './context/UserContext'
import SelectedContext from './context/SelectedContext'

const App = () => {
  const [token, setToken] = useState(false)
  const [selected, setSelected] = useState({ value: 'all', label: 'all' })
  const tokenValue = useMemo(() => ({ token, setToken }), [token, setToken])
  const selectedValue = useMemo(() => ({ selected, setSelected }), [
    selected,
    setSelected,
  ])
  return (
    <UserContext.Provider value={tokenValue}>
      <SelectedContext.Provider value={selectedValue}>
        <Router>
          <div id="background-triangle-1-wrapper">
            <div id="background-triangle-1" />
          </div>
          <div id="background-triangle-2-wrapper">
            <div id="background-triangle-2" />
          </div>
          <Header />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/authors" component={Authors} />
            <Route path="/books" component={Books} />
            <Route path="/userinfo" component={UserInfo} />
            <Route path="/newbook" component={NewBook} />
          </Switch>
        </Router>
      </SelectedContext.Provider>
    </UserContext.Provider>
  )
}

export default App
