let subscriber = null

export function scoreChanged (newScore) {
  if (subscriber) subscriber(newScore)
}

export function gameOver (isAlive) {
  if (subscriber) subscriber(isAlive)
}

export function subscribe (fn) {
  subscriber = fn
}
