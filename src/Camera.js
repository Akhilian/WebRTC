import React, { Component } from 'react';

class Camera extends Component {
    componentDidMount() {
        if(this.props.stream)
            this.video.srcObject = this.props.stream
    }
    render() {
        return (
            <div className="box is-paddingless">
                <video className="mc-main" ref={video => {this.video = video}} autoPlay={true}></video>
            </div>
        );
    }
}

export default Camera;
