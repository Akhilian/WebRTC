import React, { Component } from 'react';

class Eve extends Component {

    constructor(props) {
      super(props)
      this.state = { remoteUser: this.props.offerEvent.from  }
    }
  
    async componentDidMount() {

      const peerConnection = new RTCPeerConnection()
      await peerConnection
        .setRemoteDescription(this.props.offerEvent.offer)
  
      peerConnection.createAnswer().then((answer) => {
        peerConnection.setLocalDescription(answer)
  
        fetch('http://localhost:5000/signaling', {
          method: 'POST',
          body: JSON.stringify({
            from: this.props.uuid,
            to: this.state.remoteUser,
            answer
          }),
          mode: 'cors',
          headers: {
            'content-Type': 'application/json'
          },
        })
  
      }).catch(console.error)
    }
  
    render() {
        return (
            <div>
                Connecting <b>{this.props.uuid}</b> (you) with <b>{this.state.remoteUser}</b> (remote)
            </div>
        );
    }
  }


  export default Eve;