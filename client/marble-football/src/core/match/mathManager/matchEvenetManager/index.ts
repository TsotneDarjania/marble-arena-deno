import Match from "../..";
import CanvasScene from "../../../../scenes/CanvasScene";
import { getRandomIntNumber } from "../../../../utils/math";
import { Corner } from "../../matchEvents/corner";
import { Freekick } from "../../matchEvents/freeKick";
import { Penalty } from "../../matchEvents/penalty";
import BoardGoalKeeper from "../../team/core/boardFootballPlayers/boardGoolKeeper";
import BoardFootballPlayer from "../../team/footballplayers/boardFootballPlayer";

export class MatchEventManager {
  private timeOut_1: NodeJS.Timeout;
  private timeOut_2: NodeJS.Timeout;
  private timeOut_3: NodeJS.Timeout;
  private timeOut_4: NodeJS.Timeout;

  public isPossibleToListenGoalEvents = true;

  isHalfTimeEnded = false;
  isfullTimeEnded = false;
  isfirstExtraTimeEnded = false;
  isSecondExtraTimeEnded = false;

  matchStatus:
    | "pause"
    | "playing"
    | "isGoal"
    | "isCorner"
    | "CornerIsInProcess"
    | "finishCorner"
    | "isreeKick"
    | "finishFreeKick"
    | "isPenalty"
    | "finishPenalty"
    | "isLastPenalties" = "playing";

  footballerWhoHasBall?: BoardFootballPlayer;
  constructor(public match: Match) {
    this.listenGoalEvenets();
  }

