import GamePlay from "../../../scenes/GamePlay";
import Spectators from "./spectators";
import StadiumColliders from "./stadiumColliders";
import StadiumLight from "./stadiumLight";

export class Stadium extends Phaser.GameObjects.Container {
  stadiumWidth = 1193;
  stadiumHeight = 577;

  fieldWidth = 1043;
  fieldHeight = 576;

  spectators: Spectators;

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
    this.addBakcground();
    this.addLines();
    this.addSpectators();
    this.addSurounding();

    this.addLights();
    this.addColliders();
  }

  addBakcground() {
    const stadiumBck = this.scene.add.image(
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2,
      "stadiumBck"
    );
    stadiumBck.setTint(0x9fa7ab);
    stadiumBck.setScale(0.8);
  }

  addLines() {
    const stadiumLines = this.scene.add.image(
      this.scene.game.canvas.width / 2,
      this.scene.game.canvas.height / 2,
      "stadiumLines"
    );
    stadiumLines.setDisplaySize(this.stadiumWidth, this.stadiumHeight);
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

    stadiumSurrounding.setTint(0x07211b);
    this.add(stadiumSurrounding);
  }

  addLights() {
    this.lightsContainer = this.scene.add.container();
    this.lightsContainer.setPosition(0, -15);

    this.light1 = new StadiumLight(this.scene, 0, -320);
    this.lightsContainer.add(this.light1);

    this.light2 = new StadiumLight(this.scene, -400, -320);
    this.lightsContainer.add(this.light2);

    this.light3 = new StadiumLight(this.scene, 400, -320);
    this.lightsContainer.add(this.light3);

    this.light4 = new StadiumLight(this.scene, -650, -200);
    this.light4.setRotation(-0.785398);
    this.lightsContainer.add(this.light4);

    this.light5 = new StadiumLight(this.scene, 650, -190);
    this.light5.setRotation(0.785398);
    this.lightsContainer.add(this.light5);

    this.light6 = new StadiumLight(this.scene, -650, 287);
    this.light6.setRotation(-2.3736);
    this.lightsContainer.add(this.light6);

    this.light7 = new StadiumLight(this.scene, 650, 277);
    this.light7.setRotation(2.3736);
    this.lightsContainer.add(this.light7);

    this.add(this.lightsContainer);
  }

  goalSelebration(team: "host" | "guest") {
    this.light1.makeAnimation(false);
    this.light2.makeAnimation(false);
    this.light3.makeAnimation(false);
    this.light4.makeAnimation(true);
    this.light5.makeAnimation(false);
    this.light6.makeAnimation(true);
    this.light7.makeAnimation(false);

    this.spectators.goalSelebration(team);
  }

  addColliders() {
    this.stadiumColliders = new StadiumColliders(this.scene, this);
  }
}
