import GamePlay from "../../../scenes/GamePlay";

export class Coach extends Phaser.GameObjects.Image {
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
    this.setDepth(200);

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
}
