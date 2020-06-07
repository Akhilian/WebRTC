import React, { Component } from "react";

class Streamer extends Component {
    constructor(props) {
        super(props)
        console.log('Created local peer connection object')
        this.pc = new RTCPeerConnection()
        this.pc.onicecandidate = this.handleOnICECandidate;
        this.pc.oniceconnectionstatechange = this.handleICEConnectionStateChange;

        this.props.answerStream.subscribe({
            next: async (answer) => {
                await this.pc.setRemoteDescription(answer);
            }
        })
    }

    handleICEConnectionStateChange = () => {
        console.log(`ICE state : ${this.pc.iceConnectionState}`)
    }

    handleOnICECandidate = ({candidate}) => {
        if(candidate) {
            this.props.signal({ candidate })
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

            const desc = await this.pc.createOffer()
            await this.pc.setLocalDescription(desc);

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