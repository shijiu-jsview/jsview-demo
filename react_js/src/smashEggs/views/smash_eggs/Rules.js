import React from 'react';
class Rules extends React.Component {
    render() {
        if (!this.props.info) {
            return null;
        }
        let app_desc = this.props.info.app_desc;
        return (
            <div style={this.props.theme.style}>
                {app_desc}
            </div>
        )
    }
}

export default Rules;
