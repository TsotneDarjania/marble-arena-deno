import CanvasScene from "../../../../../scenes/CanvasScene";
import GamePlay from "../../../../../scenes/GamePlay";
import { TeamDataType } from "../../../../../types/gameTypes";
import { getRandomIntNumber, mapToRange } from "../../../../../utils/math";
import BoardFootballPlayer from "../../footballplayers/boardFootballPlayer";

export default class BoardGoalKeeper extends BoardFootballPlayer {
  tween?: Phaser.Tweens.Tween;

  alreadyTouchBall = false;

  constructor(
    scene: GamePlay,
    x: number,
    y: number,
    teamData: TeamDataType,
    side: "left" | "right"
  ) {
    super(scene, x, y, teamData, {
      position: "goalKeeper",
      who: side === "left" ? "hostPlayer" : "guestPlayer",
    });
  }

  startMotion() {
    if (this.tween) {
      this.tween?.resume();
      return;
    }

    this.initialStartMotion();
  }

  private initialStartMotion() {
    this.tween = this.scene.tweens.add({
      targets: this,
      y: -55,
      duration: mapToRange(this.teamData.goalKeeperSpeed, 1200, 400),
      ease: Phaser.Math.Easing.Quadratic.InOut,
      onComplete: () => {
        this.tween = this.scene.tweens.add({
          targets: this,
          y: { from: -55, to: 52 },
          duration: mapToRange(this.teamData.goalKeeperSpeed, 1200, 400),
          ease: Phaser.Math.Easing.Quadratic.InOut,
          yoyo: true,
          repeat: -1,
        });
      },
    });
  }

  stopMotion() {
    this.tween?.pause();
  }

  reset() {
    this.alreadyTouchBall = false;
    this.tween?.destroy();
    this.tween = undefined;

    const x =
      this.playerData.who === "hostPlayer"
        ? -this.scene.match.stadium.innerFielddWidth / 2 - this.displayWidth / 2
        : this.scene.match.stadium.innerFielddWidth / 2 - this.displayWidth / 2;
    this.setPosition(x, 0);
  }

  touchBall() {
    if (this.alreadyTouchBall) return;
    this.scene.match.ball.stop();
    this.alreadyTouchBall = true;
    this.scene.match.matchManager.matchEvenetManager.goalKeeperTouchBall(this);
  }

  setBall() {
    this.scene.match.ball.stop();
    this.scene.match.ball.setPosition(
      this.getBounds().centerX +
        (this.playerData.who === "hostPlayer" ? +30 : -30),
      this.getBounds().centerY
    );
  }

  save() {
    this.scene.soundManager.goalKeeperJumpSound.play();
    this.scene.match.matchManager.comentatorManager.showCommentForGoalKeeper(
      this.playerData.who === "hostPlayer" ? "host" : "guest"
    );

    setTimeout(() => {
      this.alreadyTouchBall = false;
    }, 200);
    const canvasScene = this.scene.scene.get("CanvasScene") as CanvasScene;

    if (this.playerData.who === "hostPlayer") {
      canvasScene.showBallSaveIcon("left");
    } else {
      canvasScene.showBallSaveIcon("right");
    }
    this.makeShortPass();
  }

  saveToCorner(side: "top" | "bottom") {
    this.stopMotion();
    this.scene.match.ball.kick(150, {
      x:
        this.playerData.who === "hostPlayer"
          ? this.getBounds().centerX - getRandomIntNumber(60, 90)
          : this.getBounds().centerX + getRandomIntNumber(60, 90),
      y:
        side === "top"
          ? this.getBounds().centerY - getRandomIntNumber(150, 320)
          : this.getBounds().centerY + getRandomIntNumber(150, 320),
    });
  }
}
