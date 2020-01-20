import React from 'react';
import iconImgPath from '../resources/icon.png';
import borderImgPath from '../resources/border.png';
import testImgPath from '../resources/test.jpg';

class ImgBorder extends React.Component {
    render() {
        return <div id='layout-root' style={this.props.style}>
                <img style={{width: 50, height: 50, backgroundColor: 'rgba(255, 255, 0, 1)',
                    borderColor: 'rgba(0, 0, 255, 1)',
                    borderColorWidth: '1px'
                }} alt='' src={testImgPath}/>
                <img style={{top: 60, width: 50, height: 50, backgroundImage: `url(${iconImgPath})`,
                    borderImage: `url(${borderImgPath}) 27 fill`,
                    borderImageWidth: '10px',
                }} alt='' src={testImgPath}/>
                <img style={{top: 60, left: 80, width: 50, height: 50, backgroundImage: `url(${iconImgPath})`,
                    borderImage: `url(${borderImgPath}) 27 fill`,
                    borderImageWidth: '10px',
                    borderImageOutset: "5px 10px 15px 20px",
                }} alt='' src={testImgPath}/>
            </div>
    }
}

export default ImgBorder;
