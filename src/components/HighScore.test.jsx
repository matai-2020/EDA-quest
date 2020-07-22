import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as firebase from 'firebase'
import 'regenerator-runtime/runtime'
import { StateMock } from '@react-mock/state'

import HighScore from './HighScore'

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

const mockData = [
  {
    name: 'Jake',
    score: 360
  },
  {
    name: 'Louis',
    score: 350
  },
  {
    name: 'Isaac',
    score: 440
  },
  {
    name: 'RocketMan1',
    score: 380
  },
  {
    name: 'JumpGod5',
    score: 460
  },
  {
    name: 'Lebron',
    score: 590
  },
  {
    name: 'Fenton',
    score: 340
  },
  {
    name: 'Adrienne',
    score: 500
  },
  {
    name: 'Sarah',
    score: 390
  },
  {
    name: 'FazeJumps',
    score: 260
  },
  {
    name: 'Rufus',
    score: 330
  },
  {
    name: 'Geoff',
    score: 340
  }

]

firebase.initializeApp(firebaseConfig)

test('Lists through Highscores on GameOver', async () => {
  const sortedData = mockData.sort((a, b) => b.score - a.score)

  render(
    <StateMock state={{ isAlive: false, wonGame: false, highScores: sortedData }}>
      <HighScore />
    </StateMock>
  )

  await screen.getAllByRole('rankScore')

  expect(screen.getAllByRole('rankScore')).toHaveLength(10)
  expect(sortedData[0].name).toBe('Lebron')
  expect(sortedData[0].score).toBe(590)

  expect(sortedData[9].name).toBe('Fenton')
  expect(sortedData[9].score).toBe(340)
})

test('Lists through Highscore on Victory', async () => {
  const sortedData = mockData.sort((a, b) => b.score - a.score)

  render(
    <StateMock state={{ isAlive: true, wonGame: true, highScores: sortedData }}>
      <HighScore />
    </StateMock>
  )

  await screen.getAllByRole('victoryScore')

  expect(screen.getAllByRole('victoryScore')).toHaveLength(10)
  expect(sortedData[0].name).toBe('Lebron')
  expect(sortedData[0].score).toBe(590)

  expect(sortedData[9].name).toBe('Fenton')
  expect(sortedData[9].score).toBe(340)
})
