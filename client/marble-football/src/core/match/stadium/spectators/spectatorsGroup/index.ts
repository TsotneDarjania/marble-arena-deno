export default class SpectatorsGroup extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public linesQunatity: number
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    const blitter = this.scene.add.blitter(0, 0, "spectatorLine");
    blitter.setDisplaySize(4, 4);

    for (let i = 0; i < this.linesQunatity; i++) {
      blitter.create(0, i * 40);
    }

    this.add(blitter);
  }
}
