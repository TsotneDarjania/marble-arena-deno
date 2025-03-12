import { Tweens } from "phaser";
import GamePlay from "../../../../../scenes/GamePlay";
import {
  FootballPlayerData,
  TeamDataType,
} from "../../../../../types/gameTypes";
import { getRandomIntNumber, mapToRange } from "../../../../../utils/math";
import { Column } from "../../core/boardFootballPlayers/columnt";
import BoardGoalKeeper from "../../core/boardFootballPlayers/boardGoolKeeper";

export default class BoardFootballPlayer extends Phaser.GameObjects.Container {
  image: Phaser.Physics.Arcade.Image;
  selector: Phaser.GameObjects.Image;
  targetSelector: Phaser.GameObjects.Image;

  // States
  withBall = false;
  aleradySentTakeBallDesire = false;

  freeKickTween!: Tweens.Tween;
  targetSelectorTween!: Tweens.Tween;

  isFreeKickBehaviour = false;

  isDeactive = false;

  constructor(
    public scene: GamePlay,
    x: number,
    y: number,
    public teamData: TeamDataType,
    public playerData: FootballPlayerData
  ) {
    super(scene, x, y);

    this.init();
  }

  init() {
    this.setScale(0.6);
    this.addSelector();
    this.createTargetSelector();
    this.addImage();
    this.addColliderDetector();

    this.setDepth(100);
  }

  createTargetSelector() {
    this.targetSelector = this.scene.add.image(0, 0, "circle");
    this.targetSelector.setTint(0xdbcd00);
    this.targetSelector.setScale(0.88);
    this.targetSelector.setAlpha(0);

    this.add(this.targetSelector);
  }

