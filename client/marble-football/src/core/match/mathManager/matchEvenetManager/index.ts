import Match from "../..";
import CanvasScene from "../../../../scenes/CanvasScene";
import { getRandomIntNumber } from "../../../../utils/math";
import { Corner } from "../../matchEvents/corner";
import BoardGoalKeeper from "../../team/core/boardFootballPlayers/boardGoolKeeper";
import BoardFootballPlayer from "../../team/footballplayers/boardFootballPlayer";

export class MatchEventManager {
  private timeOut_1: NodeJS.Timeout;
  private timeOut_2: NodeJS.Timeout;
  private timeOut_3: NodeJS.Timeout;
  private timeOut_4: NodeJS.Timeout;

  public isPossibleToListenGoalEvents = true;

  matchStatus:
    | "playing"
    | "isGoal"
    | "isCorner"
    | "CornerIsInProcess"
    | "finishCorner"
    | "isreeKick"
    | "isPenalty" = "playing";

  footballerWhoHasBall?: BoardFootballPlayer;
  constructor(public match: Match) {
    this.listenGoalEvenets();
  }

  calculateFreeKickPossibility() {
    const random = getRandomIntNumber(0, 100);
    if (random > 70) {
      if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
        const randomFootballer =
          getRandomIntNumber(0, 100) > 50
            ? this.match.guestTeam.boardFootballPlayers.middleColumn
                .footballers[
                getRandomIntNumber(
                  0,
                  this.match.guestTeam.boardFootballPlayers.middleColumn
                    .footballers.length
                )
              ]
            : this.match.guestTeam.boardFootballPlayers.attackColumn
                .footballers[
                getRandomIntNumber(
                  0,
                  this.match.guestTeam.boardFootballPlayers.attackColumn
                    .footballers.length
                )
              ];

        randomFootballer.startFreeKickBehaviour();
      } else {
        const randomFootballer =
          getRandomIntNumber(0, 100) > 50
            ? this.match.hostTeam.boardFootballPlayers.middleColumn.footballers[
                getRandomIntNumber(
                  0,
                  this.match.hostTeam.boardFootballPlayers.middleColumn
                    .footballers.length
                )
              ]
            : this.match.hostTeam.boardFootballPlayers.attackColumn.footballers[
                getRandomIntNumber(
                  0,
                  this.match.hostTeam.boardFootballPlayers.attackColumn
                    .footballers.length
                )
              ];

        randomFootballer.startFreeKickBehaviour();
      }
    }
  }

  isGoal(whoScored: "host" | "guest") {
    if (this.matchStatus === "playing") {
      if (whoScored === "host") {
        this.match.hostTeamCoach.selebration();
        this.match.guestTeamCoach.angry();
      } else {
        this.match.guestTeamCoach.selebration();
        this.match.hostTeamCoach.angry();
      }

      this.matchStatus = "isGoal";
      this.match.matchTimer.stopTimer();

      this.match.hostTeam.stopFullMotion();
      this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
      this.match.guestTeam.stopFullMotion();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

      this.match.ball.stop();
      this.match.ball.startBlinkAnimation();
      this.match.stadium.startGoalSelebration(whoScored);

      setTimeout(() => {
        this.match.stadium.stopGoalSelebration();
        this.match.matchManager.resetUfterGoal();
      }, 4000);
    }

    if (this.matchStatus === "CornerIsInProcess") {
      this.match.matchManager.corner!.isGoal(whoScored);
      this.matchStatus = "finishCorner";
    }
  }

  listenGoalEvenets() {
    this.match.scene.events.on("update", () => {
      if (this.isPossibleToListenGoalEvents) {
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

    this.calculateFreeKickPossibility();
  }

  footballerSaveToCorner(side: "top" | "bottom") {
    this.match.hostTeam.stopFullMotion();
    this.match.guestTeam.stopFullMotion();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.matchStatus = "isCorner";
    this.match.collisionDetector.removeColliderforBallAndStadiumBorders();
    this.match.collisionDetector.removeColliderforBallAndGoalPosts();

    this.timeOut_1 = setTimeout(() => {
      this.match.ball.stop();
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.showComentator(
        this.match.matchManager.teamWhoHasBall === "hostTeam"
          ? "right"
          : "left",
        "Corner Kick!"
      );
    }, 1400);

    this.timeOut_2 = setTimeout(() => {
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
    this.match.collisionDetector.removeColliderforBallAndGoalPosts();
    goalKeeper.saveToCorner(side);

    this.timeOut_4 = setTimeout(() => {
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

    this.timeOut_3 = setTimeout(() => {
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

  resumeUfterCorner(teamWhoWillResume: "host" | "guest", wasGoal: boolean) {
    this.match.hostTeam.reset();
    this.match.guestTeam.reset();
    this.match.ball.reset();
    this.match.matchManager.corner = undefined;

    clearTimeout(this.timeOut_1);
    clearTimeout(this.timeOut_2);
    clearTimeout(this.timeOut_3);
    clearTimeout(this.timeOut_4);

    if (wasGoal === false) {
      teamWhoWillResume === "host"
        ? this.match.hostTeam.boardFootballPlayers.goalKeeper.setBall()
        : this.match.guestTeam.boardFootballPlayers.goalKeeper.setBall();
    }

    this.match.matchManager.teamWhoHasBall =
      teamWhoWillResume === "host" ? "hostTeam" : "guestTeam";

    setTimeout(() => {
      this.match.matchManager.matchEvenetManager.matchStatus = "playing";

      if (wasGoal) {
        this.match.matchManager.makeFirstKick(teamWhoWillResume);
      } else {
        teamWhoWillResume === "host"
          ? this.match.hostTeam.boardFootballPlayers.goalKeeper.makeShortPass()
          : this.match.guestTeam.boardFootballPlayers.goalKeeper.makeShortPass();
      }
    }, 1800);

    setTimeout(() => {
      this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
    }, 2100);
  }
}
