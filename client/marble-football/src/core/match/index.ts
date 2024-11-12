import GamePlay from "../../scenes/GamePlay";
import { Stadium } from "./stadium";

export default class Match {
  stadium: Stadium;

  constructor(public scene: GamePlay) {
    console.log("Match constructor");

    this.addStadium();
  }

  addStadium() {
    this.stadium = new Stadium(
      this.scene,
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2
    );
  }
}
