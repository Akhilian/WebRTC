import React, { Component } from 'react';
import './App.scss';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Start from './Start';
import Tabletop from './Tabletop';

class Routes extends Component {
  render() {
    return (
        <Router>
                <Switch>
                    <Route path="/room/:name" component={Tabletop}>
                    </Route>
                    <Route path="/">
                        <Start />
                    </Route>
                </Switch>
        </Router>
    );
  }
}

export default Routes;
