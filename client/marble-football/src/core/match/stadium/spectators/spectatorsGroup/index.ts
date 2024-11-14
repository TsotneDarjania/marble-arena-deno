export default class SpectatorsGroup extends Phaser.GameObjects.Container {
  image: Phaser.GameObjects.Bob;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public linesQunatity: number,
    public imageKey: string
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    const blitter = this.scene.add.blitter(0, 0, this.imageKey);

    for (let i = 0; i < this.linesQunatity; i++) {
      this.image = blitter.create(0, i * 40);
    }

    this.add(blitter);
  }

  set color(newColor: number) {
    this.image.setTint(newColor);
  }
}
