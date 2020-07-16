import React from 'react'
import { subscribe } from '../phaser/score'
import * as firebase from 'firebase'

export class HighScore extends React.Component {
  state = {
    score: 0,
    name: '',
    highScores: {
      name: 'Loading',
      score: 'Loading'
    }
  }
  componentDidMount () {
    this.getData()
    console.log(this.state.highScores)
    subscribe((score) => {
      this.setState({
        name: 'Isaac',
        score
      })
      this.updateData()
    })
  }

  updateData () {
    const rootRef = firebase.database().ref('game').child(`${this.state.name}s_game`)
    rootRef.set({
      name: this.state.name,
      score: this.state.score
    })
  }

  getData () {
    firebase.database().ref('game/').child('Isaacs_game').once('value').then(function (snapshot) {
      const name = snapshot.val().name
      const playerScore = snapshot.val().score
      let dataObj = { name, playerScore }
      return dataObj
    })
      .then(data => {
        // console.log(data)
        this.setState({
          highScores: {
            name: data.name,
            score: data.playerScore
          }

        })
        // console.log(this.state.highScores.name, this.state.highScores.score)
      })
  }

  render () {
    console.log(this.state.highScores)
    return (
      <div>
        Score: {this.state.score}
        <p>HighScore: {this.state.highScores.score} Set By: {this.state.highScores.name}</p>
      </div>
    )
  }
}

export default HighScore
