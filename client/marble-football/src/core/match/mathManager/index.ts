import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
import { getRandomIntNumber } from "../../../utils/math";
import { FreeKick } from "../matchEvents/freeKick";
import { Penalty } from "../matchEvents/penalty";
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

  freeKick?: FreeKick;
  penalty?: Penalty;

  isGoalSelebration = false;

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
      if (this.isGoalSelebration) return;

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
    this.isGoalSelebration = true;
    this.freeKick?.destroy();
    this.match.timer.stopTimer();

    this.match.hostTeam.stopMotion();
    this.match.guestTeam.stopMotion();

    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.matchStatus = "pause";

    this.match.hostTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });

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
    if (this.penalty !== undefined) {
      this.penalty.destoy();
      this.penalty = undefined;
    }

    this.match.hostTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });

    this.match.ball.reset();
    this.match.hostTeam.reset();
    this.match.guestTeam.reset();
  }

  resetUfterTimeEnd() {
    this.match.hostTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.stopFreeKickBehaviour();
    });

    this.match.ball.reset();
    this.match.hostTeam.reset();
    this.match.guestTeam.reset();

    this.match.hostTeam.footballers.forEach((f) => {
      f.selectorOff();
      f.withBall = false;
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.selectorOff();
      f.withBall = false;
    });

    setTimeout(() => {
      if (this.matchTimeStatus === "haltTimeEnd") {
        // this.resumeMatch("guest");
        this.match.timer.time = 45;

        const cavnasScene = this.match.scene.scene.get(
          "CanvasScene"
        ) as CanvasScene;
        cavnasScene.timerText.setText("45");
      }
    }, 3000);
  }

  resumeMatchUfterKFreeKickOrPenalty(whoWillStart: "host" | "guest") {
    this.freeKick?.destroy();
    this.freeKick = undefined;
    this.match.timer.resumeTimer();
    this.matchStatus = "playing";

    this.penalty?.destoy();
    this.penalty = undefined;

    this.isGoalSelebration = false;
    this.match.hostTeam.boardFootballPlayers.goalKeeper.activate();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.activate();
    this.match.hostTeam.footballers.forEach((f) => {
      f.activate();
      f.isFreeKick = false;
      f.isFreeKickShooter = false;
      f.isFreeKickBehaviour = false;
      f.withBall = false;
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.activate();
      f.isFreeKick = false;
      f.isFreeKickShooter = false;
      f.isFreeKickBehaviour = false;
      f.withBall = false;
    });

    const ballPositionX =
      whoWillStart === "host"
        ? this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
            .centerX + 30
        : this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
            .centerX - 30;

    const ballPositionY =
      whoWillStart === "host"
        ? this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
            .centerY
        : this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
            .centerY;

    this.match.ball.setPosition(ballPositionX, ballPositionY);

    if (whoWillStart === "host") {
      this.match.guestTeam.startMotion();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();

      setTimeout(() => {
        const deffenders =
          this.match.hostTeam.boardFootballPlayers.defenceColumn.footballers;
        const targetDeffender =
          deffenders[getRandomIntNumber(0, deffenders.length - 1)];

        const x = targetDeffender.getBounds().centerX;
        const y = targetDeffender.getBounds().centerY;
        this.match.ball.kick(200, {
          x,
          y,
        });

        setTimeout(() => {
          this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
        }, 500);
      }, 800);
    } else {
      this.match.hostTeam.startMotion();
      this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();

      setTimeout(() => {
        const deffenders =
          this.match.guestTeam.boardFootballPlayers.defenceColumn.footballers;
        const targetDeffender =
          deffenders[getRandomIntNumber(0, deffenders.length - 1)];

        const x = targetDeffender.getBounds().centerX;
        const y = targetDeffender.getBounds().centerY;
        this.match.ball.kick(200, {
          x,
          y,
        });
        setTimeout(() => {
          this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
        }, 500);
      }, 800);
    }
  }

  // Resume Ufte Goal
  resumeMatch(whoScored: "host" | "guest") {
    this.match.timer.resumeTimer();
    this.matchStatus = "playing";

    this.match.hostTeam.footballers.forEach((f) => {
      f.activate();
      f.isFreeKick = false;
      f.isFreeKickShooter = false;
      f.isFreeKickBehaviour = false;
      f.withBall = false;
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.activate();
      f.isFreeKick = false;
      f.isFreeKickShooter = false;
      f.isFreeKickBehaviour = false;
      f.withBall = false;
    });

    this.isGoalSelebration = false;

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
    this.match.hostTeam.boardFootballPlayers.goalKeeper.activate();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.activate();
  }

  stopMatch(
    reason:
      | "haltTimeEnd"
      | "fullTimeEnd"
      | "firstExtratimeEnd"
      | "secondExtraTimeEnd"
  ) {
    if (this.someoneHasBall === false) {
      return;
    }

    this.matchTimeStatus = reason;

    this.matchStatus = "pause";

    this.match.timer.stopTimer();

    this.match.ball.stop();
    this.match.hostTeam.stopMotion();
    this.match.guestTeam.stopMotion();

    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.match.hostTeam.footballers.forEach((f) => {
      f.selectorOff();
      f.withBall = false;
    });
    this.match.guestTeam.footballers.forEach((f) => {
      f.selectorOff();
      f.withBall = false;
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

  prepareFreeKick(
    playerPosition: "goalKeeper" | "defender" | "middfielder" | "attacker",
    who: "unkown" | "hostPlayer" | "guestPlayer"
  ) {
    this.matchPause();
    this.match.hostTeam.hideTeam();
    this.match.guestTeam.hideTeam();

    setTimeout(() => {
      playerPosition === "defender"
        ? this.makePenalty(who)
        : this.makeFreeKick(who, playerPosition);
    }, 2000);
  }

  makePenalty(who: "unkown" | "hostPlayer" | "guestPlayer") {
    this.penalty = new Penalty(
      this.match,
      who === "hostPlayer" ? "host" : "guest"
    );
  }

  makeFreeKick(
    who: "unkown" | "hostPlayer" | "guestPlayer",
    playerPosition: "goalKeeper" | "defender" | "middfielder" | "attacker"
  ) {
    this.freeKick = new FreeKick(
      this.match,
      who === "hostPlayer" ? "host" : "guest",
      playerPosition
    );
  }

  matchPause() {
    this.match.timer.stopTimer();
    this.match.hostTeam.stopMotion();
    this.match.guestTeam.stopMotion();

    this.match.hostTeam.boardFootballPlayers.goalKeeper.stopMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.stopMotion();

    this.match.ball.stop();
    this.matchStatus = "pause";
  }
}