  calculatePenaltyPossibility() {
    if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
      const random = getRandomIntNumber(0, 100);
      if (random > this.match.matchData.guestTeamData.penaltyFrequency) {
        return;
      }
      const randomFootballer =
        this.match.guestTeam.boardFootballPlayers.defenceColumn.footballers
          .length < 4
          ? this.match.guestTeam.boardFootballPlayers.defenceColumn.footballers[
              Math.floor(
                this.match.guestTeam.boardFootballPlayers.defenceColumn
                  .footballers.length / 2
              )
            ]
          : this.match.guestTeam.boardFootballPlayers.defenceColumn.footballers[
              getRandomIntNumber(0, 100) > 50
                ? Math.floor(
                    this.match.guestTeam.boardFootballPlayers.defenceColumn
                      .footballers.length / 2
                  )
                : Math.floor(
                    this.match.guestTeam.boardFootballPlayers.defenceColumn
                      .footballers.length / 2
                  ) - 1
            ];
      randomFootballer.startFreeKickBehaviour();
    } else {
      const random = getRandomIntNumber(0, 100);
      if (random > this.match.matchData.hostTeamData.penaltyFrequency) {
        return;
      }

      const randomFootballer =
        this.match.hostTeam.boardFootballPlayers.defenceColumn.footballers
          .length < 4
          ? this.match.hostTeam.boardFootballPlayers.defenceColumn.footballers[
              Math.floor(
                this.match.hostTeam.boardFootballPlayers.defenceColumn
                  .footballers.length / 2
              )
            ]
          : this.match.hostTeam.boardFootballPlayers.defenceColumn.footballers[
              getRandomIntNumber(0, 100) > 50
                ? Math.floor(
                    this.match.hostTeam.boardFootballPlayers.defenceColumn
                      .footballers.length / 2
                  )
                : Math.floor(
                    this.match.hostTeam.boardFootballPlayers.defenceColumn
                      .footballers.length / 2
                  ) - 1
            ];
      randomFootballer.startFreeKickBehaviour();
    }
  }

  calculateFreeKickPossibility() {
    if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
      const random = getRandomIntNumber(0, 100);
      if (random > this.match.matchData.guestTeamData.freeKiskFrequency) {
        return;
      }
      const randomFootballer =
        getRandomIntNumber(0, 100) > 50
          ? this.match.guestTeam.boardFootballPlayers.middleColumn.footballers[
              getRandomIntNumber(
                0,
                this.match.guestTeam.boardFootballPlayers.middleColumn
                  .footballers.length
              )
            ]
          : this.match.guestTeam.boardFootballPlayers.attackColumn.footballers[
              getRandomIntNumber(
                0,
                this.match.guestTeam.boardFootballPlayers.attackColumn
                  .footballers.length
              )
            ];

      randomFootballer.startFreeKickBehaviour();
    } else {
      const random = getRandomIntNumber(0, 100);
      if (random > this.match.matchData.hostTeamData.freeKiskFrequency) {
        return;
      }
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

  isGoal(whoScored: "host" | "guest") {
    if (this.matchStatus === "playing") {
      this.match.matchTimer.stopTimer();

      if (whoScored === "host") {
        this.match.hostTeamCoach.selebration();
        this.match.guestTeamCoach.angry();

        this.match.matchManager.hostScore++;
        const canvasScene = this.match.scene.scene.get(
          "CanvasScene"
        ) as CanvasScene;
        canvasScene.hostTeamScoretext.setText(
          this.match.matchManager.hostScore.toString()
        );
      } else {
        this.match.guestTeamCoach.selebration();
        this.match.hostTeamCoach.angry();

        this.match.matchManager.guestScore++;
        const canvasScene = this.match.scene.scene.get(
          "CanvasScene"
        ) as CanvasScene;
        canvasScene.guestTeamScoretext.setText(
          this.match.matchManager.guestScore.toString()
        );
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

    if (this.matchStatus === "isreeKick") {
      this.match.matchManager.freeKick!.isGoal(whoScored);
      this.matchStatus = "finishFreeKick";
    }

    if (this.matchStatus === "isPenalty") {
      this.match.matchManager.penalty!.isGoal(whoScored);
      this.matchStatus = "finishPenalty";
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
          if (
            this.match.matchManager.matchEvenetManager.matchStatus ===
            "isLastPenalties"
          ) {
            return;
          }
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
    if (this.match.matchTimer.time >= 45 && this.isHalfTimeEnded === false) {
      this.isHalfTimeEnded = true;
      this.match.matchManager.puaseMatch("guest", "halfTimeEnd");
      return;
    }

    if (this.match.matchTimer.time >= 90 && this.isfullTimeEnded === false) {
      this.isfullTimeEnded = true;
      this.match.matchManager.puaseMatch("host", "fullTimeEnd");
      return;
    }

    if (
      this.match.matchTimer.time >= 105 &&
      this.isfirstExtraTimeEnded === false
    ) {
      this.isfirstExtraTimeEnded = true;
      this.match.matchManager.puaseMatch("host", "firstExtraTimeEnd");
      return;
    }

    if (this.match.matchTimer.time >= 120) {
      this.isSecondExtraTimeEnded = true;
      this.match.matchManager.puaseMatch("host", "secondExtraTimeEnd");
      return;
    }

    this.footballerWhoHasBall = footballer;
    this.match.scene.soundManager.catchBall.play();

    if (footballer.playerData.who === "hostPlayer") {
      this.match.matchManager.teamWhoHasBall = "hostTeam";
    }
    if (footballer.playerData.who === "guestPlayer") {
      this.match.matchManager.teamWhoHasBall = "guestTeam";
    }

    this.calculateFreeKickPossibility();
    this.calculatePenaltyPossibility();
  }

  footballerSaveToCorner(side: "top" | "bottom") {
    this.match.matchTimer.stopTimer();

    this.match.scene.soundManager.faul.play();
    this.match.hostTeam.stopFullMotion();
    this.match.guestTeam.stopFullMotion();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.matchStatus = "isCorner";
    this.match.collisionDetector.removeColliderforBallAndStadiumBorders();
    this.match.collisionDetector.removeColliderforBallAndGoalPosts();

    this.timeOut_1 = setTimeout(() => {
      this.match.scene.soundManager.referee.play();

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
      if (goalKeeper.y > 45) {
        this.makeCornerFromGoaleeper(goalKeeper, "bottom");
        return;
      }

      if (goalKeeper.y < -48) {
        this.makeCornerFromGoaleeper(goalKeeper, "top");
        return;
      }

      goalKeeper.save();
    }
  }

  makeCornerFromGoaleeper(goalKeeper: BoardGoalKeeper, side: "top" | "bottom") {
    this.match.matchTimer.stopTimer();
    this.match.scene.soundManager.catchBall.play();
    this.matchStatus = "isCorner";
    this.match.collisionDetector.removeColliderforBallAndStadiumBorders();
    this.match.collisionDetector.removeColliderforBallAndGoalPosts();
    goalKeeper.saveToCorner(side);
    this.timeOut_4 = setTimeout(() => {
      this.match.scene.soundManager.referee.play();

      this.match.ball.stop();
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.showComentator(
        this.match.matchManager.teamWhoHasBall === "hostTeam"
          ? "left"
          : "right",
        "Corner Kick!"
      );
    }, 900);

    this.timeOut_3 = setTimeout(() => {
      this.startCorner(side);
    }, 3000);
  }

  startCorner(side: "top" | "bottom") {
    this.match.hostTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });
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

  resumeUfterPenalty(teamWhoWillResume: "host" | "guest", wasGoal: boolean) {
    this.match.scene.soundManager.referee.play();

    this.match.hostTeam.reset();
    this.match.guestTeam.reset();
    this.match.ball.reset();
    this.match.matchManager.penalty = undefined;

    this.match.matchManager.teamWhoHasBall =
      teamWhoWillResume === "host" ? "hostTeam" : "guestTeam";

    if (wasGoal === false) {
      teamWhoWillResume === "host"
        ? this.match.hostTeam.boardFootballPlayers.goalKeeper.setBall()
        : this.match.guestTeam.boardFootballPlayers.goalKeeper.setBall();
    }

    setTimeout(() => {
      this.match.matchManager.matchEvenetManager.matchStatus = "playing";

      if (wasGoal) {
        this.match.scene.soundManager.referee.play();
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
      this.match.matchTimer.resumeTimer();
    }, 2100);
  }

  resumeUfterFreeKick(teamWhoWillResume: "host" | "guest", wasGoal: boolean) {
    this.match.hostTeam.reset();
    this.match.guestTeam.reset();
    this.match.ball.reset();
    this.match.matchManager.freeKick = undefined;

    this.match.matchManager.teamWhoHasBall =
      teamWhoWillResume === "host" ? "hostTeam" : "guestTeam";

    if (wasGoal === false) {
      teamWhoWillResume === "host"
        ? this.match.hostTeam.boardFootballPlayers.goalKeeper.setBall()
        : this.match.guestTeam.boardFootballPlayers.goalKeeper.setBall();
    }

    setTimeout(() => {
      this.match.matchManager.matchEvenetManager.matchStatus = "playing";

      if (wasGoal) {
        this.match.scene.soundManager.referee.play();

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
      this.match.matchTimer.resumeTimer();
    }, 2100);
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
        this.match.scene.soundManager.referee.play();

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
      this.match.matchTimer.resumeTimer();
    }, 2100);
  }

  makefreeKick(footballer: BoardFootballPlayer) {
    this.match.scene.soundManager.faul.play();

    this.match.hostTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });
    this.matchStatus = "isreeKick";
    this.match.matchTimer.stopTimer();

    this.match.hostTeam.stopFullMotion();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.stopFullMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.match.ball.stop();
    this.match.ball.startBlinkAnimation();

    setTimeout(() => {
      this.match.hostTeam.stopFullMotion();
      this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
      this.match.guestTeam.stopFullMotion();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.showComentator(
        this.match.matchManager.teamWhoHasBall === "hostTeam"
          ? "left"
          : "right",
        "Free kick!"
      );
    }, 1500);

    setTimeout(() => {
      this.match.hostTeam.hideTeam();
      this.match.guestTeam.hideTeam();
      this.match.ball.stopBlinkAnimation();

      this.match.matchManager.freeKick = new Freekick(
        this.match,
        footballer.playerData.who === "hostPlayer" ? "host" : "guest",
        footballer
      );
    }, 1500);
  }

  makePenalty(footballer: BoardFootballPlayer) {
    this.match.scene.soundManager.faul.play();

    this.match.hostTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });

    this.matchStatus = "isPenalty";
    this.match.matchTimer.stopTimer();

    this.match.hostTeam.stopFullMotion();
    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.stopFullMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.match.ball.stop();
    this.match.ball.startBlinkAnimation();

    setTimeout(() => {
      this.match.hostTeam.stopFullMotion();
      this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
      this.match.guestTeam.stopFullMotion();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.showComentator(
        this.match.matchManager.teamWhoHasBall === "hostTeam"
          ? "left"
          : "right",
        "Penalty!"
      );
    }, 1500);

    setTimeout(() => {
      this.match.hostTeam.hideTeam();
      this.match.guestTeam.hideTeam();
      this.match.ball.stopBlinkAnimation();

      this.match.matchManager.penalty = new Penalty(
        this.match,
        footballer.playerData.who === "hostPlayer" ? "host" : "guest"
      );
    }, 1500);
  }
}
