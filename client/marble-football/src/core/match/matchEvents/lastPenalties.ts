import Match from "..";
import { calculatePercentage } from "../../../utils/math";

export class LastPenalties {
  shooterFootballer: Phaser.Physics.Arcade.Image;
  goalKeeper: Phaser.Physics.Arcade.Image;
  goalKeeperTween: Phaser.Tweens.Tween;

  shooterWas: "host" | "guest" = "host";
  isGoalSelebration = false;

  constructor(public match: Match) {
    this.init();
  }

  init() {
    this.match.ball.stop();

    this.match.hostTeam.hideTeam();
    this.match.guestTeam.hideTeam();

    this.match.matchManager.matchStatus = "lastPenalties";

    this.match.hostTeam.footballers.forEach((f) => f.stopFreeKickBehaviour());
    this.match.guestTeam.footballers.forEach((f) => f.stopFreeKickBehaviour());

    this.addShooter();
    this.makeReadyBallPosition();
    this.addGoalKeeper();

    setTimeout(() => {
      this.shoot();
    }, 2000);
  }

  makeReadyBallPosition() {
    this.match.ball.setPosition(
      this.shooterFootballer.getBounds().centerX - 30,
      this.match.scene.game.canvas.height / 2
    );
  }

  shoot() {
    let x = 0;
    let y = this.goalKeeper.getBounds().centerY;

    this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerY;
    x =
      -this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerX -
      40;

    this.match.ball.kick(300, { x, y });
  }

  addShooter() {
    this.shooterFootballer = this.match.scene.physics.add.image(
      -calculatePercentage(40, this.match.stadium.fieldWidth),
      0,
      this.shooterWas === "host"
        ? this.match.hostTeamData.logoKey
        : this.match.guestTeamData.logoKey
    );
    this.shooterFootballer.setScale(0.6);
    this.shooterFootballer.setDepth(100);

    this.match.stadium.add(this.shooterFootballer);
  }

  addGoalKeeper() {
    this.goalKeeper = this.match.scene.physics.add.image(
      -this.match.stadium.fieldWidth / 2 -
        this.match.hostTeam.boardFootballPlayers.goalKeeper.displayWidth / 2,
      0,
      this.shooterWas === "host"
        ? this.match.guestTeamData.logoKey
        : this.match.hostTeamData.logoKey
    );

    this.match.stadium.add(this.goalKeeper);
    this.goalKeeper.setScale(0.6);
    this.goalKeeper.setCircle(30);

    this.goalKeeperTween = this.match.scene.tweens.add({
      targets: this.goalKeeper,
      y: { from: -55, to: 46 },
      duration: 1000,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      yoyo: true,
      repeat: -1,
    });
    // Start fom 50% of the duration
    this.goalKeeperTween.seek(calculatePercentage(50, 1000));

    this.match.scene.physics.add.overlap(
      this.match.ball,
      this.goalKeeper,
      () => {
        this.match.ball.stop();

        setTimeout(() => {
          this.resetWithNoGoal();
        }, 1500);
      }
    );
  }

  resetWithNoGoal() {
    this.shooterFootballer.destroy();
    this.goalKeeper.destroy();

    setTimeout(() => {
      this.addGoalKeeper();
      this.addShooter();
      this.makeReadyBallPosition();
      this.isGoalSelebration = false;
      setTimeout(() => {
        this.shoot();
      }, 2000);

      if (this.shooterWas === "host") {
        this.shooterWas = "guest";
        return;
      } else {
        this.shooterWas = "host";
      }
    }, 2000);
  }

  isGoal() {
    if (this.isGoalSelebration) return;
    this.goalKeeperTween.pause();

    this.match.ball.stop();
    this.match.ball.startBlinkAnimation(() => {});

    this.match.stadium.goalSelebration(this.shooterWas);
    this.isGoalSelebration = true;
  }

  FinishedGoalSelebration() {
    this.resetWithNoGoal();
  }
}
