import "./main.css";
import Phaser, {Game} from 'phaser';

// Scenes
import PreloaderScene from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';

const canvas = document.getElementById('game_canvas');

const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 }
    }
  },
  scene: [
    PreloaderScene,
    GameScene
  ]
};

const game = new Game(config);