import React, { Component } from 'react';
import './App.scss';
import Call from './Call';

class App extends Component {
  render() {
    return (
      <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column">
            <Call playerName="Jjpaal" />
          </div>
          <div className="column">
            <Call playerName="Akhilian" />
          </div>
        </div>
      </div>
      </section>
    );
  }
}

export default App;
