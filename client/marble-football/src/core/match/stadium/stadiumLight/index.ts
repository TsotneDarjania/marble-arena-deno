import {
  calculatePercentage,
  getRandomIntNumber,
} from "../../../../utils/math";

export default class StadiumLight extends Phaser.GameObjects.Container {
  image: Phaser.GameObjects.Image;
  light: Phaser.GameObjects.Image;

  tween: Phaser.Tweens.Tween;

  randomColors = [0xffff96];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.addImage();
    this.addLight();

    this.setScale(1.2);
  }

  addImage() {
    this.image = this.scene.add.image(0, 0, "stadiumLight").setScale(1.2);
    this.image.setTint(0x205c5c);

    this.add(this.image);
  }

  addLight() {
    this.light = this.scene.add
      .image(0, 152, "triangle")
      .setScale(0.9)
      .setAlpha(0.6);

    this.light.setTint(
      this.randomColors[getRandomIntNumber(0, this.randomColors.length - 1)]
    );

    this.light.setVisible(false);
    this.add(this.light);
  }

  turnOn() {
    this.light.setVisible(true);
  }

  turnOff() {
    this.light.setVisible(false);
  }

  makeAnimation(referse: boolean, duration: number) {
    this.turnOn();

    this.tween = this.scene.tweens.add({
      targets: this,
      angle: {
        from: referse ? this.angle + 45 : this.angle - 45,
        to: referse ? this.angle - 45 : this.angle + 45,
      },
      duration: duration / 4,
      yoyo: true,
      repeat: 4,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          angle: referse ? this.angle - 45 : this.angle + 45,
          duration: 700,
          onComplete: () => {
            this.turnOff();
          },
        });
      },
    });
    this.tween.seek(calculatePercentage(50, 700));
  }
}
