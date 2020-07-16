import Phaser from 'phaser'
import { scoreChanged } from '../score'

let player
let platforms
let cursors
let stars
let score = 0
let scoreText

export const collectStar = (player, star) => {
  star.disableBody(true, true)
  score += 10
  scoreText.setText('Score: ' + score)
  scoreChanged(score)
}

var levelOne = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

  function SceneA () {
    Phaser.Scene.call(this, { key: 'levelOne' })
  },

  preload: function () {
    this.load.image('sky', 'src/assets/sky.png')
    this.load.image('ground', 'src/assets/platform.png')
    this.load.image('star', 'src/assets/star.png')
    this.load.image('bomb', 'src/assets/bomb.png')
    this.load.spritesheet('dude', 'src/assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    })
  },

  create: function () {
    this.add.image(400, 300, 'sky')

    platforms = this.physics.add.staticGroup()

    platforms.create(400, 568, 'ground').setScale(2).refreshBody()

    platforms.create(600, 400, 'ground')
    platforms.create(50, 250, 'ground')
    platforms.create(750, 220, 'ground')

    player = this.physics.add.sprite(100, 515, 'dude')

    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })

    cursors = this.input.keyboard.createCursorKeys()
    this.physics.add.collider(player, platforms)

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    })

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })

    this.physics.add.collider(stars, platforms)
    this.physics.add.overlap(player, stars, collectStar, null, this)

    scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    })
  },

  update: function () {
    if (cursors.left.isDown) {
      player.setVelocityX(-160)

      player.anims.play('left', true)
    } else if (cursors.right.isDown) {
      player.setVelocityX(160)

      player.anims.play('right', true)
    } else {
      player.setVelocityX(0)

      player.anims.play('turn')
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330)
    }
  }
})

export default levelOne
