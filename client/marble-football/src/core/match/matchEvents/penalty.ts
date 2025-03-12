import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
import {
  calculatePercentage,
  getRandomIntNumber,
  mapToRange,
} from "../../../utils/math";

export class Penalty {
  shooterFootballer!: Phaser.GameObjects.Image;
  wasGoalScored = false;

  constructor(public match: Match, public whoIsGulity: "host" | "guest") {
    match.scene.soundManager.referee.play();

    this.addShooterFootballer();
    this.changeBallPosition();

    if (whoIsGulity === "host") {
      match.hostTeam.boardFootballPlayers.goalKeeper.activate();
      match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
    } else {
      match.guestTeam.boardFootballPlayers.goalKeeper.activate();
      match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
    }

    setTimeout(() => {
      this.shoot();
    }, getRandomIntNumber(4000, 7000));
  }

  changeBallPosition() {
    this.match.ball.setPosition(
      this.whoIsGulity === "host"
        ? this.shooterFootballer.getBounds().centerX - 30
        : this.shooterFootballer.getBounds().centerX + 30,
      this.match.scene.game.canvas.height / 2
    );
  }

  addShooterFootballer() {
    this.shooterFootballer = new Phaser.GameObjects.Image(
      this.match.scene,
      this.whoIsGulity === "host"
        ? -calculatePercentage(40, this.match.stadium.innerFielddWidth)
        : calculatePercentage(40, this.match.stadium.innerFielddWidth),
      0,
      this.whoIsGulity === "host"
        ? this.match.matchData.guestTeamData.logoKey
        : this.match.matchData.hostTeamData.logoKey
    );
    this.shooterFootballer.setScale(0.6);
    this.shooterFootballer.setDepth(100);

    this.match.stadium.add(this.shooterFootballer);
  }

  shoot() {
    this.match.scene.soundManager.shoot.play();

    const teamData =
      this.whoIsGulity === "guest"
        ? this.match.matchData.hostTeamData
        : this.match.matchData.guestTeamData;
    let x = 0;
    const isfailShoot =
      getRandomIntNumber(0, 100) < teamData.shootAccuracy ? false : true;

    let y = 0;

    if (isfailShoot) {
      const isTop = getRandomIntNumber(0, 100);
      if (isTop > 50) {
        y = 473 + getRandomIntNumber(60, 90);
      } else {
        y = 473 - getRandomIntNumber(60, 90);
      }
    } else {
      const isTop = getRandomIntNumber(0, 100);

      if (isTop > 50) {
        y = 473 + getRandomIntNumber(0, 55);
      } else {
        y = 473 - getRandomIntNumber(0, 55);
      }
    }
    if (this.whoIsGulity === "guest") {
      x =
        this.match.scene.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 10;
    } else {
      x =
        this.match.scene.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 10;
    }
    this.match.scene.match.ball.kick(
      mapToRange(teamData.shootSpeed, 250, 500),
      {
        x,
        y,
      }
    );
  }

  stopPenalty() {
    this.match.matchManager.matchEvenetManager.matchStatus = "finishPenalty";
    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    setTimeout(() => {
      this.destoy();
    }, 1500);
  }

  isGoal(whoScored: "host" | "guest") {
    if (whoScored === "host") {
      this.match.matchManager.hostScore++;
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.hostTeamScoretext.setText(
        this.match.matchManager.hostScore.toString()
      );
    } else {
      this.match.matchManager.guestScore++;
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.guestTeamScoretext.setText(
        this.match.matchManager.guestScore.toString()
      );
    }

    this.wasGoalScored = true;
    this.match.stadium.startGoalSelebration(whoScored);
    this.match.ball.startBlinkAnimation();
    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.hostTeam.stopFullMotion();
    this.match.guestTeam.stopFullMotion();

    if (whoScored === "host") {
      this.match.hostTeamCoach.selebration();
      this.match.guestTeamCoach.angry();
    } else {
      this.match.guestTeamCoach.selebration();
      this.match.hostTeamCoach.angry();
    }

    setTimeout(() => {
      this.stopPenalty();
    }, 4000);
  }

  destoy() {
    const bg = this.match.scene.add
      .image(
        this.match.scene.game.canvas.width / 2,
        this.match.scene.game.canvas.height / 2,
        "default"
      )
      .setDepth(150)
      .setTint(0x000000)
      .setScale(100)
      .setAlpha(0);

    const canvasScene = this.match.scene.scene.get(
      "CanvasScene"
    ) as CanvasScene;
    canvasScene.showMarbleArenaLogo();

    this.match.scene.tweens.add({
      targets: [bg],
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.match.stadium.stopGoalSelebration();
        this.match.matchManager.matchEvenetManager.resumeUfterFreeKick(
          this.whoIsGulity,
          this.wasGoalScored
        );

        this.shooterFootballer.destroy();

        setTimeout(() => {
          this.match.scene.tweens.add({
            targets: bg,
            alpha: 0,
            delay: 300,
            duration: 500,
            onComplete: () => {
              bg.destroy();
            },
          });
        }, 300);
      },
    });
  }
}
