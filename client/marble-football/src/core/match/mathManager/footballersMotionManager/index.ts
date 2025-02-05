import Match from "../..";
import { calculateDistance } from "../../../../utils/math";
import BoardGoalKeeper from "../../team/core/boardFootballPlayers/boardGoolKeeper";

export class FootballersMotionManager {
  hostTeamGoalKeeper!: BoardGoalKeeper;
  guestTeamGoalKeeper!: BoardGoalKeeper;

  constructor(public match: Match) {
    this.init();
  }

  init() {
    this.defineFootballers();

    this.hostTeamGoalKeeper.startMotion();
    this.guestTeamGoalKeeper.startMotion();

    if (this.match.matchData.gameConfig.mode === "board-football") {
      this.match.guestTeam.startFullMotion();
    }

    if (this.match.matchData.gameConfig.mode === "marble-football") {
      this.match.guestTeam.startSpecificColumnMotion("middleColumn");
      this.updateColumnsMotion();
    }
  }

  defineFootballers() {
    this.hostTeamGoalKeeper =
      this.match.hostTeam.boardFootballPlayers.goalKeeper;
    this.guestTeamGoalKeeper =
      this.match.guestTeam.boardFootballPlayers.goalKeeper;
  }

  updateColumnsMotion() {
    this.match.scene.events.on("update", () => {
      // Check for DefenceColumns
      const hostDefenceDistance = calculateDistance(
        this.match.hostTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerX,
        this.match.hostTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );
      const guestDefenceDistance = calculateDistance(
        this.match.guestTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerX,
        this.match.guestTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );

      if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
        guestDefenceDistance < 100
          ? this.match.guestTeam.startSpecificColumnMotion("defenceColumn")
          : this.match.guestTeam.stopSpecificColumnMotion("defenceColumn");
      }
      if (this.match.matchManager.teamWhoHasBall === "guestTeam") {
        hostDefenceDistance < 100
          ? this.match.hostTeam.startSpecificColumnMotion("defenceColumn")
          : this.match.hostTeam.stopSpecificColumnMotion("defenceColumn");
      }

      // Check for MiddleColumns
      const hostMiddleDistance = calculateDistance(
        this.match.hostTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerX,
        this.match.hostTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );
      const guestMiddleDistance = calculateDistance(
        this.match.guestTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerX,
        this.match.guestTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );

      console.log(guestMiddleDistance);
      if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
        // Check if Ball is Left Side
        if (
          this.match.ball.getBounds().centerX <
          this.match.guestTeam.boardFootballPlayers.defenceColumn.getBounds()
            .centerX
        ) {
          guestMiddleDistance < 150
            ? this.match.guestTeam.startSpecificColumnMotion("middleColumn")
            : this.match.guestTeam.stopSpecificColumnMotion("middleColumn");
        }
      }
      if (this.match.matchManager.teamWhoHasBall === "guestTeam") {
        hostMiddleDistance < 150
          ? this.match.hostTeam.startSpecificColumnMotion("middleColumn")
          : this.match.hostTeam.stopSpecificColumnMotion("middleColumn");
      }

      // Check for AttackColumns
      const hostAttackDistance = calculateDistance(
        this.match.hostTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerX,
        this.match.hostTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );
      const guestAttackDistance = calculateDistance(
        this.match.guestTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerX,
        this.match.guestTeam.boardFootballPlayers.defenceColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );

      if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
        guestAttackDistance < 100
          ? this.match.guestTeam.startSpecificColumnMotion("attackColumn")
          : this.match.guestTeam.stopSpecificColumnMotion("attackColumn");
      }
      if (this.match.matchManager.teamWhoHasBall === "guestTeam") {
        hostAttackDistance < 100
          ? this.match.hostTeam.startSpecificColumnMotion("attackColumn")
          : this.match.hostTeam.stopSpecificColumnMotion("attackColumn");
      }
    });
  }
}