  showTargetSelector() {
    if (this.targetSelectorTween) {
      this.targetSelectorTween.stop();
    }

    this.targetSelector.setAlpha(0); // Reset alpha before starting the tween

    this.targetSelectorTween = this.scene.tweens.add({
      targets: this.targetSelector,
      duration: 300,
      alpha: 1,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.targetSelector,
          duration: 300,
          alpha: 0,
          delay: 500,
        });
      },
    });
  }

  defineShortAndLongPassVariants() {
    // For Host Team
    if (
      this.playerData.position === "goalKeeper" &&
      this.playerData.who === "hostPlayer"
    ) {
      this.playerData.potentialShortPassVariants =
        this.scene.match.hostTeam.boardFootballPlayers.defenceColumn.footballers;
    }
    if (
      this.playerData.position === "defender" &&
      this.playerData.who === "hostPlayer"
    ) {
      this.playerData.potentialShortPassVariants =
        this.scene.match.hostTeam.boardFootballPlayers.middleColumn.footballers;
    }
    if (
      this.playerData.position === "defender" &&
      this.playerData.who === "hostPlayer"
    ) {
      this.playerData.potentialLongPassVariants =
        this.scene.match.hostTeam.boardFootballPlayers.attackColumn.footballers;
    }

    if (
      this.playerData.position === "middfielder" &&
      this.playerData.who === "hostPlayer"
    ) {
      this.playerData.potentialShortPassVariants =
        this.scene.match.hostTeam.boardFootballPlayers.attackColumn.footballers;
    }

    // For Guest Team
    if (
      this.playerData.position === "goalKeeper" &&
      this.playerData.who === "guestPlayer"
    ) {
      this.playerData.potentialShortPassVariants =
        this.scene.match.guestTeam.boardFootballPlayers.defenceColumn.footballers;
    }
    if (
      this.playerData.position === "defender" &&
      this.playerData.who === "guestPlayer"
    ) {
      this.playerData.potentialShortPassVariants =
        this.scene.match.guestTeam.boardFootballPlayers.middleColumn.footballers;
    }
    if (
      this.playerData.position === "defender" &&
      this.playerData.who === "guestPlayer"
    ) {
      this.playerData.potentialLongPassVariants =
        this.scene.match.guestTeam.boardFootballPlayers.attackColumn.footballers;
    }

    if (
      this.playerData.position === "middfielder" &&
      this.playerData.who === "guestPlayer"
    ) {
      this.playerData.potentialShortPassVariants =
        this.scene.match.guestTeam.boardFootballPlayers.attackColumn.footballers;
    }
  }

  addImage() {
    this.image = this.scene.physics.add.image(0, 0, this.teamData.logoKey);
    this.image.setCircle(30);
    this.add(this.image);
  }

  addColliderDetector() {
    this.scene.match.scene.physics.add.overlap(
      this.scene.match.ball,
      this.image,
      () => {
        if (
          this.scene.match.matchManager.matchEvenetManager.matchStatus ===
          "playing"
        ) {
          if (this.playerData.position !== "goalKeeper") {
            if (this.aleradySentTakeBallDesire) return;
            this.aleradySentTakeBallDesire = true;
            if (
              this.isFreeKickBehaviour &&
              this.playerData.position === "defender"
            ) {
              this.scene.match.matchManager.matchEvenetManager.makePenalty(
                this
              );
              this.stopFreeKickBehaviour();
              return;
            }

            if (this.isFreeKickBehaviour) {
              this.scene.match.matchManager.matchEvenetManager.makefreeKick(
                this
              );
              this.stopFreeKickBehaviour();
              return;
            }
            this.takeBall();
          }

          if (this instanceof BoardGoalKeeper) {
            this.touchBall();
          }
        }

        if (
          this.scene.match.matchManager.matchEvenetManager.matchStatus ===
          "isPenalty"
        ) {
          if (this instanceof BoardGoalKeeper) {
            this.scene.match.matchManager.penalty!.stopPenalty();
          }
        }

        if (
          this.scene.match.matchManager.matchEvenetManager.matchStatus ===
          "isLastPenalties"
        ) {
          if (this instanceof BoardGoalKeeper) {
            if (
              this.scene.match.matchManager.lastPenalties!.canCheckIfIsGoal ===
              false
            )
              return;
            if (
              this.scene.match.matchManager.lastPenalties!.whosTurn ===
                "host" &&
              this.playerData.who === "guestPlayer"
            ) {
              this.scene.match.matchManager.lastPenalties!.save();
            }

            if (
              this.scene.match.matchManager.lastPenalties!.whosTurn ===
                "guest" &&
              this.playerData.who === "hostPlayer"
            ) {
              this.scene.match.matchManager.lastPenalties!.save();
            }
          }
        }

        if (
          this.scene.match.matchManager.matchEvenetManager.matchStatus ===
          "CornerIsInProcess"
        ) {
          if (this instanceof BoardGoalKeeper) {
            this.scene.match.matchManager.corner!.saveByGoalkeeper();
          }
        }

        if (
          this.scene.match.matchManager.matchEvenetManager.matchStatus ===
            "isreeKick" &&
          this.scene.match.matchManager.freeKick !== undefined &&
          this.isDeactive === false
        ) {
          const playerTeamIs =
            this.playerData.who === "hostPlayer" ? "host" : "guest";
          if (
            playerTeamIs ===
            this.scene.match.matchManager.freeKick.teamWhoIsGuilty
          )
            this.scene.match.matchManager.freeKick.save();
        }
      }
    );
  }

  addSelector() {
    this.selector = this.scene.add.image(0, 0, "circle");
    this.selector.setTint(0x48f526);
    this.selector.setScale(0.88);
    this.selector.setAlpha(0);

    this.add(this.selector);
  }

  takeBall() {
    if (
      this.scene.match.matchManager.matchEvenetManager.matchStatus !== "playing"
    )
      return;

    if (this.playerData.position === "defender") {
      let cornerRandom = getRandomIntNumber(0, 100);
      if (
        this.playerData.who === "hostPlayer" &&
        this.scene.match.matchManager.teamWhoHasBall === "hostTeam"
      ) {
        cornerRandom = -1;
      }
      if (
        this.playerData.who === "guestPlayer" &&
        this.scene.match.matchManager.teamWhoHasBall === "guestTeam"
      ) {
        cornerRandom = -1;
      }
      if (
        this.playerData.who === "hostPlayer" &&
        this.scene.match.ball.getBounds().centerX < this.getBounds().centerX
      ) {
        cornerRandom = -1;
      }
      if (
        this.playerData.who === "guestPlayer" &&
        this.scene.match.ball.getBounds().centerX > this.getBounds().centerX
      ) {
        cornerRandom = -1;
      }
      if (cornerRandom > 90) {
        const side = this.scene.match.ball.y > 474 ? "bottom" : "top";
        this.scene.match.matchManager.matchEvenetManager.footballerSaveToCorner(
          side
        );

        this.scene.match.ball.kick(150, {
          x:
            this.playerData.who === "hostPlayer"
              ? this.scene.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
                  .centerX - getRandomIntNumber(60, 110)
              : this.scene.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
                  .centerX + getRandomIntNumber(60, 110),
          y:
            side === "top"
              ? 473 - getRandomIntNumber(190, 230)
              : 473 + getRandomIntNumber(190, 230),
        });
      }

      // For Commentator
      const random = getRandomIntNumber(0, 100);
      random > 80 &&
        this.scene.match.matchManager.comentatorManager.showCommentForDefennder(
          this.playerData.who === "hostPlayer" ? "host" : "guest"
        );
    }

    if (
      this.scene.match.matchManager.matchEvenetManager.matchStatus !== "playing"
    )
      return;

    this.scene.match.matchManager.matchEvenetManager.footballerTakeBall(this);

    this.selectorOnn();
    this.scene.match.ball.stop();

    if ((this.parentContainer as Column).isInMotion) {
      if ((this.parentContainer as Column).toBottom) {
        this.scene.match.ball.goTowardFootballer(
          this.getBounds().centerX,
          this.getBounds().centerY +
            (this.parentContainer as Column).tweenDuration * 0.3
        );
      } else {
        this.scene.match.ball.goTowardFootballer(
          this.getBounds().centerX,
          this.getBounds().centerY -
            (this.parentContainer as Column).tweenDuration * 0.3
        );
      }
    } else {
      this.scene.match.ball.goTowardFootballer(
        this.getBounds().centerX,
        this.getBounds().centerY
      );
    }

    setTimeout(() => {
      this.scene.match.ball.goTowardFootballer(
        this.getBounds().centerX,
        this.getBounds().centerY
      );
    }, 100);
    setTimeout(() => {
      this.scene.match.ball.goTowardFootballer(
        this.getBounds().centerX,
        this.getBounds().centerY
      );
    }, 200);
    setTimeout(() => {
      this.scene.match.ball.goTowardFootballer(
        this.getBounds().centerX,
        this.getBounds().centerY
      );
    }, 300);

    setTimeout(() => {
      if (
        this.scene.match.matchManager.matchEvenetManager.matchStatus !==
        "playing"
      )
        return;
      this.makeDesition();
    }, 400);
  }

  makeDesition() {
    if (
      this.scene.match.matchManager.matchEvenetManager.matchStatus !== "playing"
    )
      return;
    this.selectorOff();

    if (
      this.scene.match.matchManager.matchEvenetManager.matchStatus === "playing"
    ) {
      const changeToMakeShortPass = getRandomIntNumber(0, 100);

      switch (this.playerData.position) {
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

      setTimeout(() => {
        this.withBall = false;
        this.aleradySentTakeBallDesire = false;
      }, 500);
    }
  }

  makeShortPass() {
    this.scene.soundManager.pass.play();

    const anotherFootballer =
      this.playerData.potentialShortPassVariants![
        getRandomIntNumber(
          0,
          this.playerData.potentialShortPassVariants!.length
        )
      ];

    anotherFootballer.showTargetSelector();

    const { x, y } = this.getAnotherFootballerPositions(anotherFootballer);

    this.scene.match.ball.kick(mapToRange(this.teamData.passSpeed, 160, 300), {
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

    this.scene.match.ball.kick(mapToRange(this.teamData.passSpeed, 160, 300), {
      x,
      y,
    });
  }

  shoot() {
    this.scene.soundManager.shoot.play();

    const random = getRandomIntNumber(0, 100);
    random > 80 &&
      this.scene.match.matchManager.comentatorManager.showCommentForShooter(
        this.playerData.who === "hostPlayer" ? "host" : "guest"
      );

    let x = 0;
    const isfailShoot =
      getRandomIntNumber(0, 100) < this.teamData.shootAccuracy ? false : true;

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

    if (this.playerData.who === "hostPlayer") {
      x =
        this.scene.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 10;
    } else {
      x =
        this.scene.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 10;
    }
    this.scene.match.ball.kick(mapToRange(this.teamData.shootSpeed, 250, 500), {
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

    this.image.setTint(0xfa580a);

    this.image.alpha = 0.5;

    this.freeKickTween = this.scene.add.tween({
      targets: this.selector,
      alpha: 1,
      duration: 300,
      repeat: 9,
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
    this.image.setTint(0xffffff);

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
