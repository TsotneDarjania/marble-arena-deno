import Match from "..";
import { getRandomIntNumber } from "../../../utils/math";
import Team from "../team";
import BoardFootballPlayer from "../team/footballplayers/boardFootballPlayer";

export default class MatchManager {
  teamWhoHasBall: "hostTeam" | "guestTeam" = "hostTeam";

  matchStatus: "playing" | "pause" | "finish" = "playing";

  constructor(public match: Match) {}

  startMatch() {
    this.makeFirstKick();
    this.startCamerFollow();
    this.startTimer();

    this.startOponentTeamMotion(this.match.guestTeam);
    this.match.hostTeam.boardFootballPlayers.goalKeeper.startMotion();
    this.match.guestTeam.boardFootballPlayers.goalKeeper.startMotion();
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
    if (footballer.playerData.who === "hostPlayer") {
      this.match.hostTeam.stopMotion();
      this.match.guestTeam.startMotion();
    }
    if (footballer.playerData.who == "guestPlayer") {
      this.match.guestTeam.stopMotion();
      this.match.hostTeam.startMotion();
    }
  }
}
