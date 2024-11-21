import GamePlay from "../../../scenes/GamePlay";
import { GameConfigType, TeamDataType } from "../../../types/gameTypes";
import { Stadium } from "../stadium";
import BoardFootballPlayers from "./core/boardFootballPlayers";

export default class Team {
  hostBoardFootballPlayers: BoardFootballPlayers;

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
  }

  private addPlayers() {
    switch (this.config.mode) {
      case "board-football":
        this.addBoardFootballPlayers();
        break;
      case "experimental":
        break;
      default:
        throw new Error("Invalid mode");
    }
  }

  private addBoardFootballPlayers() {
    this.hostBoardFootballPlayers = new BoardFootballPlayers(
      this.scene,
      this.stadium,
      this.teamData,
      this.side
    );
  }
}
