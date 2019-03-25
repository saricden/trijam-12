import {Scene} from 'phaser';

class PreloaderScene extends Scene {
  constructor() {
    super("scene-preloader");
  }

  preload() {
    this.load.spritesheet('mc', 'assets/mc.png', {
      frameWidth: 292,
      frameHeight: 303
    });
    this.load.image('tile', 'assets/tile.png');
    this.load.image('diamond', 'assets/diamond.png');
  }

  create() {

    this.anims.create({
      key: 'mc-run',
      frames: this.anims.generateFrameNames('mc', { start: 1, end: 2 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'mc-idle',
      frames: this.anims.generateFrameNames('mc', { start: 0, end: 0 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'mc-jump',
      frames: this.anims.generateFrameNames('mc', { start: 3, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'mc-fall',
      frames: this.anims.generateFrameNames('mc', { start: 4, end: 4 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'mc-die',
      frames: this.anims.generateFrameNames('mc', { start: 5, end: 5 }),
      frameRate: 6,
      repeat: -1
    });

    this.scene.start('scene-game');
  }
}

export default PreloaderScene;