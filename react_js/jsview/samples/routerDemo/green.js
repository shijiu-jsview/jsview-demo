import React from 'react';

class Home extends React.Component {
  render() {
    return (
      <div style={{ left: 10, top: 110, width: 100, height: 100, backgroundColor: "rgba(0, 255, 0, 1.0)" }}></div>
    );
  }

  componentDidMount() {
    console.log("Green did mount");
  }

  componentWillUnmount() {
    console.log("Green will unmount");
  }
}

export default Home;
