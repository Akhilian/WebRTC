import React, { Component } from "react";

class Streamer extends Component {
    constructor(props) {
        super(props)
        console.log('Created local peer connection object')
        this.pc = new RTCPeerConnection()
        this.pc.onicecandidate = (event) => this.handleOnICECandidate(event)
        this.pc.oniceconnectionstatechange = this.handleICEConnectionStateChange;

        this.props.answerStream.subscribe({
            next: async (answer) => {
                console.log('setRemoteDescription start')
                await this.pc.setRemoteDescription(answer);
            }
        })
    }

    handleICEConnectionStateChange = () => {
        console.log(`ICE state : ${this.pc.iceConnectionState}`)
    }

    handleOnICECandidate({ candidate }) {
        console.log('handleOnICECandidate')
        if(candidate) {
            // this.props.signal({ candidate })
        }
    }

    async componentDidMount() {
        console.log('componentDidMount')
        try {
            const stream = await navigator.mediaDevices
                .getUserMedia({ video: true, audio: false });
            this.video.srcObject = stream;

            stream.getTracks()
                .forEach(track => this.pc.addTrack(track, stream));
            console.log('Added local stream to Streamer')

            console.log('Create offer start')
            const desc = await this.pc.createOffer()
            console.log('Create offer end')

            console.log('setLocalDescription start')
            await this.pc.setLocalDescription(desc);
            console.log('setLocalDescription complete')

            console.log('Streamer send his offer')
            this.props.signal({ desc })

        } catch(error) {
            console.error(error)
        }
    }

    render() {
        return (
            <video
                ref={video => {this.video = video}}
                playsInline
                autoPlay
                muted
                className="box is-paddingless has-background-grey-dark"
                >
            </video>
        )
    }
}

export default Streamer