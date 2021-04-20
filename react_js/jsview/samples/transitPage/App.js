import React from 'react';
import CommonApi from "../api/CommonApi";
import DemoApp from "../demoHomepage/DemoApp";
import { jJsvRuntimeBridge } from "../../utils/JsViewReactTools/JsvRuntimeBridge";
import ActivityApp from "../activityHomepage/ActivityApp";

const TransitPage = ({ showMode }) => {
  if (showMode === "0") {
    return (<DemoApp/>);
  }
  return (<ActivityApp/>);
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this._FocusControl = null;

    let show_mode = CommonApi.getShowMode();
    // showMode信息可被URL中的?后缀信息替换
    if (window.location.search.indexOf("showMode=0") >= 0) {
      show_mode = "0";
    } else if (window.location.search.indexOf("showMode=1") >= 0) {
      show_mode = "1";
    }

    this.state = {
      showMode: show_mode
    };
  }

  render() {
    return (
            <div>
                <TransitPage showMode={this.state.showMode}/>
            </div>
    );
  }

  componentDidMount() {
    jJsvRuntimeBridge.notifyPageLoaded();
  }
}

export default App;
