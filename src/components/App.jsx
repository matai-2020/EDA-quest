import React from 'react'
import HighScore from './HighScore.jsx'

window.onscroll = function () {
  // console.log(window.scrollY)
  // console.log('test')
  scrollFunction()
}

function scrollFunction () {
  if (document.body.scrollTop >= 1 || document.documentElement.scrollTop >= 1) {
    document.getElementById('logo').style.width = '10px'
    document.getElementById('logo').style.visibility = 'hidden'
  } else {
    document.getElementById('logo').style.visibility = 'visible'
    document.getElementById('logo').style.width = '900px'
  }
}

export default class App extends React.Component {
  render () {
    console.log(window.scrollY)
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <h1>Hello World</h1> */}
        <div className="logoContainer">
          <img id="logo" src="/assets/Game/eda-quest-logo.png" alt="Quest Logo" />
        </div>
        <HighScore />
      </div>
    )
  }
}
