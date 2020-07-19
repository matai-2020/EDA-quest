let subscriber = null

export function scoreChanged (newScore) {
  if (subscriber) subscriber(newScore)
}

export function gameOver (gameStatus) {
  if (subscriber) subscriber(gameStatus)
}

export function subscribe (fn) {
  subscriber = fn
}
