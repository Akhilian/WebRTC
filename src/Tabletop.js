import React, { Component } from 'react';
import Camera from './Camera';
import { SIGNALING_SERVER_URL } from './config';

function sendSignal(userId, payload) {
  fetch(`${SIGNALING_SERVER_URL}/signaling`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        payload
      }),
      mode: 'cors',
      headers: {
          'content-Type': 'application/json'
      },
  })    
}

class Tabletop extends Component {

  constructor(props, query) {
    const { match } = props
    const { params } = match

    super(props)
    this.state = {
      userId: params.name,
      events: [],
      streams: []
    }
  }

  componentDidMount() {
    const pc = new RTCPeerConnection()
    pc.onicecandidate = ({candidate}) => {
      sendSignal(this.state.userId, {
        candidate
      })
    };

    pc.onnegotiationneeded = async () => {
      await pc.setLocalDescription(await pc.createOffer());
      sendSignal(this.state.userId, {desc: pc.localDescription});
    };

    pc.ontrack = (event) => {
      const streams = this.state.streams;
      streams.push(event.streams[0]);
      
      this.setState({ streams })
    };

    const events = new EventSource(`${SIGNALING_SERVER_URL}/stream?uuid=${this.state.userId}`);

    events.onmessage = async (event) => {
      const message = JSON.parse(event.data)
      console.log(message)
      
      if (message.userId !== this.state.userId) {
        try {
          const { desc, candidate } = message.payload;

          if(desc) {
            if(desc.type === 'offer') {
              await pc.setRemoteDescription(desc);
              await pc.setLocalDescription(await pc.createAnswer())
              sendSignal(this.state.userId, {desc: pc.localDescription});
            } else if (desc.type === 'answer') {
              await pc.setRemoteDescription(desc);
            }
    
          } else if (candidate) {
            await pc.addIceCandidate(candidate);
          }
        } catch(err) {
          console.error(err)
        }
      }
    };


    navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(stream => {
        this.setState({ localStream: stream })

        stream.getTracks()
          .forEach((track) => {
            pc.addTrack(track, stream)
          });
    })
  }

  render() {
    const streamsVideos = []

    if(this.state.localStream) {
      streamsVideos.push(
        (<div className="column is-one-third">
          <Camera stream={this.state.localStream} />
        </div>)
      )
  
    }

    for(let index in this.state.streams) {
      streamsVideos.push(
        (<div className="column is-half" key={index}>
          <Camera stream={this.state.streams[index]} />
        </div>)
      )
    }

    return (
      <section className="hero is-fullheight">
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

