import { Tweens } from "phaser";
import Match from "../../..";
import GamePlay from "../../../../../scenes/GamePlay";
import {
  FootballPlayerData,
  TeamDataType,
} from "../../../../../types/gameTypes";
import { getRandomIntNumber } from "../../../../../utils/math";

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
    scene: GamePlay,
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
            this.match.matchManager.resumeMatchUfterKFreeKickOrPenalty(
              this.playerData.who === "guestPlayer" ? "host" : "guest"
            );
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
        this.match.matchManager.penalty!.savePenalty();
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
        const isCorner = getRandomIntNumber(0, 100) > 0 ? true : false;
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
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerX;
    } else {
      x =
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX;
    }

    y = this.scene.game.canvas.height / 2;

    const randomY = getRandomIntNumber(200, 230);
    getRandomIntNumber(0, 100) >= 50 ? (y += randomY) : (y -= randomY);

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

      this.match.ball.kick(200, {
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

      this.match.ball.kick(200, {
        x,
        y,
      });
    }
  }

  makeShortPass() {
    const { x, y } = this.getAnotherFootballerPositions(
      this.playerData.potentialShortPassVariants![
        getRandomIntNumber(
          0,
          this.playerData.potentialShortPassVariants!.length
        )
      ]
    );

    this.match.ball.kick(200, {
      x,
      y,
    });
  }

  makeLongPass() {
    const { x, y } = this.getAnotherFootballerPositions(
      this.playerData.potentialShortPassVariants![
        getRandomIntNumber(
          0,
          this.playerData.potentialShortPassVariants!.length
        )
      ]
    );

    this.match.ball.kick(200, {
      x,
      y,
    });
  }

  shoot() {
    this.isFreeKickShooter = false;
    let x = 0;
    let y =
      this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerY;

    if (this.playerData.who === "hostPlayer") {
      x =
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 40;
    } else {
      x =
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 40;
    }

    this.match.ball.kick(300, { x, y });
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
