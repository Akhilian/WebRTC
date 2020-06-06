import React, { Component } from "react";

class Receiver extends Component {
    constructor(props) {
        super(props)
        console.log('Created local peer connection object')
        this.pc = new RTCPeerConnection()
        this.pc.onicecandidate = this.handleOnICECandidate
        this.pc.ontrack = this.handleOnTrack
        this.pc.oniceconnectionstatechange = this.handleICEConnectionStateChange;

        this.props.ICECandidateStream.subscribe({
            next: async (candidate) => {
                console.log('addIceCandidate start')
                // await this.pc.addIceCandidate(candidate)
                console.log('addIceCandidate complete')
            }
        })

        this.props.offerStream.subscribe({
            next: async (offer) => {
                console.log('setRemoteDescription start')
                await this.pc.setRemoteDescription(offer)
                console.log('setRemoteDescription complete')

                console.log('Create answer start')
                const answer = await this.pc.createAnswer();
                console.log('Create answer complete')

                console.log('setLocalDescription complete')
                await this.pc.setLocalDescription(answer)
                console.log('setLocalDescription complete')

                console.log('Receiver send his answer')
                console.log({ answer })
                this.props.signal({ desc: answer })
            }
        })
    }

    handleICEConnectionStateChange = () => {
        console.log(`ICE state : ${this.pc.iceConnectionState}`)
    }

    handleOnTrack(e) {
        if(this.video) {
            if(this.video.srcObject !== e.streams[0]) {
                this.video.srcObject = e.streams[0];
                console.log('received remote stream')
            }
        }
    }

    handleOnICECandidate = async (candidate) => {
        try {
            await this.pc.addIceCandidate(candidate)
        } catch(e) {
            console.warn(e)
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