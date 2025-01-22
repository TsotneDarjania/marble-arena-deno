import Match from "..";
import { calculatePercentage } from "../../../utils/math";

export class Penalty {
  shooterFootballer!: Phaser.GameObjects.Image;

  constructor(public match: Match, public whoIsGulity: "host" | "guest") {
    match.scene.soundManager.referee.play();

    if (this.whoIsGulity === "host") {
      this.match.hostTeam.boardFootballPlayers.goalKeeper.isPenalty = true;
    } else {
      this.match.guestTeam.boardFootballPlayers.goalKeeper.isPenalty = true;
    }

    this.shooterFootballer = new Phaser.GameObjects.Image(
      match.scene,
      whoIsGulity === "host"
        ? -calculatePercentage(40, this.match.stadium.fieldWidth)
        : calculatePercentage(40, this.match.stadium.fieldWidth),
      0,
      whoIsGulity === "host"
        ? this.match.matchData.guestTeamData.logoKey
        : this.match.matchData.hostTeamData.logoKey
    );
    this.shooterFootballer.setScale(0.6);
    this.shooterFootballer.setDepth(100);

    match.stadium.add(this.shooterFootballer);

    match.ball.setPosition(
      whoIsGulity === "host"
        ? this.shooterFootballer.getBounds().centerX - 30
        : this.shooterFootballer.getBounds().centerX + 30,
      this.match.scene.game.canvas.height / 2
    );

    if (whoIsGulity === "host") {
      match.hostTeam.boardFootballPlayers.goalKeeper.activate();
      match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
    } else {
      match.guestTeam.boardFootballPlayers.goalKeeper.activate();
      match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
    }

    setTimeout(() => {
      this.shoot();
    }, 2000);
  }

  shoot() {
    this.match.scene.soundManager.shoot.play();

    let x = 0;
    let y =
      this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerY;

    if (this.whoIsGulity === "guest") {
      x =
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 40;
    } else {
      x =
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 40;
    }

    this.match.ball.kick(300, { x, y });
  }

  savePenalty() {
    console.log("savePenalty");
    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    setTimeout(() => {
      this.match.matchManager.resumeMatchUfterKFreeKickOrPenalty(
        this.whoIsGulity
      );
    }, 1500);
  }

  destoy() {
    this.shooterFootballer.destroy();
  }
}
