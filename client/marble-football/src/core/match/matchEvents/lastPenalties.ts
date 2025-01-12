import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
import { calculatePercentage, getRandomIntNumber } from "../../../utils/math";

export class LastPenalties {
  shooterFootballer: Phaser.Physics.Arcade.Image;
  goalKeeper: Phaser.Physics.Arcade.Image;
  goalKeeperTween: Phaser.Tweens.Tween;

  shooterWas: "host" | "guest" = "host";
  isGoalSelebration = false;

  step = 0;

  hostScore = 0;
  guestScore = 0;

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
    const randomY = getRandomIntNumber(-200, 200);
    console.log(randomY);

    let y = this.goalKeeper.getBounds().centerY + randomY;

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

        if (this.isGoalSelebration === true) return;

        const canvasScene = this.match.scene.scene.get(
          "CanvasScene"
        ) as CanvasScene;
        canvasScene.drawPenaltyFail(
          this.shooterWas === "host" ? "left" : "right"
        );

        this.isGoalSelebration = true;
        this.goalKeeperTween.pause();

        setTimeout(() => {
          this.resetWithNoGoal();
        }, 1500);
      }
    );
  }

  resetWithNoGoal() {
    this.step++;
    this.shooterWas = this.shooterWas === "host" ? "guest" : "host";

    console.log("hostScore " + this.hostScore);
    console.log("guestScore " + this.guestScore);

    const canvasScene = this.match.scene.scene.get(
      "CanvasScene"
    ) as CanvasScene;

    if (this.step >= 6 && this.step / 2 <= 5) {
      if (this.hostScore > this.guestScore) {
        const difference = this.hostScore - this.guestScore;
        const leftStages = 5 - this.step / 2;

        if (leftStages < difference) {
          // this.match.eventEmitter.emit("finishPenalties", "host");
          // alert("WIN IN PENALTIES : HOST TEAM ");
          canvasScene.showLastresult({
            winner: this.match.hostTeamData.name,
            winnerLogoKey: this.match.hostTeamData.logoKey,
          });
          return;
        }
      }

      if (this.hostScore < this.guestScore) {
        const difference = this.guestScore - this.hostScore;
        const leftStages = 5 - this.step / 2;

        if (leftStages < difference) {
          // this.match.eventEmitter.emit("finishPenalties", "guest");
          // alert("WIN IN PENALTIES : GUEST TEAM ");
          canvasScene.showLastresult({
            winner: this.match.guestTeamData.name,
            winnerLogoKey: this.match.guestTeamData.logoKey,
          });
          return;
        }
      }
    }
    if (this.step / 2 > 5) {
      if (this.step % 2 === 0) {
        if (this.hostScore > this.guestScore) {
          // this.match.eventEmitter.emit("finishPenalties", "host");
          // alert("WIN IN PENALTIES : HOST TEAM ");
          canvasScene.showLastresult({
            winner: this.match.hostTeamData.name,
            winnerLogoKey: this.match.hostTeamData.logoKey,
          });
          return;
        }
        if (this.hostScore < this.guestScore) {
          // this.match.eventEmitter.emit("finishPenalties", "guest");
          // alert("WIN IN PENALTIES : GUEST TEAM ");
          canvasScene.showLastresult({
            winner: this.match.guestTeamData.name,
            winnerLogoKey: this.match.guestTeamData.logoKey,
          });
          return;
        }
      }
    }

    this.shooterFootballer.destroy();
    this.goalKeeper.destroy();
    this.match.ball.setAlpha();
    this.match.ball.emitter.setAlpha(0);

    setTimeout(() => {
      this.match.ball.setAlpha(1);
      this.match.ball.emitter.setAlpha(1);

      this.addGoalKeeper();
      this.addShooter();
      this.makeReadyBallPosition();
      this.isGoalSelebration = false;
      setTimeout(() => {
        this.shoot();
      }, getRandomIntNumber(3000, 5000));
    }, 300);
  }

  finish(winnerIs: "host" | "guest") {
    alert("Win " + winnerIs);
  }

  isGoal() {
    if (this.isGoalSelebration) return;

    const canvasScene = this.match.scene.scene.get(
      "CanvasScene"
    ) as CanvasScene;

    if (this.shooterWas === "host") {
      this.hostScore += 1;
      this.match.matchManager.hostScore += 1;
    } else {
      this.guestScore += 1;
      this.match.matchManager.guestScore += 1;
    }

    canvasScene.hostTeamScoretext.setText(
      this.match.matchManager.hostScore.toString()
    );
    canvasScene.guestTeamScoretext.setText(
      this.match.matchManager.guestScore.toString()
    );

    canvasScene.drawPenaltyDone(this.shooterWas === "host" ? "left" : "right");
    this.goalKeeperTween.pause();

    this.match.ball.stop();
    this.match.ball.startShortBlinkAnimation(() => {});

    this.match.stadium.shortGoalSelebration(this.shooterWas);
    this.isGoalSelebration = true;
  }

  FinishedGoalSelebration() {
    this.resetWithNoGoal();
  }
}
