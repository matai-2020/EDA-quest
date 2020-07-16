import Phaser from 'phaser'

var title = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

  function SceneA () {
    Phaser.Scene.call(this, { key: 'title' })
  },

  preload: function () {
    this.load.image('sky', 'src/assets/sky.png')
    this.load.image('quest-logo', 'src/assets/quest-logo.png')
  },

  create: function () {
    this.add.image(400, 300, 'sky')
    this.add.image(400, 300, 'quest-logo').setScale(0.5)

    this.input.once('pointerdown', function () {
      console.log('From Title to Level 1')

      this.scene.start('levelOne')
    }, this)
  }
})

export default title
