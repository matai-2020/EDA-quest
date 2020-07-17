import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.jsx'

import parallax from './phaser/scenes/ParallaxScene'
import title from './phaser/scenes/TitleScene'
import { playGame } from './phaser/scene'
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: 'AIzaSyD5DEUiq_fXMfIJpiPH4HUvbXbPGPDP2-0',
  authDomain: 'eda-quest.firebaseapp.com',
  databaseURL: 'https://eda-quest.firebaseio.com',
  projectId: 'eda-quest',
  storageBucket: 'eda-quest.appspot.com',
  messagingSenderId: '574152578233',
  appId: '1:574152578233:web:c375548e8908c8aaf93768',
  measurementId: 'G-XS0WPPZRYR',
}

firebase.initializeApp(firebaseConfig)

let config = {
  parent: 'phaser',
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [title, parallax],
}

const game = new Phaser.Game(config)

// Game Logo disappears on scroll

window.onscroll = function () {
  scrollFunction()
}
function scrollFunction() {
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

// const game = new Phaser.Game(config)

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
)
