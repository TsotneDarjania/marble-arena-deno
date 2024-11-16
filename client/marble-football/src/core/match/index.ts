import GamePlay from "../../scenes/GamePlay";
import { Stadium } from "./stadium";

export default class Match {
  stadium: Stadium;

  constructor(public scene: GamePlay) {
    this.addStadium();
    this.setFanColors();
  }

  addStadium() {
    this.stadium = new Stadium(
      this.scene,
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2
    );
  }

  setFanColors() {
    this.stadium.spectators.fanColors = {
      hostColor: 0x205c5c,
      guestColor: 0x5c205c,
      hostQuantityPercent: 45,
    };
  }

  goalSelebration() {
    this.stadium.goalSelebration("host");
  }
}
