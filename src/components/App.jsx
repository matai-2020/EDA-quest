import React from 'react'
import HighScore from './HighScore.jsx'

window.onscroll = function () {
  console.log(window.scrollY)
  console.log('test')
  scrollFunction()
}

function scrollFunction () {
  if (window.scrollY === 0) {
    document.getElementById('logo').style.visibility = 'visible'
    document.getElementById('logo').style.width = '900px'
    document.getElementById('logo').style.marginTop = '150px'
    document.getElementById('logo').style.marginBottom = '230px'
  } else {
    document.getElementById('logo').style.width = '10px'
    document.getElementById('logo').style.visibility = 'hidden'
  }
}

export default class App extends React.Component {
  render () {
    console.log(window.scrollY)
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <h1>Hello World</h1> */}
        <img id="logo" src="/assets/Game/eda-quest-logo.png" alt="Quest Logo" />
        <HighScore />
      </div>
    )
  }
}
