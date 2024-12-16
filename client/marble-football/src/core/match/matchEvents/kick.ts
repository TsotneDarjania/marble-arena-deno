import { Tweens } from "phaser";
import Match from "..";
import { calculatePercentage, getRandomIntNumber } from "../../../utils/math";
import { FreeKickFootballer } from "./freeKickFootballer";

export class FreeKick {
  shooterFootballer: FreeKickFootballer;
  wallPlayerTween: Tweens.Tween;

  wallPlayer: FreeKickFootballer;
  constructor(
    public match: Match,
    public whoIsGuilty: "host" | "guest",
    public playerPosition:
      | "goalKeeper"
      | "defender"
      | "middfielder"
      | "attacker"
  ) {
    match.hostTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });
    match.guestTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });

    this.createFreeKickFootballers();
    setTimeout(() => {
      playerPosition !== "attacker" ? this.shoot() : this.makePass();
    }, 1500);
  }

  createFreeKickFootballers() {
    this.shooterFootballer = new FreeKickFootballer(
      this.match.scene,
      this.whoIsGuilty === "host"
        ? this.match.ball.getBounds().centerX + 33
        : this.match.ball.getBounds().centerX - 33,
      this.match.ball.getBounds().centerY,
      "shooter",
      this.whoIsGuilty === "host"
        ? this.match.guestTeamData.logoKey
        : this.match.hostTeamData.logoKey,
      this.match,
      this.whoIsGuilty
    );

    if (this.whoIsGuilty === "host") {
      this.match.hostTeam.boardFootballPlayers.goalKeeper.activate();
      this.match.hostTeam.boardFootballPlayers.goalKeeper.isFreeKick = true;
      this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
    } else {
      this.match.guestTeam.boardFootballPlayers.goalKeeper.activate();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.isFreeKick = true;
      this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
    }

    if (this.playerPosition === "attacker") {
      if (this.whoIsGuilty === "host") {
        this.match.hostTeam.boardFootballPlayers.middleColumn.footballers.forEach(
          (f) => {
            f.activate();
            f.isFreeKick = true;
          }
        );
        this.match.hostTeam.boardFootballPlayers.middleColumn.startMotion(true);
      } else {
        this.match.guestTeam.boardFootballPlayers.middleColumn.footballers.forEach(
          (f) => {
            f.activate();
            f.isFreeKick = true;
          }
        );
        this.match.guestTeam.boardFootballPlayers.middleColumn.startMotion(
          true
        );
      }
    }

    if (this.playerPosition !== "attacker") {
      this.wallPlayer = new FreeKickFootballer(
        this.match.scene,
        this.whoIsGuilty === "host"
          ? -calculatePercentage(30, this.match.stadium.fieldWidth)
          : calculatePercentage(30, this.match.stadium.fieldWidth),
        0,
        "wallPlayer",
        this.whoIsGuilty === "host"
          ? this.match.hostTeamData.logoKey
          : this.match.guestTeamData.logoKey,
        this.match,
        this.whoIsGuilty
      );

      this.wallPlayerTween = this.match.scene.add.tween({
        targets: this.wallPlayer,
        y: { from: -100, to: 100 },
        yoyo: true,
        ease: Phaser.Math.Easing.Quadratic.InOut,
        duration: 1000,
        repeat: -1,
      });

      this.match.stadium.add(this.wallPlayer);
    }
  }

  shoot() {
    let x = 0;
    let y =
      this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerY;

    if (this.whoIsGuilty === "host") {
      x =
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 40;
    } else {
      x =
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 40;
    }

    this.match.ball.kick(300, { x, y });
  }

  makePass() {
    if (this.whoIsGuilty === "host") {
      const targetFootballer =
        this.match.guestTeam.boardFootballPlayers.attackColumn.footballers[
          getRandomIntNumber(
            0,
            this.match.guestTeam.boardFootballPlayers.attackColumn.footballers
              .length - 1
          )
        ];

      targetFootballer.activate();
      targetFootballer.isFreeKickShooter = true;

      const x = targetFootballer.getBounds().centerX;
      const y = targetFootballer.getBounds().centerY;

      this.match.ball.kick(200, {
        x,
        y,
      });
    }

    if (this.whoIsGuilty === "guest") {
      const targetFootballer =
        this.match.hostTeam.boardFootballPlayers.attackColumn.footballers[
          getRandomIntNumber(
            0,
            this.match.guestTeam.boardFootballPlayers.attackColumn.footballers
              .length - 1
          )
        ];

      targetFootballer.activate();
      targetFootballer.isFreeKickShooter = true;

      const x = targetFootballer.getBounds().centerX;
      const y = targetFootballer.getBounds().centerY;

      this.match.ball.kick(200, {
        x,
        y,
      });
    }
  }

  saveFreeKick(whoSaved: "host" | "guest") {
    this.match.ball.stop();

    this.wallPlayerTween?.pause();

    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.match.hostTeam.boardFootballPlayers.middleColumn.stopMotion();
    this.match.guestTeam.boardFootballPlayers.middleColumn.stopMotion();

    setTimeout(() => {
      this.match.matchManager.resumeMatchUfterKFreeKickOrPenalty(
        this.whoIsGuilty
      );
    }, 1500);
  }

  destroy() {
    this.wallPlayer?.destroy();
    this.wallPlayerTween?.destroy();
    this.shooterFootballer?.destroy();
  }
}
