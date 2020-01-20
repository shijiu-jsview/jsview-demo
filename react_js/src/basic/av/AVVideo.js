import React from 'react';
import testVideo from './test.mp4';

class AVVideo extends React.Component {
    constructor(props) {
        super(props);

        // 通过此节点来控制video的播放，和html5控制video标签的接口一致
        this.videoNode = React.createRef();
    }

    getMediaElement() {
        return this.videoNode.current;
    }

    render() {
        return (
            <div id='layout-root' style={this.props.style}>
                <video ref={ this.videoNode }
                    style={{ width: 200, height: 100,
                        backgroundColor: 'rgba(255, 255, 0, 0.5)',
                    }}
                    src={ testVideo }
                />
            </div>
        );
    }
}

export default AVVideo;
