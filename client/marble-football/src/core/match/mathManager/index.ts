import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
import { getRandomIntNumber } from "../../../utils/math";
import { Comentator, ComentatorManager } from "../commentatorManager";
import { Corner } from "../matchEvents/corner";
import { FreeKick } from "../matchEvents/freeKick";
import { LastPenalties } from "../matchEvents/lastPenalties";
import { Penalty } from "../matchEvents/penalty";

import BoardFootballPlayer from "../team/footballplayers/boardFootballPlayer";
import { FootballersMotionManager } from "./footballersMotionManager";
import { MatchEventManager } from "./matchEvenetManager";

export default class MatchManager {
  teamWhoHasBall: "hostTeam" | "guestTeam" = "hostTeam";

  matchStatus:
    | "none"
    | "playing"
    | "isCorner"
    | "isFreeKick"
    | "isPenalty"
    | "isLastPenalties" = "none";
  matchTimeStatus:
    | "readyForStart"
    | "haltTimeEnd"
    | "fullTimeEnd"
    | "firstExtratimeEnd"
    | "secondExtraTimeEnd" = "readyForStart";

  hostScore = 0;
  guestScore = 0;

  freeKick?: FreeKick;
  penalty?: Penalty;
  corner?: Corner;
  lastPenalties?: LastPenalties;

  // Core
  footballersMotionManager!: FootballersMotionManager;
  matchEvenetManager!: MatchEventManager;
  comentatorManager!: ComentatorManager;

  constructor(public match: Match) {}

  startMatch() {
    this.makeFirstKick();
    this.startCamerFollow();
    this.startTimer();
    this.createFootballersMotionManager();
    this.createMatchEvenetManager();
    this.createComentatorManager();
    this.matchStatus = "playing";
    this.teamWhoHasBall = "hostTeam";
  }

  createComentatorManager() {
    this.comentatorManager = new ComentatorManager(this.match);
  }

  createFootballersMotionManager() {
    this.footballersMotionManager = new FootballersMotionManager(this.match);
  }

  createMatchEvenetManager() {
    this.matchEvenetManager = new MatchEventManager(this.match);
  }

  makeFirstKick() {
    const potentialFootballers =
      this.match.hostTeam.boardFootballPlayers.middleColumn.footballers;
    const targetFootballer =
      potentialFootballers[getRandomIntNumber(0, potentialFootballers.length)];
    this.match.ball.kick(200, {
      x: targetFootballer.getBounds().centerX,
      y: targetFootballer.getBounds().centerY,
    });
  }

  startCamerFollow() {
    this.match.scene.cameraController.startFollow(this.match.ball);
  }

  makeCorner() {
    if (this.ballGoesForCorner === false) return;
    const canvasScene = this.match.scene.scene.get(
      "CanvasScene"
    ) as CanvasScene;
    canvasScene.showMatchEvent("Corner");
    this.match.scene.soundManager.referee.play();

    this.match.ball.stop();
    this.matchPause();

    this.match.hostTeam.hideTeam();
    this.match.guestTeam.hideTeam();

    setTimeout(() => {
      this.corner = new Corner(this.match);
      this.ballGoesForCorner = false;
    }, 2000);
  }

  startTimer() {
    this.match.matchTimer.startTimer();
  }

  addGoalListeners() {
    this.match.scene.events.on("update", () => {
      if (this.isGoalSelebration) return;

      if (
        this.match.ball.x >
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX +
          16
      ) {
        this.isGoal("host");
      }

      if (
        this.match.ball.x <
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX -
          16
      ) {
        if (this.matchStatus === "lastPenalties") {
          this.lastPenalties?.isGoal();
          return;
        }

        this.isGoal("guest");
      }
    });
  }

  isGoal(whoScored: "host" | "guest") {
    this.match.scene.soundManager.referee.play();

    this.match.scene.soundManager.goalSelebration.play();

    this.isGoalSelebration = true;
    this.freeKick?.destroy();
    this.freeKick = undefined;
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
      this.match.stadium.goalSelebration("host", 2000);

      this.hostScore++;
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.hostTeamScoretext.setText(this.hostScore.toString());
    } else {
      this.match.stadium.goalSelebration("guest", 2000);

      this.guestScore++;
      const canvasScene = this.match.scene.scene.get(
        "CanvasScene"
      ) as CanvasScene;
      canvasScene.guestTeamScoretext.setText(this.guestScore.toString());
    }

