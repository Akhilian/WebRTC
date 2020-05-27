import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Start() {

  const [name, setName] = useState('')

  return (
    <section className="section start">
      <div className="box">
        <div className="field">
          {
            name != '' ? (
              <label className="label" htmlFor="name">You are very welcome {name} !</label>
            ) : (<label className="label" htmlFor="name">What is your name ?</label>)
          }
          
          <div className="control">
            <input className="input" id="name" type="text" placeholder="ie. James" onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <Link to={`/room/${name}`}>
              <button className="button is-link">Submit</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Start;
