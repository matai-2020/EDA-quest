const { config } = require('../src/index.js')

test('config has correct number of levels', () => {
  expect(config.scene).toHaveLength(12)
})

test('config is an object', () => {
  expect(typeof config).toBe('object')
})
