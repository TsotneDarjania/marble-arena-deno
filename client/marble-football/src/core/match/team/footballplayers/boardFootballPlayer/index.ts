import { Tweens } from "phaser";
import Match from "../../..";
import GamePlay from "../../../../../scenes/GamePlay";
import {
  FootballPlayerData,
  TeamDataType,
} from "../../../../../types/gameTypes";
import { getRandomIntNumber, mapToRange } from "../../../../../utils/math";

export default class BoardFootballPlayer extends Phaser.GameObjects.Container {
  image: Phaser.Physics.Arcade.Image;
  selector: Phaser.GameObjects.Image;
  match: Match;

  freeKickTween: Tweens.Tween;

  withBall = false;

  playerData: FootballPlayerData;

  isFreeKickBehaviour = false;

  isDeactive = false;

  isFreeKick = false;

  isPenalty = false;

  isFreeKickShooter = false;

  constructor(
    public scene: GamePlay,
    x: number,
    y: number,
    public teamData: TeamDataType
  ) {
    super(scene, x, y);

    this.init();
  }

  init() {
    this.setScale(0.6);
    this.addSelector();
    this.addImage();

    this.setDepth(100);
  }

  addImage() {
    this.image = this.scene.physics.add.image(0, 0, this.teamData.logoKey);
    this.image.setCircle(30);
    this.add(this.image);
  }

  addSelector() {
    this.selector = this.scene.add.image(0, 0, "circle");
    this.selector.setTint(0x48f526);
    this.selector.setScale(0.88);
    this.selector.setAlpha(0);

    this.add(this.selector);
  }

  saveFreeKickShoot() {
    this.match.matchManager.freeKick!.saveFreeKick();
  }

  addCollider() {
    this.scene.physics.add.overlap(this.match.ball, this.image, () => {
      if (this.playerData.position === "goalKeeper") {
        if (this.match.matchManager.isCorner) {
          this.match.ball.stop();
          this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
          this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

          setTimeout(() => {
            if (this.match.matchManager.isCorner) {
              this.match.matchManager.isCorner = false;
              this.match.matchManager.resumeMatchUfterKFreeKickOrPenalty(
                this.playerData.who === "guestPlayer" ? "guest" : "host"
              );
            }
          }, 1000);
        }
      }

      if (this.match.matchManager.ballGoesForCorner) return;

      if (this.isFreeKickShooter) {
        this.shoot();
      }
      if (this.isFreeKick) {
        this.saveFreeKickShoot();
        this.isFreeKick = false;
        return;
      }
      if (this.isPenalty) {
        this.match.matchManager.penalty?.savePenalty();
        this.isPenalty = false;
        return;
      }
      if (this.isDeactive) return;
      if (!this.withBall) {
        this.withBall = true;
        if (this.isFreeKickBehaviour)
          this.match.matchManager.prepareFreeKick(
            this.playerData.position,
            this.playerData.who
          );
        this.playerData.position === "goalKeeper"
          ? this.save()
          : this.takeBall();
      }
    });
  }

  set setMatch(match: Match) {
    this.match = match;
  }

  save() {
    if (this.match.matchManager.isGoalSelebration) return;
    this.scene.soundManager.catchBall.play();

    if (this.playerData.who === "guestPlayer") {
      this.match.guestTeam.footballers.forEach((f) => {
        f.stopFreeKickBehaviour();
      });
      this.match.hostTeam.footballers.forEach((f) => {
        f.stopFreeKickBehaviour();
      });
    }

    if (this.match.matchManager.matchStatus !== "playing") return;
    this.match.matchManager.someoneHasBall = true;

    this.selectorOnn();
    this.match.ball.stop();
    this.match.matchManager.someoneTakeBall(this);
    this.makeDesition();
  }

  takeBall() {
    this.scene.soundManager.catchBall.play();

    this.match.hostTeam.stopMotion();
    this.match.guestTeam.stopMotion();

    if (this.playerData.who === "hostPlayer") {
      this.match.matchManager.teamWhoHasBall = "hostTeam";
    }
    if (this.playerData.who === "guestPlayer") {
      this.match.matchManager.teamWhoHasBall = "guestTeam";
    }

    this.match.matchManager.someoneHasBall = true;
    if (this.match.matchManager.matchStatus !== "playing") return;

    // Corner Possibility
    if (this.playerData.position === "defender") {
      let cornerIsPossible = true;

      if (this.playerData.who === "hostPlayer") {
        if (this.match.ball.getBounds().centerX < this.getBounds().centerX) {
          cornerIsPossible = false;
        }
      } else {
        if (this.match.ball.getBounds().centerX > this.getBounds().centerX) {
          cornerIsPossible = false;
        }
      }

      if (cornerIsPossible) {
        const isCorner = getRandomIntNumber(0, 100) > 80 ? true : false;
        if (isCorner) {
          this.match.matchManager.ballGoesForCorner = true;
          this.shootBallToCorner();
          return;
        }
      }
    }

    this.selectorOnn();

    this.match.ball.stop();
    this.match.ball.goTowardFootballer(this);

    this.match.matchManager.someoneTakeBall(this);

    setTimeout(() => {
      this.makeDesition();
    }, 300);
  }

  shootBallToCorner() {
    let x = 0;
    let y = 0;

    this.match.hostTeam.footballers.map((f) => {
      f.stopFreeKickBehaviour();
    });
    this.match.guestTeam.footballers.map((f) => {
      f.stopFreeKickBehaviour();
    });

    if (this.playerData.who === "hostPlayer") {
      x =
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 50;
    } else {
      x =
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 50;
    }

    y = this.scene.game.canvas.height / 2;

    const randomY = getRandomIntNumber(200, 230);

    this.getBounds().centerY >
    this.match.stadium.stadiumField.getBounds().centerY
      ? (y += randomY)
      : (y -= randomY);

    this.match.ball.kick(160, { x, y });
  }

