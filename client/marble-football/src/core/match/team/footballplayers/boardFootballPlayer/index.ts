import Match from "../../..";
import GamePlay from "../../../../../scenes/GamePlay";
import {
  FootballPlayerData,
  TeamDataType,
} from "../../../../../types/gameTypes";

export default class BoardFootballPlayer extends Phaser.GameObjects.Container {
  image: Phaser.Physics.Arcade.Image;
  match: Match;

  withBall = false;

  playerData: FootballPlayerData;

  constructor(
    scene: GamePlay,
    x: number,
    y: number,
    public teamData: TeamDataType
  ) {
    super(scene, x, y);

    this.init();
  }

  init() {
    this.setScale(0.6);
    this.addImage();
    this.setDepth(100);
  }

  addImage() {
    this.image = this.scene.physics.add.image(0, 0, this.teamData.logoKey);
    this.image.setCircle(30);
    this.add(this.image);
  }

  addCollider() {
    this.scene.physics.add.overlap(this.match.ball, this.image, () => {
      if (!this.withBall) {
        this.withBall = true;
        this.takeBall();
      }
    });
  }

  set setMatch(match: Match) {
    this.match = match;
  }

  set setPlayerData(playerData: FootballPlayerData) {
    this.playerData = playerData;
  }

  takeBall() {
    this.match.ball.stop();
    this.match.ball.goTowardFootballer(this);

    this.match.matchManager.someoneTakeBall(this);

    setTimeout(() => {
      this.makeDesition();
    }, 500);
  }

  makeDesition() {
    if (this.match.matchManager.matchStatus === "playing") {
    }
  }

  makePass() {}
}
