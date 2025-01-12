import Match from "..";
import {
  calculatePercentage,
  getRandomIntNumber,
  mapToRange,
} from "../../../utils/math";

export class Corner {
  attacker: Phaser.GameObjects.Image;
  deffender: Phaser.GameObjects.Image;

  cornerAlreadyShoot = false;

  shootSide: "left" | "right" = "left";

  constructor(public match: Match) {
    this.init();
    match.matchManager.ballGoesForCorner = false;
    this.match.collisionDetector.onceForCorner = true;
  }

  init() {
    this.changeBallPosition();

    this.match.matchManager.isCorner = true;
  }

  changeBallPosition() {
    let x = 0;
    let y = 0;

    let defenderX = 0;
    let defenderY = 0;

    let attackerX = 0;
    let attackerY = 0;

    if (
      this.match.ball.getBounds().centerX <
      this.match.scene.game.canvas.width / 2
    ) {
      this.shootSide = "left";
      // console.log("x left");
      this.match.hostTeam.boardFootballPlayers.goalKeeper.activate();
      this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
      x =
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 2;

      defenderX =
        x +
        calculatePercentage(
          getRandomIntNumber(14, 23),
          this.match.stadium.stadiumWidth
        );

      attackerX =
        x +
        calculatePercentage(
          getRandomIntNumber(14, 23),
          this.match.stadium.stadiumWidth
        );
    } else {
      // console.log("x right");
      this.shootSide = "right";

      this.match.guestTeam.boardFootballPlayers.goalKeeper.activate();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();

      x =
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 2;

      defenderX =
        x -
        calculatePercentage(
          getRandomIntNumber(14, 23),
          this.match.stadium.stadiumWidth
        );

      attackerX =
        x -
        calculatePercentage(
          getRandomIntNumber(14, 23),
          this.match.stadium.stadiumWidth
        );
    }

    if (
      this.match.ball.getBounds().centerY <
      this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerY
    ) {
      // console.log("y top");
      y =
        this.match.scene.game.canvas.height / 2 -
        calculatePercentage(50, this.match.stadium.stadiumHeight) +
        14;

      defenderY = this.match.scene.game.canvas.height / 2 - 50;
      attackerY = this.match.scene.game.canvas.height / 2 + 50;
    } else {
      // console.log("y bottom");

      y =
        this.match.scene.game.canvas.height / 2 +
        calculatePercentage(50, this.match.stadium.stadiumHeight) -
        20;

      defenderY = this.match.scene.game.canvas.height / 2 + 50;
      attackerY = this.match.scene.game.canvas.height / 2 - 50;
    }

    this.deffender = this.match.scene.physics.add.image(
      defenderX,
      defenderY,
      this.match.ball.getBounds().centerX <
        this.match.scene.game.canvas.width / 2
        ? this.match.hostTeamData.logoKey
        : this.match.guestTeamData.logoKey
    );

    let once = true;
    this.match.scene.physics.add.overlap(
      this.match.ball,
      this.deffender,
      () => {
        if (once) {
          this.match.ball.stop();
          setTimeout(() => {
            if (once) {
              console.log("RESET UFTER DEFFENDER");
              once = false;
              this.reset();
            }
          }, 1600);
        }
      }
    );

    this.attacker = this.match.scene.physics.add.image(
      attackerX,
      attackerY,
      this.match.ball.getBounds().centerX <
        this.match.scene.game.canvas.width / 2
        ? this.match.guestTeamData.logoKey
        : this.match.hostTeamData.logoKey
    );

    let once_2 = true;
    this.match.scene.physics.add.overlap(this.match.ball, this.attacker, () => {
      if (once_2) {
        once_2 = false;
        let x = 0;
        let y =
          this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
            .centerY;

        if (this.shootSide === "right") {
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
    });

    this.deffender.setScale(0.6);
    this.attacker.setScale(0.6);

    this.match.ball.setPosition(x, y);

    setTimeout(() => {
      this.shoot(this.shootSide);
    }, 1600);
  }

  shoot(side: "left" | "right") {
    this.cornerAlreadyShoot = true;
    this.match.scene.tweens.add({
      targets: this.deffender,
      x: {
        from: this.deffender.x,
        to:
          side === "left"
            ? this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
                .x + getRandomIntNumber(70, 200)
            : this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
                .x - getRandomIntNumber(70, 200),
      },
      duration: 700,
      ease: Phaser.Math.Easing.Quadratic.InOut,
    });

    this.match.scene.tweens.add({
      targets: this.attacker,
      x: {
        from: this.attacker.x,
        to:
          side === "left"
            ? this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
                .x + getRandomIntNumber(70, 150)
            : this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
                .x - getRandomIntNumber(70, 150),
      },
      duration: 1400,
      ease: Phaser.Math.Easing.Quadratic.InOut,
    });

    const randomX = getRandomIntNumber(0, 60);
    const x =
      getRandomIntNumber(0, 100) >= 50
        ? this.attacker.getBounds().centerX + randomX
        : this.attacker.getBounds().centerX - randomX;

    this.match.ball.kick(
      mapToRange(
        side === "left"
          ? this.match.guestTeamData.passSpeed
          : this.match.hostTeamData.passSpeed,
        250,
        500
      ),
      {
        x: x,
        y: this.attacker.getBounds().centerY,
      }
    );
  }

  destroy() {
    this.attacker.destroy();
    this.deffender.destroy();
  }

  reset() {
    this.attacker.destroy();
    this.deffender.destroy();

    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.matchManager.resumeMatchUfterKFreeKickOrPenalty(
      this.shootSide === "left" ? "host" : "guest"
    );
  }
}
