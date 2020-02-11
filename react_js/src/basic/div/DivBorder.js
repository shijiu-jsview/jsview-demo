import React from 'react';
import iconImgPath from '../resources/icon.png';
import borderImgPath from '../resources/border.png';

class DivBorder extends React.Component {
    render() {
        return <div id='layout-root' style={this.props.style}>
                <div style={{width: 50, height: 50, backgroundColor: 'rgba(255, 255, 0, 1)',
                    borderColor: 'rgba(0, 0, 255, 1)',
                    borderColorWidth: '1px'
                }}>BorderColor网页无效?</div>

                <div style={{left: 70, width:60, height: 60, backgroundImage: `url(${iconImgPath})`,
                    borderImage: `url(${borderImgPath}) 27 fill`,
                    borderImageWidth: '27px',
                    borderImageOutset: "5px 10px",
                }}>
                    <div style={{width: 30, height: 30, backgroundColor: 'rgba(255, 255, 0, 1)'}}>SubDiv</div>
                </div>
                <div style={{top: 60, width: 60, height: 60, backgroundImage: `url(${iconImgPath})`,
                    borderImage: `url(${borderImgPath}) 27 fill`,
                    borderImageWidth: '27px',
                }}>Border Image</div>
                <div style={{top: 60, left: 90, width: 50, height: 50, backgroundImage: `url(${iconImgPath})`,
                    borderImage: `url(${borderImgPath}) 27 fill`,
                    borderImageWidth: '27px',
                    borderImageOutset: "5px 10px 15px 20px",
                }}>BM Outset</div>
            </div>
    }
}

export default DivBorder;
