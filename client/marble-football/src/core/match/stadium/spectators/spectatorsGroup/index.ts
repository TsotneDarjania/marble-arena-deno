export default class SpectatorsGroup extends Phaser.GameObjects.Container {
  images: Array<Phaser.GameObjects.Bob>;

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
    this.images = [];
    const blitter = this.scene.add.blitter(0, 0, this.imageKey);

    for (let i = 0; i < this.linesQunatity; i++) {
      const image = blitter.create(0, i * 40);
      this.images.push(image);
    }

    this.add(blitter);
  }

  set color(newColor: number) {
    this.images.forEach((image) => {
      image.setTint(newColor);
    });
  }
}
