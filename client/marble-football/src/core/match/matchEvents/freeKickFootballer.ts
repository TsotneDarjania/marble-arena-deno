import Match from "..";
import GamePlay from "../../../scenes/GamePlay";

export class FreeKickFootballer extends Phaser.GameObjects.Container {
  image: Phaser.Physics.Arcade.Image | Phaser.GameObjects.Image;
  selector: Phaser.GameObjects.Image;

  alreadyShoot = false;

  constructor(
    scene: GamePlay,
    x: number,
    y: number,
    public role: "shooter" | "wallPlayer",
    public imageKey: string,
    public match: Match,
    public who: "host" | "guest"
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.setScale(0.6);
    this.setDepth(100);
    this.addImage();
    this.addSelector();
    this.addCollider();
  }

  addImage() {
    this.image =
      this.role === "wallPlayer"
        ? this.scene.physics.add.image(0, 0, this.imageKey)
        : this.scene.add.image(0, 0, this.imageKey);
    this.role === "wallPlayer" &&
      (
        this.image as Phaser.Types.Physics.Arcade.ImageWithDynamicBody
      ).setCircle(30);
    this.add(this.image);
  }

  addSelector() {
    this.selector = this.scene.add.image(0, 0, "circle");
    this.selector.setTint(0x48f526);
    this.selector.setScale(0.88);
    this.selector.setAlpha(0);

    this.add(this.selector);
  }

  addCollider() {
    this.scene.physics.add.overlap(this.match.ball, this.image, () => {
      if (this.alreadyShoot) return;

      this.role === "wallPlayer"
        ? this.save()
        : this.match.matchManager.freeKick!.shoot();

      this.alreadyShoot = true;
    });
  }

  selectorOnn() {
    this.scene.add.tween({
      targets: this.selector,
      alpha: 1,
      duration: 200,
    });
  }

  selectorOff() {
    this.scene.add.tween({
      targets: this.selector,
      alpha: 0,
      duration: 200,
    });
  }

  save() {
    this.match.scene.soundManager.catchBall.play();
    this.match.matchManager.freeKick!.saveFreeKick();
  }
}
