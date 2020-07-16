let subscriber = null

export function scoreChanged (newScore) {
  if (subscriber) subscriber(newScore)
}

export function subscribe (fn) {
  subscriber = fn
}


