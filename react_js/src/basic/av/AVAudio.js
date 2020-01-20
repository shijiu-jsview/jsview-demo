import React from 'react';
import testAudio from './test.mp3';

class AVAudio extends React.Component {
    constructor(props) {
        super(props);

        // 通过此节点来控制audio的播放，和html5控制audio标签的接口一致
        this.audioNode = React.createRef();
    }

    getMediaElement() {
        return this.audioNode.current;
    }

    render() {
        return (
            <div id='layout-root' style={this.props.style}>
                <audio ref={ this.audioNode }
                    src={ testAudio }
                />
            </div>
        );
    }
}

export default AVAudio;
