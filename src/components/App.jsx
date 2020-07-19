import React from 'react'
import HighScore from './HighScore.jsx'
import Victory from './Victory.jsx'

export default class App extends React.Component {
  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <h1>Hello World</h1> */}
        {/* <img id="logo" src="/assets/Game/eda-quest-logo.png" alt="Quest Logo" /> */}
        <HighScore />
        <Victory />
      </div>
    )
  }
}
