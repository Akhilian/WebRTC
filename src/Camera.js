import React, { Component } from 'react';
import { SIGNALING_SERVER_URL } from './config';
import { filter, map } from 'rxjs/operators';
import Receiver from './Visio/Receiver';
import Streamer from './Visio/Streamer';

function sendSignal(to, from, payload) {
    fetch(`${SIGNALING_SERVER_URL}/signaling`, {
        method: 'POST',
        body: JSON.stringify({
          to,
          from,
          ...payload
        }),
        mode: 'cors',
        headers: {
            'content-Type': 'application/json'
        },
    })
}

// function getVideoStream() {
//     return navigator.mediaDevices
//         .getUserMedia({ video: true, audio: false })
// }

class Camera extends Component {

    _sendSignal = (payload) => {
        const interlocutor = this.props.interlocutor;
        const currentUser = this.props.currentUser;
        sendSignal(interlocutor, currentUser, payload)
    }

    constructor(props) {
        super(props)

        // const interlocutor = this.props.interlocutor;
        const currentUser = this.props.currentUser;

        // pc.onicecandidate = ({candidate}) => {
        //     try {
        //         if(candidate) {
        //             const to = interlocutor
        //             const from = currentUser
        //             sendSignal(to, from, {
        //                 candidate
        //             })    
        //         }
        //     } catch(e) {
        //         console.log(e)
        //     }
        // };

        // pc.onconnectionstatechange = (event) => {
        //     console.log(`State : ${pc.connectionState}`)
        // }

        // let isNegociating = false;
        // pc.onnegotiationneeded = async () => {
        //     console.log('onnegotiationneeded')

        //     if(isNegociating) return;
        //     isNegociating = true;

        //     await pc.setLocalDescription(await pc.createOffer());

        //     isNegociating = false;

        //     const to = interlocutor
        //     const from = currentUser

        //     sendSignal(to, from, { desc: pc.localDescription });    
        // };

        // pc.ontrack = (event) => {
        //     console.log(event.streams[0])
        //     console.log(this.video)

        //     if (this.video)
        //         this.video.srcObject = event.streams[0]
        // };

        // this.props.eventStream.pipe(
        //     filter(event => (event.message === 'SOMEONE_OFFERING_ICE_CANDIDATE')),
        //     filter(event => event.desc),
        //     map(e => e.desc),
        //     filter(desc => desc.type === 'offer')
        // ).subscribe({
        //     next: async (desc) => {
        //         console.log(`Offer event between ${this.props.currentUser} and ${this.props.interlocutor}`)

        //         await pc.setRemoteDescription(desc);
        //         await pc.setLocalDescription(await pc.createAnswer())

        //         const to = interlocutor
        //         const from = currentUser
        //         sendSignal(to, from, { desc: pc.localDescription });
        //     }
        // })

        // this.props.eventStream.pipe(
        //     filter(event => (event.message === 'SOMEONE_OFFERING_ICE_CANDIDATE')),
        //     filter(event => event.desc),
        //     map(e => e.desc),
        //     filter(desc => desc.type === 'answer')
        // ).subscribe({
        //     next: async (desc) => {
        //         console.log(`Answer event between ${this.props.currentUser} and ${this.props.interlocutor}`)
        //         await pc.setRemoteDescription(desc);
        //     }
        // })

        this.offerStream = this.props.eventStream.pipe(
          filter(event => (event.message === 'OFFER')),
          map(e => e.offer)
        )

        this.answerStream = this.props.eventStream.pipe(
            filter((event) => (event.message === 'ANSWER')),
            map(e => e.answer)
        )

        this.ICECandidateStream = this.props.eventStream.pipe(
            filter(event => (event.message === 'SOMEONE_OFFERING_ICE_CANDIDATE')),
            filter(event => event.candidate),
            map(e => e.candidate)
        )
    }

    render() {
        console.log('------------- RENDER -------------')
        return (
            <>
                <Receiver 
                    ICECandidateStream={this.ICECandidateStream}
                    offerStream={this.offerStream}
                    signal={this._sendSignal} />
                <Streamer 
                    answerStream={this.answerStream}
                    signal={this._sendSignal} />
            </>
        );
    }
}

export default Camera;
