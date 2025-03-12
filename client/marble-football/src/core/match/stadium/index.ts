import { stadiumConfig } from "../../../config/matchConfig";
import GamePlay from "../../../scenes/GamePlay";
import { calculatePercentage } from "../../../utils/math";
import Spectators from "./spectators";
import StadiumColliders from "./stadiumColliders";
import StadiumLight from "./stadiumLight";

export class Stadium extends Phaser.GameObjects.Container {
  stadiumWidth = 1193;
  stadiumHeight = 577;

  fieldImageWidth = 1143;
  fieldImageHeight = 536;

  innerFielddWidth = 982;
  innerFielddHeight = 506;

  spectators: Spectators;

  stadiumField: Phaser.GameObjects.Image;

  light1: StadiumLight;
  light2: StadiumLight;
  light3: StadiumLight;
  light4: StadiumLight;
  light5: StadiumLight;
  light6: StadiumLight;
  light7: StadiumLight;

  lightsContainer: Phaser.GameObjects.Container;

  stadiumColliders: StadiumColliders;

  constructor(public scene: GamePlay, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
    this.setDepth(100);
  }

  init() {
    this.addSpectatorsBakcground();
    this.addfield();
    this.addSpectators();
    this.addSurounding();

    this.addLights();
    this.addColliders();

    this.addGrids();
  }

  addGrids() {
    const leftGrid = this.scene.add.image(0, 0, "grid");
    leftGrid.x = -calculatePercentage(44.1, this.stadiumWidth);
    leftGrid.setDisplaySize(30, leftGrid.height - 10);
    leftGrid.y = -1;
    this.add(leftGrid);

    const rightGrid = this.scene.add.image(0, 0, "grid");
    rightGrid.x = calculatePercentage(44.1, this.stadiumWidth);
    rightGrid.setDisplaySize(30, leftGrid.height - 10);
    rightGrid.y = -1;
    this.add(rightGrid);
  }

  addSpectatorsBakcground() {
    const stadiumBck = this.scene.add.image(
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2 + 80,
      "stadiumBck"
    );
    stadiumBck.setTint(stadiumConfig.spectatorsBackground);
    stadiumBck.setScale(0.8);
  }

  addfield() {
    this.stadiumField = this.scene.add.image(
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2,
      "stadiumLines"
    );
    this.stadiumField.setDisplaySize(
      this.fieldImageWidth, 
      this.fieldImageHeight
    );
  }

  addSpectators() {
    this.spectators = new Spectators(this.scene, this);
    this.spectators.setPosition(0, -20);
    this.add(this.spectators);
  }

  addSurounding() {
    const stadiumSurrounding = this.scene.add.image(
      0,
      30,
      "stadiumSurrounding"
    );

    stadiumSurrounding.setTint(0xffffff);
    this.add(stadiumSurrounding);
  }

  addLights() {
    this.lightsContainer = this.scene.add.container();
    this.lightsContainer.setPosition(0, -20);

    this.light1 = new StadiumLight(this.scene, 0, -320);
    this.lightsContainer.add(this.light1);

    this.light2 = new StadiumLight(this.scene, -400, -320);
    this.lightsContainer.add(this.light2);

    this.light3 = new StadiumLight(this.scene, 400, -320);
    this.lightsContainer.add(this.light3);

    this.light4 = new StadiumLight(this.scene, -660, -200);
    this.light4.setRotation(-0.85398);
    this.lightsContainer.add(this.light4);

    this.light5 = new StadiumLight(this.scene, 650, -184);
    this.light5.setRotation(0.805398);
    this.lightsContainer.add(this.light5);

    this.light6 = new StadiumLight(this.scene, -650, 289);
    this.light6.setRotation(-2.4036);
    this.lightsContainer.add(this.light6);

    this.light7 = new StadiumLight(this.scene, 650, 279);
    this.light7.setRotation(2.2736);
    this.lightsContainer.add(this.light7);

    this.add(this.lightsContainer);
  }

  startGoalSelebration(team: "host" | "guest") {
    this.scene.soundManager.goalSelebration.play();

    this.light1.startAnimation(false);
    this.light2.startAnimation(false);
    this.light3.startAnimation(false);
    this.light4.startAnimation(true);
    this.light5.startAnimation(false);
    this.light6.startAnimation(true);
    this.light7.startAnimation(false);

    this.spectators.startGoalSelebration(team);
  }

  stopGoalSelebration() {
    this.light1.stopAnimation();
    this.light2.stopAnimation();
    this.light3.stopAnimation();
    this.light4.stopAnimation();
    this.light5.stopAnimation();
    this.light6.stopAnimation();
    this.light7.stopAnimation();

    this.spectators.stopGoalSelebration();
  }

  addColliders() {
    this.stadiumColliders = new StadiumColliders(this.scene, this);
  }
}
