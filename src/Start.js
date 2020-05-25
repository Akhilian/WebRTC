import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Start extends Component {
  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column box">
              <Link to="/room">Rejoindre la partie</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Start;
