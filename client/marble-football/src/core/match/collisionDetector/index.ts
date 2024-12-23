import Match from "..";
import GamePlay from "../../../scenes/GamePlay";

export default class CollisionDetector {
  onceForCorner = true;

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
        if (this.match.matchManager.isCorner) {
          if (this.match.matchManager.corner!.cornerAlreadyShoot === false)
            return;
          this.match.ball.stop();
          this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
          this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();
          this.match.matchManager.resumeMatchUfterKFreeKickOrPenalty(
            this.match.matchManager.corner!.shootSide === "left"
              ? "host"
              : "guest"
          );
        }

        // console.log("Stadium Border Detect");
        if (this.match.matchManager.ballGoesForCorner) {
          // console.log("aaaaaa");
          if (this.onceForCorner) {
            this.onceForCorner = false;
            this.match.matchManager.makeCorner();

            return;
          }
        }

        if (this.match.matchManager.freeKick !== undefined) {
          this.match.matchManager.freeKick.saveFreeKick();
        }
      }
    );
  }
}
