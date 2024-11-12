import {
  calculatePercentage,
  calculateStadiumHeight,
} from "../../../utils/math";

export class Stadium extends Phaser.GameObjects.Container {
  stadiumWidth = calculatePercentage(window.innerWidth, 80);
  stadiumHeight = calculateStadiumHeight(this.stadiumWidth);

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.addLines();
  }

  addLines() {
    const stadiumLines = this.scene.add.image(0, 0, "stadiumLines");
    this.add(stadiumLines);
  }
}
