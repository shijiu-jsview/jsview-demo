import React from 'react';
import CommonApi from "../api/CommonApi"
import DemoApp from "../demoHomepage/DemoApp";
import ActivityApp from "../activityHomepage/ActivityApp";
const TransitPage = ({showMode}) => {
    if (showMode === "0") {
        return (<DemoApp/>)
    } else {
        return (<ActivityApp/>)
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this._FocusControl = null;
        this.state = {
            showMode:CommonApi.getShowMode()
        };
    }

    render() {
        return (
            <div>
                <TransitPage showMode={this.state.showMode}/>
            </div>
        )
    }
}

export default App;