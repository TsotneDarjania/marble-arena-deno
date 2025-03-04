import Match from "..";
import GamePlay from "../../../scenes/GamePlay";

export default class CollisionDetector {
  ballAndBordersCollider!: Phaser.Physics.Arcade.Collider;
  ballAndGoalPostsCollider!: Phaser.Physics.Arcade.Collider;

  constructor(public scene: GamePlay, public match: Match) {
    this.init();
  }

  init() {
    this.addDetectorForBallAndStadiumBoards();
    this.addDetectorForBallAndGoalPosts();
  }

  addDetectorForBallAndGoalPosts() {
    this.ballAndGoalPostsCollider = this.scene.physics.add.collider(
      this.match.ball,
      [...this.match.stadium.stadiumColliders.goalPostColliders],
      () => {
        if (
          this.match.matchManager.matchEvenetManager.matchStatus === "playing"
        ) {
          console.log("Goal Posts detect");
        }

        if (
          this.match.matchManager.matchEvenetManager.matchStatus === "isreeKick"
        ) {
          this.match.matchManager.freeKick!.stopFreeKick();
        }
      }
    );
    this.ballAndGoalPostsCollider.overlapOnly = false;
  }

  addDetectorForBallAndStadiumBoards() {
    this.ballAndBordersCollider = this.scene.physics.add.collider(
      this.match.ball,
      [...this.match.stadium.stadiumColliders.borderColliders],
      () => {
        if (
          this.match.matchManager.matchEvenetManager.matchStatus ===
          "CornerIsInProcess"
        ) {
          this.match.matchManager.corner!.stopCorner();
        }

        if (
          this.match.matchManager.matchEvenetManager.matchStatus === "isreeKick"
        ) {
          this.match.matchManager.freeKick!.stopFreeKick();
        }

        if (
          this.match.matchManager.matchEvenetManager.matchStatus === "isPenalty"
        ) {
          this.match.matchManager.penalty!.stopPenalty();
        }
      }
    );
    this.ballAndBordersCollider.overlapOnly = false;
  }

  removeColliderforBallAndStadiumBorders() {
    this.ballAndBordersCollider.overlapOnly = true;
  }

  removeColliderforBallAndGoalPosts() {
    this.ballAndGoalPostsCollider.overlapOnly = true;
  }
}
