import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
import { getRandomIntNumber } from "../../../utils/math";
import Team from "../team";
import BoardFootballPlayer from "../team/footballplayers/boardFootballPlayer";

export default class MatchManager {
  teamWhoHasBall: "hostTeam" | "guestTeam" = "hostTeam";

  matchStatus: "playing" | "pause" | "finish" = "playing";
  matchTimeStatus:
    | "none"
    | "haltTimeEnd"
    | "fullTimeEnd"
    | "firstExtratimeEnd"
    | "secondExtraTimeEnd" = "none";

  hostScore = 0;
  guestScore = 0;

  someoneHasBall = false;

  constructor(public match: Match) {}

  startMatch() {
    this.makeFirstKick();
    this.startCamerFollow();
    this.startTimer();
    this.addGoalListeners();

    this.startOponentTeamMotion(this.match.guestTeam);

    this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();

    this.addEventListeners();
  }

  addEventListeners() {
    this.match.stadium.spectators.eventEmitter.on(
      "FinishGoalSelebration",
      (whoScored: "host" | "guest") => {
        this.resumeMatch(whoScored);
      }
    );
  }

  makeFirstKick() {
    if (this.match.gameConfig.mode === "board-football") {
      const footballers =
        this.match.hostTeam.boardFootballPlayers.middleColumn.footballers;
      const randomFootballer =
        footballers[getRandomIntNumber(0, footballers.length)];
      this.match.ball.kick(200, {
        x: randomFootballer.getBounds().centerX,
        y: randomFootballer.getBounds().centerY,
      });
    }
  }

  startCamerFollow() {
    this.match.scene.cameraMotion.startFollow(this.match.ball);
  }

  startOponentTeamMotion(team: Team) {
    team.startMotion();
  }

  startTimer() {
    this.match.timer.startTimer();
  }

  someoneTakeBall(footballer: BoardFootballPlayer) {
    if (this.matchTimeStatus === "none" && this.match.timer.time >= 45) {
      this.stopMatch("haltTimeEnd");
      return;
    }

    if (footballer.playerData.who === "hostPlayer") {
      this.match.hostTeam.stopMotion();
      this.match.guestTeam.startMotion();
    }
    if (footballer.playerData.who == "guestPlayer") {
      this.match.guestTeam.stopMotion();
      this.match.hostTeam.startMotion();
    }
  }

  addGoalListeners() {
    this.match.scene.events.on("update", () => {
      if (this.matchStatus === "pause") return;

      if (
        this.match.ball.x >
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX +
          10
      ) {
        this.isGoal("host");
      }

      if (
        this.match.ball.x <
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX -
          10
      ) {
        this.isGoal("guest");
      }
    });
  }

  isGoal(whoScored: "host" | "guest") {
    this.match.timer.stopTimer();

    this.match.hostTeam.stopMotion();
    this.match.guestTeam.stopMotion();

    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.matchStatus = "pause";

    if (whoScored === "host") {
      this.match.stadium.goalSelebration("host");

      this.hostScore++;
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.hostTeamScoretext.setText(this.hostScore.toString());
    } else {
      this.match.stadium.goalSelebration("guest");

      this.guestScore++;
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.guestTeamScoretext.setText(this.guestScore.toString());
    }

    setTimeout(() => {
      this.match.ball.stop();

      this.match.ball.startBlinkAnimation(() => {
        this.resetUfterGoal();
      });
    }, 200);
  }

  resetUfterGoal() {
    this.match.ball.reset();
    this.match.hostTeam.reset();
    this.match.guestTeam.reset();
  }

  resetUfterTimeEnd() {
    this.match.ball.reset();
    this.match.hostTeam.reset();
    this.match.guestTeam.reset();

    setTimeout(() => {
      if (this.matchTimeStatus === "haltTimeEnd") {
        this.resumeMatch("guest");
        this.match.timer.time = 45;
      }
    }, 1000);
  }

  // Resume Ufte Goal
  resumeMatch(whoScored: "host" | "guest") {
    this.match.timer.resumeTimer();
    this.matchStatus = "playing";

    if (whoScored === "host") {
      this.match.hostTeam.startMotion();
      const footballers =
        this.match.guestTeam.boardFootballPlayers.middleColumn.footballers;
      const choosenFootballer =
        footballers[getRandomIntNumber(0, footballers.length - 1)];
      this.match.ball.kick(200, {
        x: choosenFootballer.getBounds().centerX,
        y: choosenFootballer.getBounds().centerY,
      });
    } else {
      const footballers =
        this.match.hostTeam.boardFootballPlayers.middleColumn.footballers;
      const choosenFootballer =
        footballers[getRandomIntNumber(0, footballers.length - 1)];
      this.match.ball.kick(200, {
        x: choosenFootballer.getBounds().centerX,
        y: choosenFootballer.getBounds().centerY,
      });
      this.match.guestTeam.startMotion();
    }

    this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
  }

  stopMatch(
    reason:
      | "haltTimeEnd"
      | "fullTimeEnd"
      | "firstExtratimeEnd"
      | "secondExtraTimeEnd"
  ) {
    this.matchTimeStatus = reason;

    if (this.someoneHasBall === false) {
      return;
    }

    this.matchStatus = "pause";

    this.match.timer.stopTimer();

    this.match.ball.stop();
    this.match.hostTeam.stopMotion();
    this.match.guestTeam.stopMotion();

    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.match.hostTeam.footballers.forEach((f) => {
      f.selectorOff();
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.selectorOff();
    });

    switch (reason) {
      case "haltTimeEnd":
        setTimeout(() => {
          this.resetUfterTimeEnd();
        }, 1500);
        break;
      case "fullTimeEnd":
        setTimeout(() => {
          this.resetUfterTimeEnd();
        }, 1500);
    }
  }
}
