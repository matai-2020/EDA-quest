import React from 'react'
import { subscribe } from '../phaser/score'

export class HighScore extends React.Component {
  state = {
    score: 0
  }
  componentDidMount () {
    subscribe((score) => {
      this.setState({
        score
      })
    })
  }
  render () {
    return (
      <div>
        Score: {this.state.score}
      </div>
    )
  }
}

export default HighScore
