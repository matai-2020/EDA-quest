// Libraries
import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'
import * as firebase from 'firebase'

// React Component
import App from './components/App.jsx'

// Phaser Scenes
import title from './phaser/scenes/TitleScene'
import tutLevel from './phaser/scenes/TutLevel'
import jumpLevel from './phaser/scenes/JumpLevel'
import dusk from './phaser/scenes/DuskScene'
import city from './phaser/scenes/CityScene'
import parallax from './phaser/scenes/ParallaxScene'

import questionOne from './phaser/scenes/textScenes/questionOne.js'
import questionTwo from './phaser/scenes/textScenes/questionTwo.js'
import questionThree from './phaser/scenes/textScenes/questionThree.js'
import questionFour from './phaser/scenes/textScenes/questionFour.js'

var firebaseConfig = {
  apiKey: 'AIzaSyD5DEUiq_fXMfIJpiPH4HUvbXbPGPDP2-0',
  authDomain: 'eda-quest.firebaseapp.com',
  databaseURL: 'https://eda-quest.firebaseio.com',
  projectId: 'eda-quest',
  storageBucket: 'eda-quest.appspot.com',
  messagingSenderId: '574152578233',
  appId: '1:574152578233:web:c375548e8908c8aaf93768',
  measurementId: 'G-XS0WPPZRYR'
}

firebase.initializeApp(firebaseConfig)

const config = {
  parent: 'phaser',
  type: Phaser.AUTO,
  width: window.innerWidth - 100,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 420 },
      debug: false
    }
  },
  // scene: [title, questionOne, tutLevel, jumpLevel, parallax, dusk, city, questionTwo, questionThree, questionFour]
  scene: [dusk]
}
/*eslint-disable */
const game = new Phaser.Game(config)
/* eslint-enable */

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
)
