import React from 'react'
import HighScore from './HighScore.jsx'

export default class App extends React.Component {
  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        <img id="logo" src="/assets/Game/eda-quest-logo.png" alt="Quest Logo" />
        <HighScore />
      </div>
    )
  }
}
