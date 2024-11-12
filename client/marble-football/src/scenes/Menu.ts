import * as Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
    console.log("Menu");
  }

  create() {
    this.scene.start("GamePlay");
  }
}
