import React, { Component } from 'react';
import './App.scss';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';
import Room from './Room';


class Routes extends Component {
  render() {
    return (
        <Router>
            <Switch>
                <Route path="/call">
                    <Room />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
  }
}

export default Routes;
