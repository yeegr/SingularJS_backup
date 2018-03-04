import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { UAParser } from 'ua-parser-js'

import configureStore from '../redux/store/configureStore'

import Hello from './pages/hello'
import Dashboard from './pages/dashboard'
import Reviews from './pages/reviews'

import './index.html'
import './styles/main.less'
import '../../../assets/logo.png'
import '../../../assets/logo.svg'
import '../../../assets/favicon.ico'

var parser = new UAParser()
console.log(parser.getResult())

const store = configureStore()

render((
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route path='/tasks/reviews' component={Reviews} />
        <Route path='/hello' component={Hello} />
      </Switch>
    </Router>
  </Provider>
), document.querySelector('root'))
