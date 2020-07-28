import React from 'react';
import CommonApi from "../api/CommonApi"
import DemoApp from "../demoHomepage/DemoApp";
import {jJsvRuntimeBridge} from "../demoCommon/JsvRuntimeBridge"
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

    componentDidMount() {
        jJsvRuntimeBridge.notifyPageLoaded();
    }
}

export default App;