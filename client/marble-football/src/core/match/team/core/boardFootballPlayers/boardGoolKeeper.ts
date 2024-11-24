import GamePlay from "../../../../../scenes/GamePlay";
import { TeamDataType } from "../../../../../types/gameTypes";
import { calculatePercentage } from "../../../../../utils/math";
import BoardFootballPlayer from "../../footballplayers/boardFootballPlayer";

export default class BoardGoalKeeper extends BoardFootballPlayer {
  tween: Phaser.Tweens.Tween;

  constructor(scene: GamePlay, x: number, y: number, teamData: TeamDataType) {
    super(scene, x, y, teamData);
  }

  startMotion() {
    this.tween = this.scene.tweens.add({
      targets: this,
      y: { from: -55, to: 46 },
      duration: 1000,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      yoyo: true,
      repeat: -1,
    });
    // Start fom 50% of the duration
    this.tween.seek(calculatePercentage(50, 1000));
  }
}