  makeDesition() {
    if (this.match.matchManager.matchStatus !== "playing") return;
    this.selectorOff();

    if (this.match.matchManager.matchStatus === "playing") {
      const changeToMakeShortPass = getRandomIntNumber(0, 100);

      switch (this.playerData.position) {
        case "goalKeeper":
          this.makePassAsGoalKeeper();
          break;
        case "defender":
          changeToMakeShortPass > 50
            ? this.makeShortPass()
            : this.makeLongPass();
          break;
        case "middfielder":
          this.makeShortPass();
          break;
        case "attacker":
          this.shoot();
          break;
      }

      this.match.matchManager.someoneHasBall = false;

      setTimeout(() => {
        this.withBall = false;
      }, 500);
    }
  }

  makePassAsGoalKeeper() {
    this.scene.soundManager.pass.play();

    if (this.playerData.who === "hostPlayer") {
      const { x, y } = this.getAnotherFootballerPositions(
        this.match.hostTeam.boardFootballPlayers.defenceColumn.footballers[
          getRandomIntNumber(
            0,
            this.match.hostTeam.boardFootballPlayers.defenceColumn.footballers!
              .length - 1
          )
        ]
      );

      this.match.ball.kick(mapToRange(this.teamData.passSpeed, 160, 300), {
        x,
        y,
      });
    } else {
      const { x, y } = this.getAnotherFootballerPositions(
        this.match.guestTeam.boardFootballPlayers.defenceColumn.footballers[
          getRandomIntNumber(
            0,
            this.match.hostTeam.boardFootballPlayers.defenceColumn.footballers!
              .length - 1
          )
        ]
      );

      this.match.ball.kick(mapToRange(this.teamData.passSpeed, 160, 300), {
        x,
        y,
      });
    }
  }

  makeShortPass() {
    this.scene.soundManager.pass.play();

    const { x, y } = this.getAnotherFootballerPositions(
      this.playerData.potentialShortPassVariants![
        getRandomIntNumber(
          0,
          this.playerData.potentialShortPassVariants!.length
        )
      ]
    );

    this.match.ball.kick(mapToRange(this.teamData.passSpeed, 160, 300), {
      x,
      y,
    });
  }

  makeLongPass() {
    this.scene.soundManager.pass.play();

    const { x, y } = this.getAnotherFootballerPositions(
      this.playerData.potentialShortPassVariants![
        getRandomIntNumber(
          0,
          this.playerData.potentialShortPassVariants!.length
        )
      ]
    );

    this.match.ball.kick(mapToRange(this.teamData.passSpeed, 160, 300), {
      x,
      y,
    });
  }

  shoot() {
    this.scene.soundManager.shoot.play();

    this.isFreeKickShooter = false;
    let x = 0;

    // let y =
    //   this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerY +
    //   getRandomIntNumber(-180, 180);
    const isfailShoot =
      getRandomIntNumber(0, 100) < this.teamData.shootAccuracy ? false : true;

    let y = 0;

    if (isfailShoot) {
      const isTop = getRandomIntNumber(0, 100);
      if (isTop > 50) {
        y =
          this.match.stadium.stadiumField.getBounds().centerY +
          getRandomIntNumber(140, 170);
      } else {
        y =
          this.match.stadium.stadiumField.getBounds().centerY -
          getRandomIntNumber(140, 170);
      }
    } else {
      const isTop = getRandomIntNumber(0, 100);

      if (isTop > 50) {
        y =
          this.match.stadium.stadiumField.getBounds().centerY +
          getRandomIntNumber(0, 130);
      } else {
        y =
          this.match.stadium.stadiumField.getBounds().centerY -
          getRandomIntNumber(0, 130);
      }
    }

    if (this.playerData.who === "hostPlayer") {
      x =
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 40;
    } else {
      x =
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 40;
    }
    this.match.ball.kick(mapToRange(this.teamData.shootSpeed, 250, 500), {
      x,
      y,
    });
  }

  getAnotherFootballerPositions(footballer: BoardFootballPlayer) {
    return {
      x: footballer.getBounds().centerX,
      y: footballer.getBounds().centerY,
    };
  }

  selectorOnn() {
    this.scene.add.tween({
      targets: this.selector,
      alpha: 1,
      duration: 200,
    });
  }

  selectorOff() {
    this.scene.add.tween({
      targets: this.selector,
      alpha: 0,
      duration: 200,
    });
  }

  public startFreeKickBehaviour() {
    if (this.isFreeKickBehaviour) return;

    this.isFreeKickBehaviour = true;
    this.selector.setTint(0xeb1611);

    this.image.alpha = 0.5;

    this.freeKickTween = this.scene.add.tween({
      targets: this.selector,
      alpha: 1,
      duration: 400,
      repeat: 5,
      yoyo: true,
      onComplete: () => {
        this.stopFreeKickBehaviour();
      },
    });
  }

  stopFreeKickBehaviour() {
    this.isFreeKickBehaviour = false;
    this.selector.setTint(0x48f526);
    this.selector.setAlpha(0);
    this.image.alpha = 1;

    this.freeKickTween?.destroy();
  }

  deactive() {
    this.setAlpha(0);
    this.isDeactive = true;
  }

  activate() {
    this.setAlpha(1);
    this.isDeactive = false;
  }
}
