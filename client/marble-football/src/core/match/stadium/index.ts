import Spectators from "./spectators";

export class Stadium extends Phaser.GameObjects.Container {
  stadiumWidth = 1176;
  stadiumHeight = 599;

  spectators: Spectators;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.addLines();
    this.addSpectators();
  }

  addLines() {
    const stadiumLines = this.scene.add.image(0, 0, "stadiumLines");
    stadiumLines.setDisplaySize(this.stadiumWidth, this.stadiumHeight);
    this.add(stadiumLines);
  }

  addSpectators() {
    this.spectators = new Spectators(this);
  }
}
