import React from 'react';
import testImgPath from '../resources/test.jpg';

class ImgRadius extends React.Component {
    render() {
        return <div id='layout-root' style={this.props.style}>
                <img style={{width: 50, height: 50, backgroundColor: 'rgba(255, 255, 0, 1)',
                    borderRadius: '10px',
                }} alt='' src={testImgPath}/>
                <img style={{left: 60, width: 50, height: 50, backgroundColor: 'rgba(255, 255, 0, 1)',
                    borderRadius: '10px 20px',
                }} alt='' src={testImgPath}/>
                <img style={{left: 120, width: 50, height: 50, backgroundColor: 'rgba(255, 255, 0, 1)',
                    borderRadius: '0 10px 20px 30px',
                }} alt='' src={testImgPath}/>
            </div>
    }
}

export default ImgRadius;
