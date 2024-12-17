import Match from "..";
import { calculatePercentage } from "../../../utils/math";

export class Penalty {
  shooterFootballer!: Phaser.GameObjects.Image;

  constructor(public match: Match, whoIsGulity: "host" | "guest") {
    this.shooterFootballer = new Phaser.GameObjects.Image(
      match.scene,
      whoIsGulity === "host"
        ? -calculatePercentage(40, this.match.stadium.fieldWidth)
        : -calculatePercentage(40, this.match.stadium.fieldWidth),
      0,
      whoIsGulity === "host"
        ? match.guestTeamData.logoKey
        : match.hostTeamData.logoKey
    );
    this.shooterFootballer.setScale(0.6);
    this.shooterFootballer.setDepth(100);

    match.stadium.add(this.shooterFootballer);

    match.ball.setPosition(
      whoIsGulity === "host"
        ? this.shooterFootballer.getBounds().centerX - 30
        : this.shooterFootballer.getBounds().centerX + 30,
      0
    );
  }
}
