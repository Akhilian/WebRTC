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

            stream.getTracks()
                .forEach(track => this.pc.addTrack(track, stream));

            const desc = await this.pc.createOffer()
            await this.pc.setLocalDescription(desc);

            this.props.signal({ desc })

        } catch(error) {
            console.error(error)
        }
    }

    render() {
        return (<></>)
    }
}

export default Streamer