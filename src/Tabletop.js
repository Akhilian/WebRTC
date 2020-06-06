import React, { Component } from 'react';
import Camera from './Camera';
import { SIGNALING_SERVER_URL } from './config';
import { Subject } from "rxjs";
import { map, filter } from "rxjs/operators";


class Tabletop extends Component {
  constructor(props, query) {
    super(props)
    const { match } = props
    const { params } = match
    this.state = {
      connectedUsers: [],
      userId: params.name,
      streams: []
    }
  }
  
  componentDidMount() {
    this.events = new EventSource(`${SIGNALING_SERVER_URL}/stream?uuid=${this.state.userId}`);

    this.entireStream = new Subject()
    this.events.onmessage = async (event) => {
      const extracted = JSON.parse(event.data);
      console.debug(extracted)
      this.entireStream.next(extracted)
    }
    
    this.entireStream.pipe(
      filter(v => v.message === 'UPDATED_LIST_OF_USER'),
      map(v => v.listOfClients)
    ).subscribe({
      next: (users) => {
        this.setState({ connectedUsers: users })
      }
    })
  }

  render() {
    const streamsVideos = []
    for(let index in this.state.connectedUsers) {
      const currentUser = this.state.userId;
      const interlocutor = this.state.connectedUsers[index];
      const isConnectedUser = (this.state.connectedUsers[index] === this.state.userId);

      if(!isConnectedUser) {
        streamsVideos.push(
          (<div className="column is-half" key={index}>
            <Camera 
              currentUser={currentUser}
              interlocutor={interlocutor}
              isConnectedUser={isConnectedUser}
              eventStream={this.entireStream}
            />
          </div>)
        )
      }
    }

    console.log('RENDER')

    return (
      <section className="hero is-fullheight has-background-light">
        <section className="section tabletop">
          <div className="columns is-multiline">
            {streamsVideos}
          </div>
        </section>
      </section>
    );
  }
}

export default Tabletop;

