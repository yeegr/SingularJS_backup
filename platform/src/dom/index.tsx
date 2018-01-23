import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import {UAParser} from 'ua-parser-js'

import configureStore from '../redux/store/configureStore'

import Hello from './components/hello'
import TabTest from './components/tabtest'

import './index.html'
import './styles/main.less'
import '../../../assets/favicon.ico'

var parser = new UAParser()
console.log(parser.getResult())

const store = configureStore()

render((
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path='/' exact component={Hello} />
        <Route path='/tab' component={TabTest} />
      </Switch>
    </Router>
  </Provider>
), document.querySelector('root'))
