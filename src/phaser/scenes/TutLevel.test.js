// import { askQuestion, collectScore } from './TutLevel'

import { askQuestion, collectScore } from './TutLevel'

test('type react and check pass through if statement', () => {

  const type = { texture: { key: 'react' } }

  expect(collectScore(null, type)).toEqual('output')
})