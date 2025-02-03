import GamePlay from "../../../scenes/GamePlay";
import { GameConfigType, TeamDataType } from "../../../types/gameTypes";
import { Stadium } from "../stadium";
import BoardFootballPlayers from "./core/boardFootballPlayers";
import BoardFootballPlayer from "./footballplayers/boardFootballPlayer";

export default class Team {
  boardFootballPlayers: BoardFootballPlayers;
  footballers: BoardFootballPlayer[] = [];

  constructor(
    public scene: GamePlay,
    public teamData: TeamDataType,
    public config: GameConfigType,
    public stadium: Stadium,
    public side: "left" | "right"
  ) {
    this.init();
  }

  private init() {
    this.addPlayers();
    this.footballers.push(
      ...this.boardFootballPlayers.defenceColumn.footballers,
      ...this.boardFootballPlayers.middleColumn.footballers,
      ...this.boardFootballPlayers.attackColumn.footballers,
      this.boardFootballPlayers.goalKeeper
    );
  }

  private addPlayers() {
    switch (this.config.mode) {
      case "board-football":
        this.addBoardFootballPlayers();
        break;
      case "marble-football":
        this.addBoardFootballPlayers();
        break;
      default:
        throw new Error("Invalid mode");
    }
  }

  private addBoardFootballPlayers() {
    this.boardFootballPlayers = new BoardFootballPlayers(
      this.scene,
      this.stadium,
      this.teamData,
      this.side
    );
  }

  startMotion() {
    this.boardFootballPlayers.startMotion();
  }

  stopMotion() {
    this.boardFootballPlayers.stopMotion();
  }

  public reset() {
    this.boardFootballPlayers.defenceColumn.reset();
    this.boardFootballPlayers.middleColumn.reset();
    this.boardFootballPlayers.attackColumn.reset();

    this.boardFootballPlayers.goalKeeper.reset();
  }

  hideTeam() {
    this.footballers.forEach((f) => {
      f.deactive();
    });
  }

  showTeam() {
    this.footballers.forEach((f) => {
      f.activate();
    });
  }
}
