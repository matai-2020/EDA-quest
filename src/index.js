import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.jsx'
import playGame from './phaser/scene'

import ParallaxScene from './phaser/scenes/ParallaxScene'

// console.log(App);

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser',
  width: 800,
  height: 800,
  scene: ParallaxScene
}

const game = new Phaser.Game(config)

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
)
