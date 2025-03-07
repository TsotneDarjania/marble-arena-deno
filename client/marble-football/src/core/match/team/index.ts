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

    setTimeout(() => {
      this.defineShortAndLongPassVariantsForFootballers();
    }, 1000);
  }

  private defineShortAndLongPassVariantsForFootballers() {
    [
      this.boardFootballPlayers.defenceColumn,
      this.boardFootballPlayers.middleColumn,
      this.boardFootballPlayers.attackColumn,
    ].forEach((column) => {
      column.footballers.forEach((footballer) => {
        footballer.defineShortAndLongPassVariants();
      });
    });
    this.boardFootballPlayers.goalKeeper.defineShortAndLongPassVariants();
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

  startFullMotion() {
    this.boardFootballPlayers.startFullMotion();
  }

  stopFullMotion() {
    this.boardFootballPlayers.stopFullMotion();
  }

  startSpecificColumnMotion(
    columnPosition: "defenceColumn" | "middleColumn" | "attackColumn"
  ) {
    this.boardFootballPlayers.startSpecificMotion(columnPosition);
  }

  stopSpecificColumnMotion(
    columnPosition: "defenceColumn" | "middleColumn" | "attackColumn"
  ) {
    this.boardFootballPlayers.stopSpecificMotion(columnPosition);
  }

  public reset() {
    this.boardFootballPlayers.defenceColumn.reset();
    this.boardFootballPlayers.middleColumn.reset();
    this.boardFootballPlayers.attackColumn.reset();
    this.showTeam();
    this.footballers.map((f) => {
      f.activate();
      f.stopFreeKickBehaviour();
      f.aleradySentTakeBallDesire = false;
    });

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
