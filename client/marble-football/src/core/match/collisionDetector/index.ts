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
        this.scene.soundManager.goalBorder.play();
        console.log("Goal Posts detect");
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
