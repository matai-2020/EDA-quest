let subscriber = null

export function scoreChanged (newScore) {
  if (subscriber) subscriber(newScore)
  // subscriber = null
}

export function gameOver (gameOver) {
  if (subscriber) subscriber(gameOver)
  // subscriber = null
}

export function subscribe (fn) {
  subscriber = fn
}
