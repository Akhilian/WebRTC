import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SIGNALING_SERVER_URL } from './config';

function Start() {

  const [name, setName] = useState('')
  const [isServerOnline, setStatus] = useState(false)

  fetch(`${SIGNALING_SERVER_URL}/status`)
    .then(() => {
      !isServerOnline && setStatus(true)
    })
    .catch(() => {
      isServerOnline && setStatus(false)
    })

  return (
    <section className="section start">
      <div className="box">
        <div className="field">
          <div className="columns">
            <div className="column">
            {
            name !== '' ? (
              <label className="label" htmlFor="name">You are very welcome {name} !</label>
            ) : (<label className="label" htmlFor="name">What is your name ?</label>)
          }

            </div>
            <div className="column has-text-right">{
              isServerOnline 
                && (<span class="tag is-success">Serveur en ligne</span>)
                || (<span class="tag is-warning">Serveur injoignable</span>)
              }
            </div>
          </div>          
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
