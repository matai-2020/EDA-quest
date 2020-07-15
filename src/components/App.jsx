import React from 'react'

export default class App extends React.Component {
  state = {}
  render () {
    return (
      <div className="logo" style={{ textAlign: 'center' }}>
        {/* <h1>Hello World</h1> */}
        <img src="src/assets/quest-logo.png" alt="Quest Logo" width="200" />
      </div>
    )
  }
}
