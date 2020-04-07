import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Call from './Call';

class App extends Component {
  render() {
    return (
      <section class="section">
      <div className="container">
        <div class="columns">
          <div class="column">
            <Call playerName="Jjpaal" />
          </div>
          <div class="column">
            <Call playerName="Akhilian" />
          </div>
        </div>
      </div>
      </section>
    );
  }
}

export default App;