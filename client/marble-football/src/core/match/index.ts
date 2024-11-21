import GamePlay from "../../scenes/GamePlay";
import { TeamDataType } from "../../types/gameTypes";
import { getRandomIntNumber } from "../../utils/math";
import { Ball } from "./ball";
import CollisionDetector from "./collisionDetector";
import { Stadium } from "./stadium";
import Team from "./team";

export default class Match {
  stadium: Stadium;
  startTeamLogosTween: Phaser.Tweens.Tween;
  startTeamLogos: Phaser.GameObjects.Image[];

  ball: Ball;

  hostTeam: Team;
  guestTeam: Team;

  collisionDetector: CollisionDetector;

  constructor(
    public scene: GamePlay,
    public hostTeamData: TeamDataType,
    public guestTeamData: TeamDataType
  ) {
    this.init();
  }

  init() {
    this.addStadium();
    this.setFanColors();
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
    this.addCollisionDetector();

    setTimeout(() => {
      this.ball.kick(getRandomIntNumber(50, 250));
    }, 1000);
  }

  addBall() {
    this.ball = new Ball(this.scene, 0, 0, this.stadium);
  }

  addTeams() {
    this.hostTeam = new Team(
      this.scene,
      this.hostTeamData,
      {
        mode: "board-football",
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
}
