import React, { Component } from "react";

class Receiver extends Component {
    constructor(props) {
        super(props)
        this.seed = Math.floor(Math.random() * 100)
        console.log(this.seed, 'Created local peer connection object')
        this.pc = new RTCPeerConnection()
        this.pc.onicecandidate = this.handleOnICECandidate
        this.pc.ontrack = this.handleOnTrack
        this.pc.oniceconnectionstatechange = this.handleICEConnectionStateChange;

        this.props.ICECandidateStream.subscribe({
            next: async (candidate) => {
                await this.pc.addIceCandidate(candidate)
            }
        })

        this.props.offerStream.subscribe({
            next: async (offer) => {
                await this.pc.setRemoteDescription(offer)

                const answer = await this.pc.createAnswer();

                await this.pc.setLocalDescription(answer)

                this.props.signal({ desc: answer })
            }
        })
    }

    handleICEConnectionStateChange = () => {
        console.log(`ICE state : ${this.pc.iceConnectionState}`)
    }

    handleOnTrack = (e) => {
        if(this.video) {
            if(this.video.srcObject !== e.streams[0]) {
                this.video.srcObject = e.streams[0];
            }
        }
    }

    handleOnICECandidate = async ({candidate}) => {
        try {
            await this.pc.addIceCandidate(candidate)
        } catch(e) {
            console.error('FAILED', candidate)
        }
        
    }

    render() {
        return (<video 
            ref={video => {this.video = video}}
            playsInline
            autoPlay
            className="box is-paddingless has-background-grey-dark"
        ></video>)
    }
}

export default Receiver