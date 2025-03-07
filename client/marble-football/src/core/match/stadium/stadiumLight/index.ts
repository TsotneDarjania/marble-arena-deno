import GamePlay from "../../../../scenes/GamePlay";
import { calculatePercentage } from "../../../../utils/math";

export default class StadiumLight extends Phaser.GameObjects.Container {
  image: Phaser.GameObjects.Image;
  light: Phaser.GameObjects.Image;

  tween: Phaser.Tweens.Tween;
  tweenForLight: Phaser.Tweens.Tween;

  isReverse: boolean;
  initialAngle: number = 0; // Store the initial angle

  constructor(scene: GamePlay, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.addImage();
    this.addLight(0xcaf1de);

    this.setScale(1.2);
  }

  addImage() {
    this.image = this.scene.add.image(0, 0, "stadiumLight").setScale(1.2);
    this.image.setTint(0x205c5c);

    this.add(this.image);
  }

  addLight(color: number) {
    this.light = this.scene.add
      .image(0, 152, "triangle")
      .setScale(0.9)
      .setAlpha(0.6);

    this.light.setTint(color);

    this.light.setVisible(false);
    this.add(this.light);
  }

  turnOn() {
    this.light.setAlpha(0.6);
    this.light.setVisible(true);
    this.tweenForLight = this.scene.tweens.add({
      targets: this.light,
      alpha: 0.1,
      yoyo: true,
      repeat: -1,
      duration: 150,
    });
  }

  turnOff() {
    this.light.setVisible(false);
    this.tweenForLight?.destroy();
  }

  startAnimation(reverse: boolean) {
    this.isReverse = reverse;
    this.initialAngle = this.angle; // Store the initial angle

    this.turnOn();

    this.tween = this.scene.tweens.add({
      targets: this,
      angle: {
        from: this.isReverse ? this.angle + 45 : this.angle - 45,
        to: this.isReverse ? this.angle - 45 : this.angle + 45,
      },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
    this.tween.seek(calculatePercentage(50, 700));
  }

  stopAnimation() {
    if (this.tween) {
      this.scene.tweens.add({
        targets: this,
        angle: this.initialAngle, // Reset to initial angle instead of 0
        duration: 500,
        onComplete: () => {
          this.tween?.destroy();
          this.turnOff();
        },
      });
    } else {
      this.turnOff();
    }
  }
}
