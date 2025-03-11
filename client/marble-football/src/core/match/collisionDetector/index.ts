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
          this.scene.soundManager.goalBorder.play();
        }

        // if (
        //   this.match.matchManager.matchEvenetManager.matchStatus === "isreeKick"
        // ) {
        //   this.match.matchManager.freeKick!.stopFreeKick();
        //   this.scene.soundManager.goalBorder.play();
        // }

        if (
          this.match.matchManager.matchEvenetManager.matchStatus ===
          "isLastPenalties"
        ) {
          if (this.match.matchManager.lastPenalties!.canCheckIfIsGoal === false)
            return;
          // this.match.matchManager.lastPenalties!.save();
          this.scene.soundManager.border.play();
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
          this.match.matchManager.matchEvenetManager.matchStatus === "playing"
        ) {
          this.scene.soundManager.border.play();
        }

        if (
          this.match.matchManager.matchEvenetManager.matchStatus ===
          "CornerIsInProcess"
        ) {
          this.match.matchManager.corner!.stopCorner();
          this.scene.soundManager.border.play();
        }

        if (
          this.match.matchManager.matchEvenetManager.matchStatus === "isreeKick"
        ) {
          this.match.matchManager.freeKick!.stopFreeKick();
          this.scene.soundManager.border.play();
        }

        if (
          this.match.matchManager.matchEvenetManager.matchStatus === "isPenalty"
        ) {
          this.match.matchManager.penalty!.stopPenalty();
          this.scene.soundManager.border.play();
        }

        if (
          this.match.matchManager.matchEvenetManager.matchStatus ===
          "isLastPenalties"
        ) {
          if (this.match.matchManager.lastPenalties!.canCheckIfIsGoal === false)
            return;
          this.match.matchManager.lastPenalties!.save();
          this.scene.soundManager.border.play();
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
