import React from 'react'
import { subscribe } from '../phaser/score'
import * as firebase from 'firebase'

export class HighScore extends React.Component {
  state = {
    score: 0,
    name: '',
    highScores: [],
    isAlive: true,
    wonGame: false,
    level: 'Jungle',
    currentSceneScore: 0
  }

  componentDidMount () {
    this.updateData()
    this.getHighScores()
    // Update Score
    subscribe(score => {
      this.setState({
        score
      })
      // Check if Player is alive and if game has been won
      subscribe(gameStatus => {
        const { isAlive, wonGame, currentSceneScore, level } = gameStatus
        this.setState({
          isAlive,
          wonGame,
          currentSceneScore,
          level
        })
      })
    })
  }

  // Get Data for current player from Firebase

  updateData () {
    const queryData = firebase.database().ref('currentPlayer')
    queryData.set({
      name: this.state.name,
      score: this.state.currentSceneScore
    })
  }

  // Get Highscores and sort based on total.

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

  // Score submission

  clickHandler () {
    const childName = this.state.highScores.length
    const queryData = firebase.database().ref('highScores/').child(childName)
    if (this.state.name.length > 0) {
      queryData.set({
        name: this.state.name,
        score: this.state.currentSceneScore
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
    if (this.state.isAlive === false && this.state.wonGame === false) {
      return (
        <div className="score-container reveal">
          <img
            className="game-over"
            src="/assets/Game/game-over.png"
            alt="Quest Logo"
          />
          <p>Final Score: {this.state.currentSceneScore}</p>
          <input
            type="text"
            placeholder="Your Name"
            className="name-input"
            onChange={this.nameChange}></input>
          <button className={`${this.state.level}-submit`} onClick={() => this.clickHandler()}>
            Submit Score
          </button>

          <ol className="score-list">
            {this.state.highScores.map(player => {
              const indexKey = this.state.highScores.indexOf(player)
              if (indexKey < 10) {
                return (
                  <li className={`${this.state.level}rank`} key={indexKey}>
                    {player.name}: {player.score}
                  </li>
                )
              }
            })}
          </ol>
          <img src={`/assets/${this.state.level}/${this.state.level}Highscore.png`} className='hs-background'/>
        </div>
      )
    } else if (this.state.wonGame === true) {
      return (
        <div className="score-container reveal">
          <img
            className="game-over"
            src="/assets/Game/victory-crest.png"
            alt="Quest Logo"
          />
          <p>You Win!</p>
          <input
            type="text"
            placeholder="Your Name"
            className="name-input"
            onChange={this.nameChange}></input>
          <button className="submit-button" onClick={() => this.clickHandler()}>
            Submit Score
          </button>
          <p>Final Score: {this.state.currentSceneScore}</p>
          <ol className="score-list">
            {this.state.highScores.map(player => {
              const indexKey = this.state.highScores.indexOf(player)
              if (indexKey < 10) {
                return (
                  <li className='Cityrank' key={indexKey}>
                    {player.name}: {player.score}
                  </li>
                )
              }
            })}
          </ol>
          <img src={'/assets/Theatre/victoryBg.png'} className='hs-background'/>
        </div>
      )
    } else return <></>
  }
}

export default HighScore
