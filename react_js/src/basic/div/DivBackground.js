import React from 'react';
import iconImgPath from '../resources/icon.png';
import { TitleFont as baseFont} from '../CommonFontStyle'

class DivLayout extends React.Component {
    render() {
        return <div id='layout-root' style={this.props.style}>
                <div style={{...baseFont, width: 180, height: 50, backgroundColor: 'rgba(255, 255, 0, 1)'}}>style.backgroundColor</div>
                <div style={{...baseFont, top: 60, width: 180, height: 50, backgroundImage: `url(${iconImgPath})`}}>style.backgroundImage</div>
            </div>
    }
}

export default DivLayout;
