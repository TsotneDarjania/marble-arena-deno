import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
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

  timeOut_1: NodeJS.Timeout;
  timeOut_2: NodeJS.Timeout;
  timeOut_3: NodeJS.Timeout;
  timeOut_4: NodeJS.Timeout;
  timeOut_5: NodeJS.Timeout;
  timeOut_6: NodeJS.Timeout;

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

    this.timeOut_4 = setTimeout(() => {
      this.kickFromCorner();
    }, 2000);
  }

  stopCorner() {
    this.match.matchManager.matchEvenetManager.matchStatus = "finishCorner";
    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.timeOut_1 = setTimeout(() => {
      this.destroyCorner();
    }, 1000);
  }

  destroyCorner() {
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
        this.match.matchManager.matchEvenetManager.resumeUfterCorner(
          this.teamWhoShootCorner === "hostTeam" ? "guest" : "host",
          this.isGoalScored
        );
        this.destroy();
        setTimeout(() => {
          this.match.scene.tweens.add({
            targets: bg,
            alpha: 0,
            delay: 300,
            duration: 500,
            onComplete: () => {
              clearTimeout(this.timeOut_1);
              clearTimeout(this.timeOut_2);
              clearTimeout(this.timeOut_3);
              clearTimeout(this.timeOut_4);
              clearTimeout(this.timeOut_5);
              bg.destroy();
            },
          });
        }, 300);
      },
    });
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

    this.timeOut_2 = setTimeout(() => {
      this.stopCorner();
    }, 4000);
  }

  kickFromCorner() {
    this.match.scene.soundManager.pass.play();
    setTimeout(() => {
      this.match.collisionDetector.addDetectorForBallAndStadiumBoards();
      this.match.collisionDetector.addDetectorForBallAndGoalPosts();
      this.match.matchManager.matchEvenetManager.matchStatus =
        "CornerIsInProcess";
    }, 300);
    const randomx =
      this.teamWhoShootCorner === "hostTeam"
        ? getRandomIntNumber(40, 130)
        : -getRandomIntNumber(40, 130);

    this.match.ball.kick(getRandomIntNumber(350, 400), {
      x: this.attacker.getBounds().centerX + randomx,
      y: this.attacker.getBounds().centerY,
    });

    const randomDeffenderX =
      this.teamWhoShootCorner === "hostTeam"
        ? getRandomIntNumber(20, 120)
        : -getRandomIntNumber(20, 120);

    this.match.scene.add.tween({
      targets: this.deffender,
      duration: getRandomIntNumber(300, 600),
      x: this.deffender.getBounds().centerX + randomDeffenderX,
    });

    const randomAttackerX =
      this.teamWhoShootCorner === "hostTeam"
        ? getRandomIntNumber(70, 140)
        : -getRandomIntNumber(70, 140);

    this.match.scene.add.tween({
      targets: this.attacker,
      duration: getRandomIntNumber(300, 600),
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
  }

  saveByGoalkeeper() {
    this.match.matchManager.matchEvenetManager.matchStatus = "finishCorner";
    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.timeOut_3 = setTimeout(() => {
      this.stopCorner();
    }, 1000);
  }

  shootByAttaker() {
    this.match.scene.soundManager.shoot.play();
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

    if (this.teamWhoShootCorner === "hostTeam") {
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

  saveByDefender() {
    this.match.scene.soundManager.catchBall.play();
    this.teamWhoShootCorner === "hostTeam"
      ? this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion()
      : this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.match.ball.stop();

    this.timeOut_5 = setTimeout(() => {
      this.stopCorner();
    }, 1000);
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
    const y =
      this.side === "top"
        ? this.match.scene.game.canvas.height / 2 - 50
        : this.match.scene.game.canvas.height / 2 + 50;

    this.deffender = this.match.scene.physics.add.image(
      x,
      y,
      this.teamWhoShootCorner === "hostTeam"
        ? this.match.matchData.guestTeamData.logoKey
        : this.match.matchData.hostTeamData.logoKey
    );
    this.deffender.setDepth(110);
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

    const y =
      this.side === "top"
        ? this.match.scene.game.canvas.height / 2 + 50
        : this.match.scene.game.canvas.height / 2 - 50;

    this.attacker = this.match.scene.physics.add.image(
      x,
      y,
      this.teamWhoShootCorner === "hostTeam"
        ? this.match.matchData.hostTeamData.logoKey
        : this.match.matchData.guestTeamData.logoKey
    );
    this.attacker.setDepth(110);
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
      this.teamWhoShootCorner === "hostTeam"
        ? this.match.matchData.hostTeamData.logoKey
        : this.match.matchData.guestTeamData.logoKey
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

  destroy() {
    // Destroy game objects
    if (this.attacker) {
      this.attacker.destroy();
    }
    if (this.deffender) {
      this.deffender.destroy();
    }
    if (this.fakeFootballer) {
      this.fakeFootballer.destroy();
    }

    // Clear references
    this.attacker = null as any;
    this.deffender = null as any;
    this.fakeFootballer = null as any;
  }
}
