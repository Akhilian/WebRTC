import React, { Component } from 'react';
import './App.scss';

class Call extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                this.video.srcObject = stream;
            })

        const peerConnection = new RTCPeerConnection()
        peerConnection.createOffer().then(offer => {
            this.setState({ connectionDetails: JSON.stringify(offer) })

            fetch('http://localhost:5000/join', {
                    method: 'POST',
                    body: JSON.stringify(offer),
                    mode: 'cors',
                    headers: {
                        'content-Type': 'application/json'
                    },
                })    

            return peerConnection.setLocalDescription(offer)
        }).catch(console.error)
    }

    handleChange = (event) => {
        this.setState({remoteConnection: JSON.parse(event.target.value)});  
    }

    render() {
        const { playerName } = this.props


        return (
            <div className="card">
                <div className="card-image">
                    <video ref={video => {this.video = video}} autoPlay={true}></video>
                </div>
                <div className="card-content">
                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-48x48">
                                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder"/>
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="title is-4">{playerName}</p>
                            <p className="subtitle is-6">@johnsmith</p>
                        </div>
                    </div>

                    <div className="content">
                        <label htmlFor="details">Détails : </label>
                        <textarea id="details" className="textarea" value={ this.state.connectionDetails }></textarea>
                    </div>

                    <div className="content">
                        <label htmlFor="details">Remote connection : </label>
                        <textarea id="details" className="textarea" onChange={this.handleChange}></textarea>
                    </div>
                </div>
            </div>
        );
    }
}

export default Call;
