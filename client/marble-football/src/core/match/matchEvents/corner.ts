import Match from "..";
import {
  calculatePercentage,
  getRandomIntNumber,
  mapToRange,
} from "../../../utils/math";

export class Corner {
  attacker: Phaser.Physics.Arcade.Image;
  deffender: Phaser.Physics.Arcade.Image;
  fakeFootballer: Phaser.GameObjects.Image;

  ballX = 0;
  ballY = 0;

  isGoalScored = false;

  constructor(
    public match: Match,
    public side: "top" | "bottom",
    public teamWhoShootCorner: "hostTeam" | "guestTeam"
  ) {
    this.init();
  }

  init() {
    this.changeBallPosition();
    this.addFakeFootballer();
    this.addAttacker();
    this.addDefender();
    this.addColliderDetectors();
    this.addGoalEventListener();

    setTimeout(() => {
      this.kickFromCorner();
    }, 2000);
  }

  stopCorner() {
    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    setTimeout(() => {
      this.destroyCorner();
    }, 1000);
  }

  destroyCorner() {
    console.log("Destory Corner");
  }

  isGoal(whoScored: "host" | "guest") {
    this.match.stadium.startGoalSelebration(whoScored, 3000);
    this.match.ball.startBlinkAnimation();
    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    setTimeout(() => {
      this.stopCorner();
    }, 5000);
  }

  addGoalEventListener() {
    this.match.scene.events.on("update", () => {
      if (this.isGoalScored) return;

      if (
        this.match.ball.x <
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX -
          16
      ) {
        this.isGoal("guest");
        this.isGoalScored = true;
      }

      if (
        this.match.ball.x >
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX +
          16
      ) {
        this.isGoal("host");
        this.isGoalScored = true;
      }
    });
  }

  kickFromCorner() {
    setTimeout(() => {
      this.match.collisionDetector.addDetectorForBallAndStadiumBoards();
      this.match.matchManager.matchEvenetManager.matchStatus =
        "CornerIsInProcess";
    }, 300);
    const randomx =
      this.teamWhoShootCorner === "hostTeam"
        ? getRandomIntNumber(40, 130)
        : -getRandomIntNumber(40, 130);

    this.match.ball.kick(getRandomIntNumber(200, 260), {
      x: this.attacker.getBounds().centerX + randomx,
      y: this.attacker.getBounds().centerY,
    });

    const randomDeffenderX =
      this.teamWhoShootCorner === "hostTeam"
        ? getRandomIntNumber(20, 60)
        : -getRandomIntNumber(20, 60);

    this.match.scene.add.tween({
      targets: this.deffender,
      duration: getRandomIntNumber(300, 700),
      x: this.deffender.getBounds().centerX + randomDeffenderX,
    });

    const randomAttackerX =
      this.teamWhoShootCorner === "hostTeam"
        ? getRandomIntNumber(40, 120)
        : -getRandomIntNumber(40, 120);

    this.match.scene.add.tween({
      targets: this.attacker,
      duration: getRandomIntNumber(300, 700),
      x: this.attacker.getBounds().centerX + randomAttackerX,
    });
  }

  addColliderDetectors() {
    let isAlreadyDetect = false;

    this.match.scene.physics.add.overlap(
      this.match.ball,
      this.deffender,
      () => {
        if (isAlreadyDetect) return;
        isAlreadyDetect = true;
        this.saveByDefender();
      }
    );

    this.match.scene.physics.add.overlap(this.match.ball, this.attacker, () => {
      if (isAlreadyDetect) return;
      isAlreadyDetect = true;
      this.shootByAttaker();
    });

    this.match.scene.physics.add.overlap(
      this.match.ball,
      this.teamWhoShootCorner === "hostTeam"
        ? this.match.guestTeam.boardFootballPlayers.goalKeeper
        : this.match.hostTeam.boardFootballPlayers.goalKeeper,
      () => {
        if (isAlreadyDetect) return;
        isAlreadyDetect = true;
        this.saveByGoalkeeper();
      }
    );
  }

  saveByGoalkeeper() {
    this.match.ball.stop();
    setTimeout(() => {
      this.stopCorner();
    }, 1000);
  }

