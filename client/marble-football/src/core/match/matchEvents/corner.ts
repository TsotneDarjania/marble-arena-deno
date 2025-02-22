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

  timeOut_1: NodeJS.Timeout;
  timeOut_2: NodeJS.Timeout;
  timeOut_3: NodeJS.Timeout;
  timeOut_4: NodeJS.Timeout;
  timeOut_5: NodeJS.Timeout;
  timeOut_6: NodeJS.Timeout;
  overlapGoalkeeper: Phaser.Physics.Arcade.Collider;

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
      .setDepth(100)
      .setTint(0x000000)
      .setScale(100)
      .setAlpha(0);

    this.match.scene.tweens.add({
      targets: bg,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.match.matchManager.matchEvenetManager.resumeUfterCorner(
          this.teamWhoShootCorner === "hostTeam" ? "guest" : "host",
          this.isGoalScored
        );
        this.destroy();
        setTimeout(() => {
          this.match.scene.tweens.add({
            targets: bg,
            alpha: 0,
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
    this.match.stadium.startGoalSelebration(whoScored, 2000);
    this.match.ball.startBlinkAnimation();
    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.timeOut_2 = setTimeout(() => {
      this.stopCorner();
    }, 4000);
  }

  addGoalEventListener() {
    this.match.scene.events.on("update", () => {
      if (this.isGoalScored) return;
      if (
        this.match.matchManager.matchEvenetManager.matchStatus !==
        "CornerIsInProcess"
      )
        return;

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

    this.overlapGoalkeeper = this.match.scene.physics.add.overlap(
      this.match.ball,
      this.teamWhoShootCorner === "hostTeam"
        ? this.match.guestTeam.boardFootballPlayers.goalKeeper.image
        : this.match.hostTeam.boardFootballPlayers.goalKeeper.image,
      () => {
        alert("Save corner");
        this.saveByGoalkeeper();
        this.overlapGoalkeeper?.destroy();
      }
    );
  }

  saveByGoalkeeper() {
    this.match.ball.stop();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.timeOut_3 = setTimeout(() => {
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
    this.overlapGoalkeeper?.destroy();

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
