let subscriber = null

export function scoreChanged (newScore, isAlive) {
  if (subscriber) subscriber(newScore, isAlive)
}

export function gameOver (gameOver) {
  if (subscriber) subscriber(gameOver)
}

export function subscribe (fn) {
  subscriber = fn
}
