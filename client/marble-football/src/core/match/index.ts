import GamePlay from "../../scenes/GamePlay";
import {
  FootballPlayerData,
  GameConfigType,
  TeamDataType,
} from "../../types/gameTypes";
import { Ball } from "./ball";
import CollisionDetector from "./collisionDetector";
import MatchManager from "./mathManager";
import { Stadium } from "./stadium";
import Team from "./team";
import BoardFootballPlayer from "./team/footballplayers/boardFootballPlayer";
import TimeManager from "./timeManager";

export default class Match {
  stadium: Stadium;
  startTeamLogosTween: Phaser.Tweens.Tween;
  startTeamLogos: Phaser.GameObjects.Image[];

  ball: Ball;

  hostTeam: Team;
  guestTeam: Team;

  collisionDetector: CollisionDetector;

  timer: TimeManager;

  matchManager: MatchManager;

  constructor(
    public scene: GamePlay,
    public hostTeamData: TeamDataType,
    public guestTeamData: TeamDataType,
    public gameConfig: GameConfigType
  ) {
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
      hostColor: 0x205c5c,
      guestColor: 0x5c205c,
      hostQuantityPercent: 45,
    };
  }

  goalSelebration(whoScored: "host" | "guest") {
    this.stadium.goalSelebration(whoScored);
  }

  addStartLeyoutTeams() {
    this.startTeamLogos = [];
    // Host team
    let x = -176;
    for (let i = 0; i < 11; i++) {
      const image = this.scene.add
        .image(x, -180, "manchester-city")
        .setScale(0.6);
      this.stadium.add(image);
      this.startTeamLogos.push(image);
      x += 35;
    }

    // Guest team
    x = -176;
    for (let i = 0; i < 11; i++) {
      const image = this.scene.add.image(x, -120, "liverpool").setScale(0.6);
      this.startTeamLogos.push(image);
      this.stadium.add(image);
      x += 35;
    }

    this.startTeamLogosTween = this.scene.tweens.add({
      targets: this.startTeamLogos,
      alpha: 0.4,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  startMatch() {
    this.startTeamLogosTween.destroy();
    this.startTeamLogos.forEach((logo) => logo.destroy(true));

    this.addBall();
    this.addTeams();
    this.setMatchInstanceForFootballers();
    this.addCollisionDetector();
    this.addMatchManager();

    setTimeout(() => {
      this.matchManager.startMatch();
    }, 1000);
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
      this.hostTeamData,
      {
        mode: this.gameConfig.mode,
      },
      this.stadium,
      "left"
    );

    this.guestTeam = new Team(
      this.scene,
      this.guestTeamData,
      {
        mode: "board-football",
      },
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