    setTimeout(() => {
      this.match.ball.stop();

      this.match.ball.startBlinkAnimation(() => {
        // this.resetUfterGoal();
      });
    }, 40);
  }

  resetUfterGoal() {
    this.match.ball.reset();
    this.match.hostTeam.reset();
    this.match.guestTeam.reset();
  }

  resetUfterTimeEnd() {
    this.match.collisionDetector.onceForCorner = true;

    this.ballGoesForCorner = false;

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
        this.resumeMatch("host");
        this.match.timer.time = 45;

        const cavnasScene = this.match.scene.scene.get(
          "CanvasScene"
        ) as CanvasScene;
        cavnasScene.timerText.setText("45");
      }
      if (this.matchTimeStatus === "fullTimeEnd") {
        if (this.match.matchData.gameConfig.withExtraTimes) {
          if (this.hostScore === this.guestScore) {
            this.resumeMatch("guest");
          }
        }
        this.match.timer.time = 90;

        const cavnasScene = this.match.scene.scene.get(
          "CanvasScene"
        ) as CanvasScene;
        cavnasScene.timerText.setText("90");
      }
      if (this.matchTimeStatus === "firstExtratimeEnd") {
        this.resumeMatch("guest");

        this.match.timer.time = 105;

        const cavnasScene = this.match.scene.scene.get(
          "CanvasScene"
        ) as CanvasScene;
        cavnasScene.timerText.setText("105");
      }
    }, 3000);
  }

  resumeMatchUfterKFreeKickOrPenalty(whoWillStart: "host" | "guest") {
    this.freeKick?.destroy();
    this.freeKick = undefined;
    this.match.timer.resumeTimer();
    this.matchStatus = "playing";
    this.isCorner = false;
    this.corner?.destroy();
    this.corner = undefined;

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

    this.match.scene.soundManager.pass.play();
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

        this.match.scene.soundManager.pass.play();
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
  async resumeMatch(whoStart: "host" | "guest") {
    this.teamWhoHasBall = whoStart === "host" ? "hostTeam" : "guestTeam";

    this.resetUfterGoal();

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2700);
    });

    if (this.corner !== undefined) {
      this.corner.destroy();
    }
    this.match.scene.soundManager.referee.play();

    this.match.timer.resumeTimer();
    this.matchStatus = "playing";

    this.isCorner = false;
    this.corner?.destroy();

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
        this.match.scene.soundManager.halfTimeEnd.play();

        setTimeout(() => {
          this.resetUfterTimeEnd();
        }, 1500);
        break;
      case "fullTimeEnd":
        this.match.scene.soundManager.halfTimeEnd.play();

        setTimeout(() => {
          this.resetUfterTimeEnd();
        }, 1500);
        break;
      case "firstExtratimeEnd":
        this.match.scene.soundManager.halfTimeEnd.play();

        setTimeout(() => {
          this.resetUfterTimeEnd();
        }, 1500);
        break;
      case "secondExtraTimeEnd":
        this.match.scene.soundManager.halfTimeEnd.play();

        setTimeout(() => {
          this.startLastPenalties();
        }, 1500);
    }
  }

  startLastPenalties() {
    if (this.hostScore === this.guestScore) {
      this.lastPenalties = new LastPenalties(this.match);
    } else {
      if (this.hostScore > this.guestScore) {
        const canvasScene = this.match.scene.scene.get(
          "CanvasScene"
        ) as CanvasScene;
        canvasScene.showLastresult({
          winner: this.match.matchData.hostTeamData.name,
          winnerLogoKey: this.match.matchData.hostTeamData.logoKey,
        });
      } else {
        const canvasScene = this.match.scene.scene.get(
          "CanvasScene"
        ) as CanvasScene;
        canvasScene.showLastresult({
          winner: this.match.matchData.guestTeamData.name,
          winnerLogoKey: this.match.matchData.guestTeamData.logoKey,
        });
      }
    }
  }

  prepareFreeKick(
    playerPosition: "goalKeeper" | "defender" | "middfielder" | "attacker",
    who: "unkown" | "hostPlayer" | "guestPlayer"
  ) {
    this.match.scene.soundManager.faul.play();
    this.match.scene.soundManager.referee.play();

    this.matchPause();

    this.match.hostTeam.hideTeam();
    this.match.guestTeam.hideTeam();

    const canvasScene = this.match.scene.scene.get(
      "CanvasScene"
    ) as CanvasScene;
    playerPosition === "defender"
      ? canvasScene.showMatchEvent("Penalty")
      : canvasScene.showMatchEvent("Free Kick");

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
  }
}
