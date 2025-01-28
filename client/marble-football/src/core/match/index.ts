import GamePlay from "../../scenes/GamePlay";
import { FootballPlayerData, MatchDataType } from "../../types/gameTypes";
import { Ball } from "./ball";
import CollisionDetector from "./collisionDetector";
import { MatchIntroEnvironment } from "./matchIntroEnvironment";
import MatchManager from "./mathManager";
import { Stadium } from "./stadium";
import Team from "./team";
import BoardFootballPlayer from "./team/footballplayers/boardFootballPlayer";
import TimeManager from "./timeManager";

export default class Match {
  stadium: Stadium;
  ball: Ball;

  hostTeam: Team;
  guestTeam: Team;

  collisionDetector: CollisionDetector;

  timer: TimeManager;

  matchManager: MatchManager;

  matchIntroEnvironment!: MatchIntroEnvironment;

  constructor(public matchData: MatchDataType, public scene: GamePlay) {
    this.init();
  }

  init() {
    this.addStadium();
    this.setFanColors();
    this.addTimer();
  }

  addStadium() {
    this.stadium = new Stadium(
      this.scene,
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2
    );
  }

  setFanColors() {
    this.stadium.spectators.fanColors = {
      hostColor: this.matchData.hostTeamData.fansColor,
      guestColor: this.matchData.guestTeamData.fansColor,
      hostQuantityPercent: 45,
    };
  }

  showMatchIntroEnvironment() {
    this.matchIntroEnvironment = new MatchIntroEnvironment(this);
  }

  startMatch() {
    this.matchIntroEnvironment.destroy();

    setTimeout(() => {
      this.addBall();
      this.addTeams();
      this.setMatchInstanceForFootballers();
      this.addCollisionDetector();
      this.addMatchManager();

      this.scene.soundManager.timeStartReferee.play();
    }, 1500);

    setTimeout(() => {
      this.matchManager.startMatch();
      this.scene.soundManager.pass.play();
    }, 2000);
  }

  addMatchManager() {
    this.matchManager = new MatchManager(this);
  }

  setColliderAndDataToFootballers(
    footballer: BoardFootballPlayer,
    data: FootballPlayerData
  ) {
    footballer.setMatch = this;
    footballer.playerData = data;
    footballer.addCollider();
  }

  setMatchInstanceForFootballers() {
    this.hostTeam.boardFootballPlayers.goalKeeper.setMatch = this;
    this.setColliderAndDataToFootballers(
      this.hostTeam.boardFootballPlayers.goalKeeper,
      {
        who: "hostPlayer",
        position: "goalKeeper",
      }
    );
    this.hostTeam.boardFootballPlayers.defenceColumn.footballers.forEach(
      (footballer) => {
        this.setColliderAndDataToFootballers(footballer, {
          who: "hostPlayer",
          potentialShortPassVariants:
            this.hostTeam.boardFootballPlayers.middleColumn.footballers,
          potentialLongPassVariants:
            this.hostTeam.boardFootballPlayers.attackColumn.footballers,
          position: "defender",
        });
      }
    );
    this.hostTeam.boardFootballPlayers.middleColumn.footballers.forEach(
      (footballer) => {
        this.setColliderAndDataToFootballers(footballer, {
          who: "hostPlayer",
          potentialShortPassVariants:
            this.hostTeam.boardFootballPlayers.attackColumn.footballers,
          position: "middfielder",
        });
      }
    );
    this.hostTeam.boardFootballPlayers.attackColumn.footballers.forEach(
      (footballer) => {
        this.setColliderAndDataToFootballers(footballer, {
          who: "hostPlayer",
          position: "attacker",
        });
      }
    );

    this.guestTeam.boardFootballPlayers.goalKeeper.setMatch = this;
    this.setColliderAndDataToFootballers(
      this.guestTeam.boardFootballPlayers.goalKeeper,
      {
        who: "guestPlayer",
        position: "goalKeeper",
      }
    );
    this.guestTeam.boardFootballPlayers.defenceColumn.footballers.forEach(
      (footballer) => {
        this.setColliderAndDataToFootballers(footballer, {
          who: "guestPlayer",
          potentialShortPassVariants:
            this.guestTeam.boardFootballPlayers.middleColumn.footballers,
          potentialLongPassVariants:
            this.guestTeam.boardFootballPlayers.attackColumn.footballers,
          position: "defender",
        });
      }
    );
    this.guestTeam.boardFootballPlayers.middleColumn.footballers.forEach(
      (footballer) => {
        this.setColliderAndDataToFootballers(footballer, {
          who: "guestPlayer",
          potentialShortPassVariants:
            this.guestTeam.boardFootballPlayers.attackColumn.footballers,
          position: "middfielder",
        });
      }
    );
    this.guestTeam.boardFootballPlayers.attackColumn.footballers.forEach(
      (footballer) => {
        this.setColliderAndDataToFootballers(footballer, {
          who: "guestPlayer",
          position: "attacker",
        });
      }
    );
  }

  addBall() {
    this.ball = new Ball(
      this.scene,
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2,
      this.stadium
    );
  }

  addTeams() {
    this.hostTeam = new Team(
      this.scene,
      this.matchData.hostTeamData,
      this.matchData.gameConfig,
      this.stadium,
      "left"
    );

    this.guestTeam = new Team(
      this.scene,
      this.matchData.guestTeamData,
      this.matchData.gameConfig,
      this.stadium,
      "right"
    );
  }

  addCollisionDetector() {
    this.collisionDetector = new CollisionDetector(this.scene, this);
  }

  addTimer() {
    this.timer = new TimeManager(this, this.scene);
  }
}
