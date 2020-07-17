import React from 'react'
import { subscribe } from '../phaser/score'
import * as firebase from 'firebase'

export class HighScore extends React.Component {
  state = {
    score: 0,
    name: '',
    highScores: []
  }
  componentDidMount () {
    this.updateData()
    this.getHighScores()
    subscribe((score) => {
      this.setState({
        score
      })
    })
  }

  updateData () {
    const queryData = firebase.database().ref('currentPlayer')
    queryData.set({
      name: this.state.name,
      score: this.state.score
    })
  }

  getHighScores () {
    firebase.database().ref('highScores/').once('value').then(function (snapshot) {
      const scoreHistory = snapshot.val()
      scoreHistory.sort((a, b) => (b.score - a.score))
      return scoreHistory
    })
      .then(scoreData => {
        this.setState({
          highScores: scoreData
        })
      })
  }

  clickHandler () {
    let childName = this.state.highScores.length
    const queryData = firebase.database().ref('highScores/').child(childName)
    if (this.state.name.length > 0) {
      queryData.set({
        name: this.state.name,
        score: this.state.score
      })
      this.updateData()
      this.getHighScores()
    } else alert('Please enter your Name before submitting your Score!')
  }

  nameChange = (e) => {
    const { value } = e.target
    this.setState({
      name: value
    })
  }

  render () {
    return (
      <div>
        <ul>
          {this.state.highScores.map(player => {
            let indexKey = this.state.highScores.indexOf(player)
            return (
              <li key={indexKey}>{player.name}: {player.score}</li>
            )
          })}
        </ul>
        <input onChange={this.nameChange}></input>
        <button onClick={() => this.clickHandler()}>Submit Score</button>
      </div>
    )
  }
}

export default HighScore
