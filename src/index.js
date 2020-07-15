import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.jsx'
import { playGame, collectStar } from './phaser/scene'
import skyImg from './assets/sky.png'

//console.log(App);

var config = {
  parent: 'phaser',
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  // scene: {
  //   preload: preload,
  //   create: create,
  //   update: update,
  // },
  scene: playGame,
}

const game = new Phaser.Game(config)

// function preload() {
//   this.load.image('sky', 'src/assets/sky.png')
//   this.load.image('ground', 'src/assets/platform.png')
//   this.load.image('star', 'src/assets/star.png')
//   this.load.image('bomb', 'src/assets/bomb.png')
//   this.load.spritesheet('dude', 'src/assets/dude.png', {
//     frameWidth: 32,
//     frameHeight: 48,
//   })
// }

// let platforms

// function create() {
//   this.add.image(400, 300, 'sky')

//   platforms = this.physics.add.staticGroup()

//   platforms.create(400, 568, 'ground').setScale(2).refreshBody()

//   platforms.create(600, 400, 'ground')
//   platforms.create(50, 250, 'ground')
//   platforms.create(750, 220, 'ground')
// }

// function update() {}

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
)
