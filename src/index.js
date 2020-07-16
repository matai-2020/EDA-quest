import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.jsx'
import title from './phaser/scenes/title'
import levelOne from './phaser/scenes/levelOne'

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
  scene: [ title, levelOne ]
}

const game = new Phaser.Game(config)

// Game Logo disappears on scroll

window.onscroll = function () { scrollFunction() }
function scrollFunction () {
  if (document.body.scrollTop >= 1 || document.documentElement.scrollTop >= 1) {
    document.getElementById('logo').style.width = '10px'
    document.getElementById('logo').style.visibility = 'hidden'
  } else {
    document.getElementById('logo').style.visibility = 'visible'
    document.getElementById('logo').style.width = '900px'
    document.getElementById('logo').style.marginTop = '150px'
    document.getElementById('logo').style.marginBottom = '230px'
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
)
