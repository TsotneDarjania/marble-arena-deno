import Match from "..";
import GamePlay from "../../../scenes/GamePlay";

export default class CollisionDetector {
  constructor(public scene: GamePlay, public match: Match) {
    this.init();
  }

  init() {
    this.addDetectorForBallAndStadiumBoards();
    this.addDetectorForBallAndGoalPosts();
  }

  addDetectorForBallAndGoalPosts() {
    this.scene.physics.add.collider(
      this.match.ball,
      [...this.match.stadium.stadiumColliders.goalPostColliders],
      () => {
        console.log("Goal Posts detect");
      }
    );
  }

  addDetectorForBallAndStadiumBoards() {
    this.scene.physics.add.collider(
      this.match.ball,
      [...this.match.stadium.stadiumColliders.borderColliders],
      () => {
        console.log("Stadium Border Detect");

        if (this.match.matchManager.freeKick !== undefined) {
          this.match.matchManager.freeKick.saveFreeKick();
        }
      }
    );
  }
}
