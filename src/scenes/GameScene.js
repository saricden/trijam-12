import {Scene, GameObjects} from 'phaser';

const {Container} = GameObjects;

const map_numIslands = 50;

class GameScene extends Scene {
  constructor() {
    super("scene-game");
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  create() {
    // Init some vars
    this.energy = 10;
    this.maxEnergy = 100;
    this.speed = 0;
    this.minSpeed = 100;
    this.maxSpeedBoost = 300;
    this.jumpHeight = 500;
    this.isDead = false;
    this.lastTileX = 0;

    // RANDOMLY self generating map:
    const mapGroup = this.physics.add.staticGroup();
    const mapYOffset = 400;
    
    for (let i = 0; i < map_numIslands; i++) {
      const islandWidthTiles = this.getRandomInt(5, 10);
      const islandDistance = (i * 75);
      const islandGapOffset = (i > 0 ? (this.getRandomInt(0, 4) * 75) : 0);
      const islandYOffset = (i > 0 ? ((this.getRandomInt(0, 4) * 75) + mapYOffset) : mapYOffset);

      for (let t = 0; t < islandWidthTiles; t++) {
        const tileX = ((i * 75) + (t * 75) + islandGapOffset + islandDistance);
        this.lastTileX = tileX;

        mapGroup.create(tileX, islandYOffset, 'tile').setScale(0.25).refreshBody();
      }
    }

    // Add our MC & focus camera on him
    this.mc = this.physics.add.sprite(0, 0, 'mc');
    this.mc.setScale(0.15);
    this.cameras.main.startFollow(this.mc);

    // Add player particle emitter
    const contrail = this.add.particles('tile');
    this.contrailEmitter = contrail.createEmitter({
      // frame: 'blue',
      x: 0,
      y: 0,
      lifespan: 500,
      speed: { min: 300, max: 600 },
      angle: 270,
      gravityY: 100,
      scale: { start: 0.2, end: 0.45 },
      quantity: 2,
      alpha: (particle, key, t) => {
        const energyScalar = (this.energy / this.maxEnergy);
        return (energyScalar * (1 - t));
      }
    });
    this.contrailEmitter.setRadial(true);

    // Physics colliders
    this.mapCollider = this.physics.add.collider(this.mc, mapGroup);

    // Add % UI
    this.percentText = this.add.text((window.innerWidth / 2), 30, "0%", {
      fontFamily: "Sans Serif",
      color: '#FFF',
      align: "center"
    });
    this.percentText.setScrollFactor(0);

    // Layer things
    mapGroup.setDepth(1);
    contrail.setDepth(2);
    this.mc.setDepth(3);
    this.percentText.setDepth(4);
  }

  update() {
    const {mc, contrailEmitter} = this;
    const {activePointer} = this.input;

    contrailEmitter.setPosition((mc.x + (15 * (this.energy / this.maxEnergy))), mc.y);

    // Jump logic
    if (!this.isDead) {
      if (activePointer.isDown && mc.body.blocked.down) {
        mc.setVelocityY(-this.jumpHeight);
      }

      // Show correct animations
      if (mc.body.blocked.down) {
        mc.anims.play('mc-run', true);
      }
      else if (mc.body.velocity.y < 0) {
        mc.anims.play('mc-jump', true);
      }
      else if (mc.body.velocity.y >= 0) {
        mc.anims.play('mc-fall', true);
      }
    }
    else {
      mc.anims.play('mc-die', true);
      mc.setRotation(mc.rotation + (this.energy / this.maxEnergy / 2));
    }

    // Check if MC dies
    if (mc.body.blocked.right) {
      this.killMC();
    }

    // Check if MC has fallen off the map
    if (mc.y > 2000) {
      this.scene.restart();
    }

    // Update speed & energy
    if (this.energy < this.maxEnergy) {
      this.energy += 0.25;
    }
    console.log(this.energy);
    this.speed = this.minSpeed + ((this.energy / this.maxEnergy) * this.maxSpeedBoost);
    this.mc.setVelocityX(this.speed);

    // Update %age complete text
    const completed = Math.round(mc.x / this.lastTileX * 100);
    if (!this.isDead && completed <= 100) {
      this.percentText.setText(completed+"%");
    }
    else if (!this.isDead) {
      this.percentText.setText("WINNER!!");
    }
    else if (mc.y < 1500) {
      this.percentText.setText("You dead.");
    }
    else if (mc.y >= 1500) {
      this.percentText.setText("Restarting level...");
    }
  }

  killMC() {
    this.isDead = true;
    this.mapCollider.destroy();
    this.mc.setVelocityY(-this.jumpHeight*(this.energy / this.maxEnergy));
  }
}

export default GameScene;