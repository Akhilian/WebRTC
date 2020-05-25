import React, { Component } from 'react';

function sendSignal({ from, to, offer, answer, candidate }) {
    fetch('http://localhost:5000/signaling', {
        method: 'POST',
        body: JSON.stringify({
            from,
            to,
            offer,
            answer,
            candidate
        }),
        mode: 'cors',
        headers: {
            'content-Type': 'application/json'
        },
    })    
}

class MasterCamera extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: props.userId
        }
    }

    componentDidMount() {
        console.log('MasterCamera - componentDidMount')
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                this.video.srcObject = stream;
            })

        const peerConnection = new RTCPeerConnection()
        peerConnection.onicecandidate = (candidate) => {
            console.log('onicecandidate', candidate)
            sendSignal({
                candidate
            })
        }

        peerConnection.ontrack = (event) => {
            console.warn('On track', event)
        }

        peerConnection.createOffer().then(offer => {
            this.setState({ connectionDetails: JSON.stringify(offer) })

            console.log('MasterCamera - signaling')
            sendSignal({
                from: this.state.userId,
                offer
            })

            return peerConnection.setLocalDescription(offer)
        }).catch(console.error)
        this.setState({ peerConnection: peerConnection })
    }

    handleChange = (event) => {
        this.setState({remoteConnection: JSON.parse(event.target.value)});  
    }

    render() {
        if(this.state.peerConnection) {
            if(this.props.answerEvent) {
                console.log('Ready to answer')
                this.state.peerConnection.setRemoteDescription(this.props.answerEvent.answer)
            }
        }

        return (
            <div>
                <video className="mc-main" ref={video => {this.video = video}} autoPlay={true}></video>
                <h1>{this.state.userId}</h1>
            </div>
        );
    }
}

export default MasterCamera;
