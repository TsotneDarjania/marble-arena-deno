import { Tweens } from "phaser";
import GamePlay from "../../../scenes/GamePlay";

export class Coach extends Phaser.GameObjects.Container {
  motionTween: Tweens.Tween;
  lightTween: Tweens.Tween;
  selector: Phaser.GameObjects.Image;
  image: Phaser.GameObjects.Image;

  constructor(
    public scene: GamePlay,
    public x: number,
    public y: number,
    public key: string,
    public isHostTeamCoach: boolean
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.addSelector();
    this.addImage();

    this.setDepth(1);

    scene.events.on("update", () => {
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.scene.match.ball.x,
        this.scene.match.ball.y
      );
      this.setRotation(angle + 1.3);
    });
  }

  addImage() {
    this.image = this.scene.add.image(0, 0, this.key);
    this.image.setScale(0.72);
    this.add(this.image);
  }

  addSelector() {
    this.selector = this.scene.add.image(0, 0, "circle");
    this.selector.setTint(0x000000);
    this.selector.setScale(0.63);
    this.selector.setAlpha(0.6);

    this.add(this.selector);
  }

  angry() {
    this.image.setTint(0xfa471b);
    const tween = this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 160,
    });

    setTimeout(() => {
      tween.destroy();
      this.image.setTint(0xffffff);
      this.setAlpha(1);
    }, 1500);
  }

  selebration() {
    this.motionTween = this.scene.tweens.add({
      targets: this,
      x: this.isHostTeamCoach ? this.x + 100 : this.x - 100,
      yoyo: true,
      scale: this.scale + 0.1,
      duration: 1500,
      onComplete: () => {
        this.stopSelebration();
      },
    });

    this.lightTween = this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 160,
    });
  }

  stopSelebration() {
    this.setAlpha(1);
    this.lightTween.pause();
  }
}
