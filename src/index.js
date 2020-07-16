import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.jsx'
import { playGame } from './phaser/scene'

let config = {
  parent: 'phaser',
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: playGame
}

window.onscroll = function () { scrollFunction() }

function scrollFunction () {
  if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
    document.getElementById('logo').style.width = '200px'
    document.getElementById('logo').style.marginBottom = '10px'

  } else {
    document.getElementById('logo').style.width = '800px'
    document.getElementById('logo').style.marginBottom = '200px'
  }
}

const game = new Phaser.Game(config)

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
)
