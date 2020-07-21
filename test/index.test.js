const { config } = require('../src/index.js')

test('Phaser config to have correct amount of levels', () => {
  expect(config.scenes).toHaveLength(10)
})

test('config is an object', () => {
  expect(typeof config).toBe('object')
})
