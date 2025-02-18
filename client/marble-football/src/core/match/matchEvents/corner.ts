import Match from "..";
import { calculatePercentage, getRandomIntNumber } from "../../../utils/math";

export class Corner {
  attacker: Phaser.Physics.Arcade.Image;
  deffender: Phaser.Physics.Arcade.Image;
  fakeFootballer: Phaser.GameObjects.Image;

  ballX = 0;
  ballY = 0;

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
