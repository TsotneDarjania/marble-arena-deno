import GamePlay from "../../../../../scenes/GamePlay";
import { TeamDataType } from "../../../../../types/gameTypes";
import { mapToRange } from "../../../../../utils/math";
import BoardFootballPlayer from "../../footballplayers/boardFootballPlayer";

export default class BoardGoalKeeper extends BoardFootballPlayer {
  tween?: Phaser.Tweens.Tween;

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
    this.tween?.destroy();
    this.tween = undefined;

    const x =
      this.playerData.who === "hostPlayer"
        ? -this.scene.match.stadium.innerFielddWidth / 2 - this.displayWidth / 2
        : this.scene.match.stadium.innerFielddWidth / 2 - this.displayWidth / 2;
    this.setPosition(x, 0);
  }
}
