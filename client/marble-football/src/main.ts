import CanvasScene from "./scenes/CanvasScene";
import GamePlay from "./scenes/GamePlay";
import Menu from "./scenes/Menu";
import Preload from "./scenes/Preloader";
import { Game, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  antialias: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  // backgroundColor: 0x40e02b,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preload, Menu, GamePlay, CanvasScene],
};

export default new Game(config);
