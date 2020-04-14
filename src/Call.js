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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                        <a href="#">#css</a> <a href="#">#responsive</a>
                        <br/>
                        <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                    </div>
                </div>
            </div>
        );
    }
}

export default Call;
