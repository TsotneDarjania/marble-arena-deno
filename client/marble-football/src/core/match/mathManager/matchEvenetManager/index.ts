import Match from "../..";
import BoardFootballPlayer from "../../team/footballplayers/boardFootballPlayer";

export class MatchEventManager {
  footballerWhoHasBall?: BoardFootballPlayer;
  constructor(public match: Match) {}

  footballerTakeBall(footballer: BoardFootballPlayer) {
    this.footballerWhoHasBall = footballer;
    this.match.scene.soundManager.catchBall.play();

    if (footballer.side === "hostPlayer") {
      this.match.matchManager.teamWhoHasBall = "hostTeam";
    }
    if (footballer.side === "guestPlayer") {
      this.match.matchManager.teamWhoHasBall = "guestTeam";
    }
  }
}
