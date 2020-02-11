import React from 'react';
import iconImgPath from '../resources/icon.png';

class ImgLayout extends React.Component {
    render() {
        return <div id='layout-root' style={this.props.style}>
                <img style={{width: 50, height: 50, backgroundColor: 'rgba(255, 255, 0, 1)'}} alt=''/>
                <img style={{top: 60, width: 50, height: 50, backgroundImage: `url(${iconImgPath})`}} alt=''/>
            </div>
    }
}

export default ImgLayout;
