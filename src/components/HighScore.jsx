import React from 'react'
import { subscribe } from '../phaser/score'
import * as firebase from 'firebase'

export class HighScore extends React.Component {
  state = {
    score: 0,
    name: '',
    highScores: [],
    isAlive: true,
    level: 'Jungle'
  }

  componentDidMount () {
    this.updateData()
    this.getHighScores()
    subscribe(score => {
      this.setState({
        score
      })
      subscribe(isAlive => {
        this.setState({
          isAlive
        })
      })
      console.log(this.state)
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
    firebase
      .database()
      .ref('highScores/')
      .once('value')
      .then(function (snapshot) {
        const scoreHistory = snapshot.val()
        scoreHistory.sort((a, b) => b.score - a.score)
        return scoreHistory
      })
      .then(scoreData => {
        this.setState({
          highScores: scoreData
        })
      })
  }

  clickHandler () {
    const childName = this.state.highScores.length
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

  nameChange = e => {
    const { value } = e.target
    this.setState({
      name: value
    })
  }

  render () {
    if (this.state.isAlive === false) {
      return (
        <div className="score-container reveal">
          <img
            className="game-over"
            src="/assets/Game/game-over.png"
            alt="Quest Logo"
          />
          <input
            type="text"
            placeholder="Your Name"
            className="name-input"
            onChange={this.nameChange}></input>
          <button className="submit-button" onClick={() => this.clickHandler()}>
            Submit Score
          </button>
          <p>Final Score: {this.state.score}</p>
          <ol className="score-list">
            {this.state.highScores.map(player => {
              const indexKey = this.state.highScores.indexOf(player)
              if (indexKey < 10) {
                return (
                  <li className="rank" key={indexKey}>
                    {player.name}: {player.score}
                  </li>
                )
              }
            })}
          </ol>
          <img src={`/assets/${this.state.level}/${this.state.level}Highscore.png`} className='jungle-background'/>
        </div>
      )
    } else return <></>
  }
}

export default HighScore
