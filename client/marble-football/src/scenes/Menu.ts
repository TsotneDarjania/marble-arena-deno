import * as Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    this.scene.start("GamePlay");
  }
}
