import React from 'react'
import HighScore from './HighScore.jsx'

window.onscroll = function () {
  scrollFunction()
}

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

export default class App extends React.Component {
  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <h1>Hello World</h1> */}
        <img id="logo" src="/assets/Game/eda-quest-logo.png" alt="Quest Logo" />
        <HighScore />
      </div>
    )
  }
}
