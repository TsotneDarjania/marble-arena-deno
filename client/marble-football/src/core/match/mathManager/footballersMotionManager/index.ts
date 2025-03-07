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
      if (this.match.matchManager.matchEvenetManager.matchStatus !== "playing")
        return;
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
        // Check if Ball is Left Side
        if (
          this.match.ball.getBounds().centerX <
          this.match.guestTeam.boardFootballPlayers.defenceColumn.getBounds()
            .centerX
        ) {
          guestDefenceDistance < 260
            ? this.match.guestTeam.startSpecificColumnMotion("defenceColumn")
            : this.match.guestTeam.stopSpecificColumnMotion("defenceColumn");
        } else {
          this.match.guestTeam.stopSpecificColumnMotion("defenceColumn");
        }
      }
      if (this.match.matchManager.teamWhoHasBall === "guestTeam") {
        if (
          this.match.ball.getBounds().centerX >
          this.match.hostTeam.boardFootballPlayers.defenceColumn.getBounds()
            .centerX
        ) {
          hostDefenceDistance < 260
            ? this.match.hostTeam.startSpecificColumnMotion("defenceColumn")
            : this.match.hostTeam.stopSpecificColumnMotion("defenceColumn");
        } else {
          this.match.hostTeam.stopSpecificColumnMotion("defenceColumn");
        }
      }

      // Check for MiddleColumns
      const hostMiddleDistance = calculateDistance(
        this.match.hostTeam.boardFootballPlayers.middleColumn.getBounds()
          .centerX,
        this.match.hostTeam.boardFootballPlayers.middleColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );
      const guestMiddleDistance = calculateDistance(
        this.match.guestTeam.boardFootballPlayers.middleColumn.getBounds()
          .centerX,
        this.match.guestTeam.boardFootballPlayers.middleColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );

      if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
        // Check if Ball is Left Side
        if (
          this.match.ball.getBounds().centerX <
          this.match.guestTeam.boardFootballPlayers.middleColumn.getBounds()
            .centerX
        ) {
          guestMiddleDistance < 250
            ? this.match.guestTeam.startSpecificColumnMotion("middleColumn")
            : this.match.guestTeam.stopSpecificColumnMotion("middleColumn");
        } else {
          this.match.guestTeam.stopSpecificColumnMotion("middleColumn");
        }
      } else {
        this.match.guestTeam.stopSpecificColumnMotion("middleColumn");
      }
      if (this.match.matchManager.teamWhoHasBall === "guestTeam") {
        if (
          this.match.ball.getBounds().centerX >
          this.match.hostTeam.boardFootballPlayers.middleColumn.getBounds()
            .centerX
        ) {
          hostMiddleDistance < 250
            ? this.match.hostTeam.startSpecificColumnMotion("middleColumn")
            : this.match.hostTeam.stopSpecificColumnMotion("middleColumn");
        } else {
          this.match.hostTeam.stopSpecificColumnMotion("middleColumn");
        }
      } else {
        this.match.hostTeam.stopSpecificColumnMotion("middleColumn");
      }

      // Check for AttackColumns
      const hostAttackDistance = calculateDistance(
        this.match.hostTeam.boardFootballPlayers.attackColumn.getBounds()
          .centerX,
        this.match.hostTeam.boardFootballPlayers.attackColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );
      const guestAttackDistance = calculateDistance(
        this.match.guestTeam.boardFootballPlayers.attackColumn.getBounds()
          .centerX,
        this.match.guestTeam.boardFootballPlayers.attackColumn.getBounds()
          .centerY,
        this.match.ball.getBounds().centerX,
        this.match.ball.getBounds().centerY
      );

      if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
        // Check if Ball is Left Side
        if (
          this.match.ball.getBounds().centerX <
          this.match.guestTeam.boardFootballPlayers.attackColumn.getBounds()
            .centerX
        ) {
          guestAttackDistance < 260
            ? this.match.guestTeam.startSpecificColumnMotion("attackColumn")
            : this.match.guestTeam.stopSpecificColumnMotion("attackColumn");
        } else {
          this.match.guestTeam.stopSpecificColumnMotion("attackColumn");
        }
      }
      if (this.match.matchManager.teamWhoHasBall === "guestTeam") {
        if (
          this.match.ball.getBounds().centerX >
          this.match.hostTeam.boardFootballPlayers.attackColumn.getBounds()
            .centerX
        ) {
          hostAttackDistance < 260
            ? this.match.hostTeam.startSpecificColumnMotion("attackColumn")
            : this.match.hostTeam.stopSpecificColumnMotion("attackColumn");
        } else {
          this.match.hostTeam.stopSpecificColumnMotion("attackColumn");
        }
      }

      if (this.match.matchManager.teamWhoHasBall === "hostTeam") {
        this.match.hostTeam.stopFullMotion();
      }
      if (this.match.matchManager.teamWhoHasBall === "guestTeam") {
        this.match.guestTeam.stopFullMotion();
      }
    });
  }
}
