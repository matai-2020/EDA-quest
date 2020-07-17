import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.jsx'

import parallax from './phaser/scenes/ParallaxScene'
import title from './phaser/scenes/TitleScene'

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser',
  width: window.innerWidth,
  height: 800,
  scene: [title, parallax]
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
