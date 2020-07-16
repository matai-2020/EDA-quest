import React from 'react'
import HighScore from './HighScore.jsx'

export default class App extends React.Component {
  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Hello World</h1>
        <HighScore />
      </div>
    )
  }
}
