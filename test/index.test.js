const { config } = require('../src/index.js')

test('Phaser config to have the correct amount of levels', () => {
  expect(config.scene).toHaveLength(10)
})

test('config is an object', () => {
  expect(typeof config).toBe('object')
})
