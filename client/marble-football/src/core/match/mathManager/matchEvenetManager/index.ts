import Match from "../..";
import BoardGoalKeeper from "../../team/core/boardFootballPlayers/boardGoolKeeper";
import BoardFootballPlayer from "../../team/footballplayers/boardFootballPlayer";

export class MatchEventManager {
  matchStatus: "playing" | "isGoal" | "isCorner" | "isreeKick" | "isPenalty" =
    "playing";

  footballerWhoHasBall?: BoardFootballPlayer;
  constructor(public match: Match) {
    this.listenGoalEvenets();
  }

  isGoal(whoScored: "host" | "guest") {
    this.matchStatus = "isGoal";

    this.match.hostTeam.stopFullMotion();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.stopFullMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.match.ball.stop();
    this.match.ball.startBlinkAnimation();
    this.match.stadium.startGoalSelebration(whoScored, 2000);
  }

  listenGoalEvenets() {
    this.match.scene.events.on("update", () => {
      if (this.matchStatus === "playing") {
        if (
          this.match.ball.x <
          this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
            .centerX -
            16
        ) {
          this.isGoal("guest");
        }

        if (
          this.match.ball.x >
          this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
            .centerX +
            16
        ) {
          this.isGoal("host");
        }
      }
    });
  }

  footballerTakeBall(footballer: BoardFootballPlayer) {
    this.footballerWhoHasBall = footballer;
    this.match.scene.soundManager.catchBall.play();

    if (footballer.playerData.who === "hostPlayer") {
      this.match.matchManager.teamWhoHasBall = "hostTeam";
    }
    if (footballer.playerData.who === "guestPlayer") {
      this.match.matchManager.teamWhoHasBall = "guestTeam";
    }
  }

  goalKeeperTouchBall(goalKeeper: BoardGoalKeeper) {
    if (this.matchStatus === "playing") {
      goalKeeper.save();
    }
  }
}
