import React from 'react'
import HighScore from './HighScore.jsx'

window.onscroll = function () {
  scrollFunction()
}

function scrollFunction () {
  if (document.body.scrollTop >= 1 || document.documentElement.scrollTop >= 1) {
    document.getElementById('logo').style.width = '10px'
    document.getElementById('logo').style.visibility = 'hidden'
    document.getElementById('arrow').style.width = '10px'
    document.getElementById('arrow').style.visibility = 'hidden'
  } else {
    document.getElementById('logo').style.visibility = 'visible'
    document.getElementById('logo').style.width = '900px'
    document.getElementById('arrow').style.visibility = 'visible'
    document.getElementById('arrow').style.width = '400px'
  }
}

export default class App extends React.Component {
  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <div id="logoContainer">
          <img id="logo" src="/assets/Game/eda-quest-logo.png" alt="Quest Logo" />
        </div>
        <img id="arrow" src="/assets/Game/scroll-prompt.png" alt="Scroll Prompt" /> */}
        <HighScore />
      </div>
    )
  }
}