  shootByAttaker() {
    const teamData =
      this.teamWhoShootCorner === "hostTeam"
        ? this.match.matchData.hostTeamData
        : this.match.matchData.guestTeamData;
    let x = 0;
    const isfailShoot =
      getRandomIntNumber(0, 100) < teamData.shootAccuracy ? false : true;

    let y = 0;

    if (isfailShoot) {
      const isTop = getRandomIntNumber(0, 100);
      if (isTop > 50) {
        y =
          this.match.scene.match.stadium.stadiumField.getBounds().centerY +
          getRandomIntNumber(110, 170);
      } else {
        y =
          this.match.scene.match.stadium.stadiumField.getBounds().centerY -
          getRandomIntNumber(110, 170);
      }
    } else {
      const isTop = getRandomIntNumber(0, 100);

      if (isTop > 50) {
        y =
          this.match.scene.match.stadium.stadiumField.getBounds().centerY +
          getRandomIntNumber(0, 130);
      } else {
        y =
          this.match.scene.match.stadium.stadiumField.getBounds().centerY -
          getRandomIntNumber(0, 130);
      }
    }

    if (this.teamWhoShootCorner === "hostTeam") {
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

  saveByDefender() {
    this.match.ball.stop();
  }

  addDefender() {
    const x =
      this.teamWhoShootCorner === "hostTeam"
        ? this.ballX -
          calculatePercentage(
            getRandomIntNumber(14, 23),
            this.match.stadium.stadiumWidth
          )
        : this.ballX +
          calculatePercentage(
            getRandomIntNumber(14, 23),
            this.match.stadium.stadiumWidth
          );
    const y = this.match.scene.game.canvas.height / 2 - 50;

    this.deffender = this.match.scene.physics.add.image(
      x,
      y,
      this.match.ball.getBounds().centerX <
        this.match.scene.game.canvas.width / 2
        ? this.match.matchData.hostTeamData.logoKey
        : this.match.matchData.guestTeamData.logoKey
    );
    this.deffender.setScale(0.6);
    this.deffender.setCircle(30);
  }

  addAttacker() {
    const x =
      this.teamWhoShootCorner === "guestTeam"
        ? this.ballX +
          calculatePercentage(
            getRandomIntNumber(14, 23),
            this.match.stadium.stadiumWidth
          )
        : this.ballX -
          calculatePercentage(
            getRandomIntNumber(14, 23),
            this.match.stadium.stadiumWidth
          );

    const y = this.match.scene.game.canvas.height / 2 + 50;

    this.attacker = this.match.scene.physics.add.image(
      x,
      y,
      this.match.ball.getBounds().centerX <
        this.match.scene.game.canvas.width / 2
        ? this.match.matchData.guestTeamData.logoKey
        : this.match.matchData.hostTeamData.logoKey
    );
    this.attacker.setCircle(30);
    this.attacker.setScale(0.6);
  }

  addFakeFootballer() {
    const x =
      this.teamWhoShootCorner === "hostTeam"
        ? this.ballX + 20
        : this.ballX - 20;
    const y = this.side === "bottom" ? this.ballY + 20 : this.ballY - 20;

    this.fakeFootballer = this.match.scene.physics.add.image(
      x,
      y,
      this.match.ball.getBounds().centerX <
        this.match.scene.game.canvas.width / 2
        ? this.match.matchData.guestTeamData.logoKey
        : this.match.matchData.hostTeamData.logoKey
    );
    this.fakeFootballer.setScale(0.6);
  }

  changeBallPosition() {
    this.ballX =
      this.teamWhoShootCorner === "hostTeam"
        ? this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
            .centerX - 2
        : this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
            .centerX + 5;
    this.ballY =
      this.side === "bottom"
        ? this.match.scene.game.canvas.height / 2 +
          calculatePercentage(50, this.match.stadium.stadiumHeight) -
          37
        : this.match.scene.game.canvas.height / 2 -
          calculatePercentage(50, this.match.stadium.stadiumHeight) +
          34;

    this.match.ball.setPosition(this.ballX, this.ballY);
  }

  // changeBallPosition() {
  //   let x = 0;
  //   let y = 0;

  //   if (
  //     this.match.ball.getBounds().centerX <
  //     this.match.scene.game.canvas.width / 2
  //   ) {
  //     x =
  //       this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
  //         .centerX + 2;
  //     // fakeFootballer_x = x - 20;

  //     // defenderX =
  //     //   x +
  //     //   calculatePercentage(
  //     //     getRandomIntNumber(14, 23),
  //     //     this.match.stadium.stadiumWidth
  //     //   );

  //     // attackerX =
  //     //   x +
  //     //   calculatePercentage(
  //     //     getRandomIntNumber(14, 23),
  //     //     this.match.stadium.stadiumWidth
  //     //   );
  //   } else {
  //     x =
  //       this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
  //         .centerX - 5;
  //     // fakeFootballer_x = x + 20;

  //     // defenderX =
  //     //   x -
  //     //   calculatePercentage(
  //     //     getRandomIntNumber(14, 23),
  //     //     this.match.stadium.stadiumWidth
  //     //   );

  //     // attackerX =
  //     //   x -
  //     //   calculatePercentage(
  //     //     getRandomIntNumber(14, 23),
  //     //     this.match.stadium.stadiumWidth
  //     //   );
  //   }

  //   if (this.match.ball.getBounds().centerY < 474) {
  //     // console.log("y top");
  //     y =
  //       this.match.scene.game.canvas.height / 2 -
  //       calculatePercentage(50, this.match.stadium.stadiumHeight) +
  //       34;
  //     // fakeFootballer_y = y - 20;

  //     // defenderY = this.match.scene.game.canvas.height / 2 - 50;
  //     // attackerY = this.match.scene.game.canvas.height / 2 + 50;
  //   } else {
  //     // console.log("y bottom");

  //     y =
  //       this.match.scene.game.canvas.height / 2 +
  //       calculatePercentage(50, this.match.stadium.stadiumHeight) -
  //       37;
  //     fakeFootballer_y = y + 20;

  //     defenderY = this.match.scene.game.canvas.height / 2 + 50;
  //     attackerY = this.match.scene.game.canvas.height / 2 - 50;
  //   }

  //   this.deffender = this.match.scene.physics.add.image(
  //     defenderX,
  //     defenderY,
  //     this.match.ball.getBounds().centerX <
  //       this.match.scene.game.canvas.width / 2
  //       ? this.match.matchData.hostTeamData.logoKey
  //       : this.match.matchData.guestTeamData.logoKey
  //   );

  //   this.deffender.setCircle(30);

  //   let a = true;
  //   let once = true;
  //   this.match.scene.physics.add.overlap(
  //     this.match.ball,
  //     this.deffender,
  //     () => {
  //       if (once) {
  //         this.match.ball.stop();
  //         if (a === true) {
  //           this.match.scene.soundManager.catchBall.play();
  //           a = false;
  //         }

  //         setTimeout(() => {
  //           if (once) {
  //             console.log("RESET UFTER DEFFENDER");
  //             once = false;
  //             this.reset();
  //           }
  //         }, 1600);
  //       }
  //     }
  //   );

  //   this.attacker = this.match.scene.physics.add.image(
  //     attackerX,
  //     attackerY,
  //     this.match.ball.getBounds().centerX <
  //       this.match.scene.game.canvas.width / 2
  //       ? this.match.matchData.guestTeamData.logoKey
  //       : this.match.matchData.hostTeamData.logoKey
  //   );
  //   this.attacker.setCircle(30);

  //   this.fakeFootballer = this.match.scene.physics.add.image(
  //     fakeFootballer_x,
  //     fakeFootballer_y,
  //     this.match.ball.getBounds().centerX <
  //       this.match.scene.game.canvas.width / 2
  //       ? this.match.matchData.guestTeamData.logoKey
  //       : this.match.matchData.hostTeamData.logoKey
  //   );

  //   let once_2 = true;
  //   this.match.scene.physics.add.overlap(this.match.ball, this.attacker, () => {
  //     if (once_2) {
  //       once_2 = false;
  //       let x = 0;
  //       let y =
  //         this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
  //           .centerY;

  //       if (this.shootSide === "right") {
  //         x =
  //           this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
  //             .centerX + 40;
  //       } else {
  //         x =
  //           this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
  //             .centerX - 40;
  //       }
  //       this.match.scene.soundManager.shoot.play();

  //       this.match.ball.kick(300, { x, y });
  //     }
  //   });

  //   this.deffender.setScale(0.6);
  //   this.attacker.setScale(0.6);
  //   this.fakeFootballer.setScale(0.6);

  //   this.match.ball.setPosition(x, y);

  //   setTimeout(() => {
  //     this.shoot(this.shootSide);
  //   }, 1600);
  // }

  // shoot(side: "left" | "right") {
  //   this.match.scene.soundManager.shoot.play();

  //   this.cornerAlreadyShoot = true;
  //   this.match.scene.tweens.add({
  //     targets: this.deffender,
  //     x: {
  //       from: this.deffender.x,
  //       to:
  //         side === "left"
  //           ? this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
  //               .x + getRandomIntNumber(70, 200)
  //           : this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
  //               .x - getRandomIntNumber(70, 200),
  //     },
  //     duration: 500,
  //     ease: Phaser.Math.Easing.Quadratic.InOut,
  //   });

  //   this.match.scene.tweens.add({
  //     targets: this.attacker,
  //     x: {
  //       from: this.attacker.x,
  //       to:
  //         side === "left"
  //           ? this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
  //               .x + getRandomIntNumber(70, 150)
  //           : this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
  //               .x - getRandomIntNumber(70, 150),
  //     },
  //     duration: 1400,
  //     ease: Phaser.Math.Easing.Quadratic.InOut,
  //   });

  //   this.match.ball.kick(
  //     mapToRange(
  //       side === "left"
  //         ? this.match.matchData.guestTeamData.passSpeed
  //         : this.match.matchData.hostTeamData.passSpeed,
  //       250,
  //       500
  //     ),
  //     {
  //       x:
  //         side === "left"
  //           ? this.attacker.getBounds().centerX - getRandomIntNumber(20, 90)
  //           : this.attacker.getBounds().centerX + getRandomIntNumber(20, 90),
  //       y: this.attacker.getBounds().centerY,
  //     }
  //   );
  // }

  destroy() {
    this.attacker.destroy();
    this.deffender.destroy();
    this.fakeFootballer.destroy();
  }

  reset() {
    this.attacker.destroy();
    this.deffender.destroy();

    this.match.ball.stop();
  }
}
