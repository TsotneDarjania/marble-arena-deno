import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
import { getRandomIntNumber } from "../../../utils/math";
import { ComentatorManager } from "../commentatorManager";
import { Corner } from "../matchEvents/corner";
import { FreeKick } from "../matchEvents/freeKick";
import { LastPenalties } from "../matchEvents/lastPenalties";
import { Penalty } from "../matchEvents/penalty";

import BoardFootballPlayer from "../team/footballplayers/boardFootballPlayer";
import { FootballersMotionManager } from "./footballersMotionManager";
import { MatchEventManager } from "./matchEvenetManager";

export default class MatchManager {
  teamWhoHasBall: "hostTeam" | "guestTeam" = "hostTeam";
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
    this.makeFirstKick("host");
    this.startCamerFollow();
    this.startTimer();
    this.createFootballersMotionManager();
    this.createMatchEvenetManager();
    this.createComentatorManager();
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

  makeFirstKick(teamWhoWillGetBall: "host" | "guest") {
    const potentialFootballers =
      teamWhoWillGetBall === "host"
        ? this.match.hostTeam.boardFootballPlayers.middleColumn.footballers
        : this.match.guestTeam.boardFootballPlayers.middleColumn.footballers;
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

  startTimer() {
    this.match.matchTimer.startTimer();
  }

  resetUfterGoal() {
    console.log("reset ufter goal");
    this.match.ball.reset();
    this.match.hostTeam.reset();
    this.match.guestTeam.reset();

    setTimeout(() => {
      this.matchEvenetManager.matchStatus = "playing";
      this.teamWhoHasBall === "guestTeam"
        ? this.makeFirstKick("host")
        : this.makeFirstKick("guest");

      this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
      this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();

      this.teamWhoHasBall =
        this.teamWhoHasBall === "guestTeam" ? "hostTeam" : "guestTeam";
    }, 3000);
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
}
