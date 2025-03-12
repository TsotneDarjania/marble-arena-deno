import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
import { getRandomIntNumber, mapToRange } from "../../../utils/math";
import BoardFootballPlayer from "../team/footballplayers/boardFootballPlayer";

export class Freekick {
  shooterfootballer!: Phaser.GameObjects.Image;
  longDistanceSecondShooter!: Phaser.Physics.Arcade.Image;
  isLongDistanceFreeKick = false;
  isGoalScored = false;

  constructor(
    public match: Match,
    public teamWhoIsGuilty: "host" | "guest",
    public footballer: BoardFootballPlayer
  ) {
    this.init();
  }

  init() {
    this.match.scene.soundManager.referee.play();

    this.addShooterootballer();
    // Make Layout
    this.footballer.playerData.position === "attacker"
      ? this.makeLongFreeKickLayout()
      : this.makeShortFreeKickLayout();

    if (this.isLongDistanceFreeKick) {
      this.addColliders();
      return;
    }

    setTimeout(() => {
      this.shoot();
    }, getRandomIntNumber(2000, 3000));
  }

  stopFreeKick() {
    this.match.matchManager.matchEvenetManager.matchStatus = "finishFreeKick";
    this.match.ball.stop();
    this.match.hostTeam.stopFullMotion();
    this.match.guestTeam.stopFullMotion();

    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    setTimeout(() => {
      this.destroyFreeKick();
    }, 1000);
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

    this.isGoalScored = true;
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
      this.stopFreeKick();
    }, 4000);
  }

  destroyFreeKick() {
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
          this.teamWhoIsGuilty,
          this.isGoalScored
        );

        this.shooterfootballer.destroy();
        this.longDistanceSecondShooter?.destroy();

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

  shoot() {
    this.match.scene.soundManager.shoot.play();

    const teamData =
      this.teamWhoIsGuilty === "guest"
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

    if (this.teamWhoIsGuilty === "guest") {
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

  save() {
    this.match.scene.soundManager.catchBall.play();

    this.match.ball.stop();
    this.match.hostTeam.stopFullMotion();
    this.match.guestTeam.stopFullMotion();

    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.stopFreeKick();
  }

  addColliders() {
    let alreadyShoot = false;
    this.match.scene.physics.add.overlap(
      this.match.ball,
      this.longDistanceSecondShooter,
      () => {
        if (alreadyShoot) return;
        alreadyShoot = true;
        this.shoot();
      }
    );
  }

  addShooterootballer() {
    this.shooterfootballer = this.match.scene.add.image(
      this.teamWhoIsGuilty === "host"
        ? this.match.ball.getBounds().centerX + 30
        : this.match.ball.getBounds().centerX - 30,
      this.match.ball.getBounds().centerY,
      this.teamWhoIsGuilty === "host"
        ? this.match.guestTeam.teamData.logoKey
        : this.match.hostTeam.teamData.logoKey
    );
    this.shooterfootballer.setScale(0.6);
  }

  makeLongFreeKickLayout() {
    this.isLongDistanceFreeKick = true;
    if (this.teamWhoIsGuilty === "host") {
      this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
      this.match.hostTeam.boardFootballPlayers.goalKeeper.activate();

      this.match.hostTeam.boardFootballPlayers.middleColumn.footballers.forEach(
        (f) => {
          f.activate();
        }
      );
      this.match.hostTeam.boardFootballPlayers.middleColumn.startMotion(
        this.match.matchData.hostTeamData.motionSpeed
      );

      const randomFootballer =
        this.match.guestTeam.boardFootballPlayers.attackColumn.footballers[
          getRandomIntNumber(
            0,
            this.match.guestTeam.boardFootballPlayers.attackColumn.footballers
              .length
          )
        ];
      this.longDistanceSecondShooter = this.match.scene.physics.add.image(
        randomFootballer.getBounds().x,
        randomFootballer.getBounds().y,
        this.match.guestTeam.teamData.logoKey
      );
      this.longDistanceSecondShooter.setDepth(110);
      this.longDistanceSecondShooter.setScale(0.6);
      this.longDistanceSecondShooter.setCircle(30);

      setTimeout(() => {
        const x = this.longDistanceSecondShooter.getBounds().centerX;
        const y = this.longDistanceSecondShooter.getBounds().centerY;

        this.match.scene.soundManager.pass.play();

        this.match.ball.kick(
          mapToRange(this.match.matchData.guestTeamData.passSpeed, 160, 300),
          {
            x,
            y,
          }
        );
      }, 2000);
    } else {
      this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.activate();

      this.match.guestTeam.boardFootballPlayers.middleColumn.footballers.forEach(
        (f) => {
          f.activate();
        }
      );
      this.match.guestTeam.boardFootballPlayers.middleColumn.startMotion(
        this.match.matchData.guestTeamData.motionSpeed
      );

      const randomFootballer =
        this.match.hostTeam.boardFootballPlayers.attackColumn.footballers[
          getRandomIntNumber(
            0,
            this.match.hostTeam.boardFootballPlayers.attackColumn.footballers
              .length
          )
        ];

      this.longDistanceSecondShooter = this.match.scene.physics.add.image(
        randomFootballer.getBounds().x,
        randomFootballer.getBounds().y,
        this.match.hostTeam.teamData.logoKey
      );
      this.longDistanceSecondShooter.setDepth(110);
      this.longDistanceSecondShooter.setScale(0.6);
      this.longDistanceSecondShooter.setCircle(30);

      setTimeout(() => {
        const x = this.longDistanceSecondShooter.getBounds().centerX;
        const y = this.longDistanceSecondShooter.getBounds().centerY;

        this.match.scene.soundManager.pass.play();

        this.match.ball.kick(
          mapToRange(this.match.matchData.hostTeamData.passSpeed, 160, 300),
          {
            x,
            y,
          }
        );
      }, 2000);
    }
  }

  makeShortFreeKickLayout() {
    if (this.teamWhoIsGuilty === "host") {
      this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
      this.match.hostTeam.boardFootballPlayers.goalKeeper.activate();

      this.match.hostTeam.boardFootballPlayers.defenceColumn.footballers.forEach(
        (f) => {
          f.activate();
        }
      );
    } else {
      this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.activate();

      this.match.guestTeam.boardFootballPlayers.defenceColumn.footballers.forEach(
        (f) => {
          f.activate();
        }
      );
    }
  }
}
