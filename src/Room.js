import React, { Component } from 'react';
import Call from './Call';

class Room extends Component {
  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <Call playerName="Jjpaal" />
            </div>
            <div className="column">
              <Call playerName="Jjpaal" />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Room;
