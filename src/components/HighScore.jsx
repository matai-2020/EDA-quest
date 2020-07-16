import React from 'react'
import { subscribe } from '../phaser/score'
import * as firebase from 'firebase'

export class HighScore extends React.Component {
  state = {
    score: 0
  }
  componentDidMount () {
    subscribe((score) => {
      this.setState({
        score
      })
      this.updateData()
    })
  }

  updateData () {
    const rootRef = firebase.database().ref('newsection/').child('game1')
    rootRef.set({
      name: 'Isaac',
      score: this.state.score
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
