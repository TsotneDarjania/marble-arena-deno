// import { Tweens } from "phaser";
// import Match from "..";
// import {
//   calculatePercentage,
//   getRandomIntNumber,
//   mapToRange,
// } from "../../../utils/math";
// import { FreeKickFootballer } from "./freeKickFootballer";

import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
import { getRandomIntNumber, mapToRange } from "../../../utils/math";
import BoardFootballPlayer from "../team/footballplayers/boardFootballPlayer";

// export class FreeKick {
//   shooterFootballer: FreeKickFootballer;
//   wallPlayerTween: Tweens.Tween;

//   isAlreadySavedKick = false;

//   wallPlayer: FreeKickFootballer;
//   constructor(
//     public match: Match,
//     public whoIsGuilty: "host" | "guest",
//     public playerPosition:
//       | "goalKeeper"
//       | "defender"
//       | "middfielder"
//       | "attacker"
//   ) {
//     this.wallPlayerTween = match.scene.add.tween({
//       targets: this,
//     });

//     this.wallPlayerTween.pause();

//     match.hostTeam.footballers.forEach((f) => {
//       f.stopFreeKickBehaviour();
//     });
//     match.guestTeam.footballers.forEach((f) => {
//       f.stopFreeKickBehaviour();
//     });

//     this.createFreeKickFootballers();
//     setTimeout(() => {
//       playerPosition !== "attacker" ? this.shoot() : this.makePass();
//     }, 1500);
//   }

//   createFreeKickFootballers() {
//     this.shooterFootballer = new FreeKickFootballer(
//       this.match.scene,
//       this.whoIsGuilty === "host"
//         ? this.match.ball.getBounds().centerX + 33
//         : this.match.ball.getBounds().centerX - 33,
//       this.match.ball.getBounds().centerY,
//       "shooter",
//       this.whoIsGuilty === "host"
//         ? this.match.matchData.guestTeamData.logoKey
//         : this.match.matchData.hostTeamData.logoKey,
//       this.match,
//       this.whoIsGuilty
//     );

//     if (this.whoIsGuilty === "host") {
//       this.match.hostTeam.boardFootballPlayers.goalKeeper.activate();
//       this.match.hostTeam.boardFootballPlayers.goalKeeper.isFreeKick = true;
//       this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
//     } else {
//       this.match.guestTeam.boardFootballPlayers.goalKeeper.activate();
//       this.match.guestTeam.boardFootballPlayers.goalKeeper.isFreeKick = true;
//       this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
//     }

//     if (this.playerPosition === "attacker") {
//       if (this.whoIsGuilty === "host") {
//         this.match.hostTeam.boardFootballPlayers.middleColumn.footballers.forEach(
//           (f) => {
//             f.activate();
//             f.isFreeKick = true;
//           }
//         );
//         this.match.hostTeam.boardFootballPlayers.middleColumn.startMotion(
//           true,
//           this.match.matchData.hostTeamData.motionSpeed
//         );
//       } else {
//         this.match.guestTeam.boardFootballPlayers.middleColumn.footballers.forEach(
//           (f) => {
//             f.activate();
//             f.isFreeKick = true;
//           }
//         );
//         this.match.guestTeam.boardFootballPlayers.middleColumn.startMotion(
//           true,
//           this.match.matchData.guestTeamData.motionSpeed
//         );
//       }
//     }

//     if (this.playerPosition !== "attacker") {
//       this.wallPlayer = new FreeKickFootballer(
//         this.match.scene,
//         this.whoIsGuilty === "host"
//           ? -calculatePercentage(30, this.match.stadium.innerFielddWidth)
//           : calculatePercentage(30, this.match.stadium.innerFielddWidth),
//         0,
//         "wallPlayer",
//         this.whoIsGuilty === "host"
//           ? this.match.matchData.hostTeamData.logoKey
//           : this.match.matchData.guestTeamData.logoKey,
//         this.match,
//         this.whoIsGuilty
//       );

//       this.wallPlayerTween = this.match.scene.add.tween({
//         targets: this.wallPlayer,
//         y: { from: -100, to: 100 },
//         yoyo: true,
//         ease: Phaser.Math.Easing.Quadratic.InOut,
//         duration: 1000,
//         repeat: -1,
//       });

//       this.match.stadium.add(this.wallPlayer);
//     }
//   }

//   shoot() {
//     this.match.scene.soundManager.shoot.play();
//     let x = 0;
//     let y =
//       this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerY;

//     if (this.whoIsGuilty === "host") {
//       x =
//         this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
//           .centerX + 40;
//     } else {
//       x =
//         this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
//           .centerX - 40;
//     }

//     this.match.ball.kick(300, { x, y });
//   }

//   makePass() {
//     this.match.scene.soundManager.shoot.play();

//     if (this.whoIsGuilty === "host") {
//       const targetFootballer =
//         this.match.guestTeam.boardFootballPlayers.attackColumn.footballers[
//           getRandomIntNumber(
//             0,
//             this.match.guestTeam.boardFootballPlayers.attackColumn.footballers
//               .length - 1
//           )
//         ];

//       targetFootballer.activate();
//       targetFootballer.isFreeKickShooter = true;

//       const x = targetFootballer.getBounds().centerX;
//       const y = targetFootballer.getBounds().centerY;

//       this.match.ball.kick(
//         mapToRange(this.match.matchData.guestTeamData.passSpeed, 160, 300),
//         {
//           x,
//           y,
//         }
//       );
//     }

//     if (this.whoIsGuilty === "guest") {
//       const targetFootballer =
//         this.match.hostTeam.boardFootballPlayers.attackColumn.footballers[
//           getRandomIntNumber(
//             0,
//             this.match.guestTeam.boardFootballPlayers.attackColumn.footballers
//               .length - 1
//           )
//         ];

//       targetFootballer.activate();
//       targetFootballer.isFreeKickShooter = true;

//       const x = targetFootballer.getBounds().centerX;
//       const y = targetFootballer.getBounds().centerY;

//       this.match.ball.kick(
//         mapToRange(this.match.matchData.hostTeamData.passSpeed, 160, 300),
//         {
//           x,
//           y,
//         }
//       );
//     }
//   }

//   saveFreeKick() {
//     if (this.isAlreadySavedKick) return;
//     this.match.scene.soundManager.catchBall.play();
//     this.isAlreadySavedKick = true;

//     this.match.ball.stop();

//     this.wallPlayerTween?.pause();

//     this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
//     this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

//     this.match.hostTeam.boardFootballPlayers.middleColumn.stopMotion();
//     this.match.guestTeam.boardFootballPlayers.middleColumn.stopMotion();

//     setTimeout(() => {
//       this.match.matchManager.resumeMatchUfterKFreeKickOrPenalty(
//         this.whoIsGuilty
//       );
//     }, 1500);
//   }

//   destroy() {
//     this.wallPlayer?.destroy();
//     this.wallPlayerTween?.destroy();
//     this.shooterFootballer?.destroy();
//   }
// }

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
        y = 473 + getRandomIntNumber(110, 170);
      } else {
        y = 473 - getRandomIntNumber(110, 170);
      }
    } else {
      const isTop = getRandomIntNumber(0, 100);

      if (isTop > 50) {
        y = 473 + getRandomIntNumber(0, 130);
      } else {
        y = 473 - getRandomIntNumber(0, 130);
      }
    }

    if (this.teamWhoIsGuilty === "guest") {
      x =
        this.match.scene.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 40;
    } else {
      x =
        this.match.scene.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 40;
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
