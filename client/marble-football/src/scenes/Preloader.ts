import { Scene } from "phaser";

export default class Preload extends Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.load.setPath("assets/");

    // Stadium
    this.load.image("stadiumLines", "image/gameObjects/stadium-lines.png");
    this.load.image("spectatorLine", "image/gameObjects/spectator-line.png");
    this.load.image(
      "spectatorLine13",
      "image/gameObjects/spectator-line-13.png"
    );
    this.load.image(
      "stadiumSurrounding",
      "image/gameObjects/stadium-surrounding.png"
    );
    this.load.image("stadiumBck", "image/gameObjects/stadium-bck.png");
    this.load.image("stadiumLight", "image/gameObjects/stadium-light.png");
    this.load.image("triangle", "image/gameObjects/triangle.png");

    // UI
    this.load.image("defaultButton", "image/ui/default-button.png");
    this.load.image("default", "image/ui/default.png");
    this.load.image("cameraZoomButton", "image/ui/camera-zoom-button.png");
    this.load.image("matchIndicatorBck", "image/ui/match-indicator-bck.png");
    this.load.image("penaltyDone", "image/ui/penalty-done.png");
    this.load.image("penaltyFail", "image/ui/penalty-fail.png");

    // Default Team Logos
    this.load.image(
      "manchester-city",
      "image/teamLogos/premierLeague/Manchester-City.png"
    );
    this.load.image(
      "manchester-united",
      "image/teamLogos/premierLeague/Manchester-United.png"
    );
    this.load.image("liverpool", "image/teamLogos/premierLeague/Liverpool.png");

    // GameObjects
    this.load.image("ball", "image/gameObjects/ball.png");
    this.load.image("circle", "image/gameObjects/circle.png");

    //sounds
    this.load.audio("stadium-noice", ["sounds/fans-2.mp3"]);
    this.load.audio("time-start-referee", ["sounds/time-start-referee.mp3"]);
    this.load.audio("pass", ["sounds/pass.mp3"]);
    this.load.audio("catch-ball", ["sounds/catch-ball.mp3"]);
    this.load.audio("shoot", ["sounds/shoot.mp3"]);
    this.load.audio("goalBorder", ["sounds/goal-border.mp3"]);
    this.load.audio("border", ["sounds/border.mp3"]);
    this.load.audio("goalSelebration", ["sounds/goal-2.mp3"]);
  }

  create() {
    this.scene.start("Menu");
  }
}
