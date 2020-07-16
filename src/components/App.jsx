import React from 'react'
import HighScore from './HighScore.jsx'

export default class App extends React.Component {
  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1 id='submit-test' onClick={this.submitName}>Hello World</h1>
        <HighScore />
      </div>
    )
  }
}
