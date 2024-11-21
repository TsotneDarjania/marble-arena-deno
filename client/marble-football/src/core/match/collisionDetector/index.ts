import Match from "..";
import GamePlay from "../../../scenes/GamePlay";

export default class CollisionDetector {
  constructor(public scene: GamePlay, public match: Match) {
    this.init();
  }

  init() {
    this.addDetectorForBallAndStadiumBoards();
  }

  addDetectorForBallAndStadiumBoards() {
    this.scene.physics.add.collider(
      this.match.ball,
      [...this.match.stadium.stadiumColliders.borderColliders],
      () => {
        console.log("Detect");
      }
    );
  }
}
