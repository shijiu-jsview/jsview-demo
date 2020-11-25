import React from 'react';

class Users extends React.Component {
  render() {
    return (
      <div style={{ left: 10, top: 10, width: 100, height: 100, backgroundColor: "rgba(255, 0, 0, 1.0)" }}></div>
    );
  }

  componentDidMount() {
    console.log("Red did mount");
  }

  componentWillUnmount() {
    console.log("Red will unmount");
  }
}

export default Users;
