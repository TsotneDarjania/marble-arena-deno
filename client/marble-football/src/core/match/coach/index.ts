import { Tweens } from "phaser";
import GamePlay from "../../../scenes/GamePlay";

export class Coach extends Phaser.GameObjects.Image {
  motionTween: Tweens.Tween;
  lightTween: Tweens.Tween;

  constructor(
    public scene: GamePlay,
    public x: number,
    public y: number,
    public key: string,
    public isHostTeamCoach: boolean
  ) {
    super(scene, x, y, key);
    scene.add.existing(this);

    this.setScale(0.65);
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

  angry() {
    this.setTint(0xfa471b);
    const tween = this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 160,
    });

    setTimeout(() => {
      tween.destroy();
      this.setTint(0xffffff);
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
