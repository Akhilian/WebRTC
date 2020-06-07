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

class Camera extends Component {

    _sendSignal = (payload) => {
        const interlocutor = this.props.interlocutor;
        const currentUser = this.props.currentUser;
        sendSignal(interlocutor, currentUser, payload)
    }

    constructor(props) {
        super(props)

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
