import Match from "../..";
import CanvasScene from "../../../../scenes/CanvasScene";
import { Corner } from "../../matchEvents/corner";
import BoardGoalKeeper from "../../team/core/boardFootballPlayers/boardGoolKeeper";
import BoardFootballPlayer from "../../team/footballplayers/boardFootballPlayer";

export class MatchEventManager {
  matchStatus:
    | "playing"
    | "isGoal"
    | "isCorner"
    | "CornerIsInProcess"
    | "isreeKick"
    | "isPenalty" = "playing";

  footballerWhoHasBall?: BoardFootballPlayer;
  constructor(public match: Match) {
    this.listenGoalEvenets();
  }

  isGoal(whoScored: "host" | "guest") {
    this.matchStatus = "isGoal";
    this.match.matchTimer.stopTimer();

    this.match.hostTeam.stopFullMotion();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.stopFullMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.match.ball.stop();
    this.match.ball.startBlinkAnimation();
    this.match.stadium.startGoalSelebration(whoScored, 2000);

    setTimeout(() => {
      this.match.matchManager.resetUfterGoal();
    }, 4000);
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

  footballerSaveToCorner(side: "top" | "bottom") {
    this.match.hostTeam.stopFullMotion();
    this.match.guestTeam.stopFullMotion();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.matchStatus = "isCorner";
    this.match.collisionDetector.removeColliderforBallAndStadiumBorders();

    setTimeout(() => {
      this.match.ball.stop();
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.showComentator(
        this.match.matchManager.teamWhoHasBall === "hostTeam"
          ? "left"
          : "right",
        "Corner Kisk!"
      );
    }, 1100);

    setTimeout(() => {
      this.startCorner(side);
    }, 3000);
  }

  goalKeeperTouchBall(goalKeeper: BoardGoalKeeper) {
    if (this.matchStatus === "playing") {
      if (goalKeeper.y > 40) {
        this.makeCornerFromGoaleeper(goalKeeper, "bottom");
        return;
      }

      if (goalKeeper.y < -43) {
        this.makeCornerFromGoaleeper(goalKeeper, "top");
        return;
      }

      goalKeeper.save();
    }
  }

  makeCornerFromGoaleeper(goalKeeper: BoardGoalKeeper, side: "top" | "bottom") {
    this.matchStatus = "isCorner";
    this.match.collisionDetector.removeColliderforBallAndStadiumBorders();
    goalKeeper.saveToCorner(side);

    setTimeout(() => {
      this.match.ball.stop();
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.showComentator(
        this.match.matchManager.teamWhoHasBall === "hostTeam"
          ? "left"
          : "right",
        "Corner Kisk!"
      );
    }, 900);

    setTimeout(() => {
      this.startCorner(side);
    }, 3000);
  }

  startCorner(side: "top" | "bottom") {
    this.match.matchManager.corner = new Corner(
      this.match,
      side,
      this.match.matchManager.teamWhoHasBall
    );

    this.match.hostTeam.hideTeam();
    this.match.guestTeam.hideTeam();

    if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
      this.match.guestTeam.boardFootballPlayers.goalKeeper.activate();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
    } else {
      this.match.hostTeam.boardFootballPlayers.goalKeeper.activate();
      this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
    }
  }
}
