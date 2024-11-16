import Spectators from "./spectators";
import StadiumLight from "./stadiumLight";

export class Stadium extends Phaser.GameObjects.Container {
  stadiumWidth = 1176;
  stadiumHeight = 599;

  spectators: Spectators;

  light1: StadiumLight;
  light2: StadiumLight;
  light3: StadiumLight;
  light4: StadiumLight;
  light5: StadiumLight;
  light6: StadiumLight;
  light7: StadiumLight;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.addBakcground();
    this.addLines();
    this.addSpectators();
    this.addSurounding();

    this.addLights();
  }

  addBakcground() {
    const stadiumBck = this.scene.add.image(0, 85, "stadiumBck");
    stadiumBck.setTint(0xcccccc);
    stadiumBck.setScale(0.8);
    this.add(stadiumBck);
  }

  addLines() {
    const stadiumLines = this.scene.add.image(0, 0, "stadiumLines");
    stadiumLines.setDisplaySize(this.stadiumWidth, this.stadiumHeight);
    this.add(stadiumLines);
  }

  addSpectators() {
    this.spectators = new Spectators(this);
  }

  addSurounding() {
    const stadiumSurrounding = this.scene.add.image(
      0,
      45,
      "stadiumSurrounding"
    );

    stadiumSurrounding.setTint(0x131c19);
    this.add(stadiumSurrounding);
  }

  addLights() {
    this.light1 = new StadiumLight(this.scene, 0, -320);
    this.add(this.light1);

    this.light2 = new StadiumLight(this.scene, -400, -320);
    this.add(this.light2);

    this.light3 = new StadiumLight(this.scene, 400, -320);
    this.add(this.light3);

    this.light4 = new StadiumLight(this.scene, -650, -200);
    this.light4.setRotation(-0.785398);
    this.add(this.light4);

    this.light5 = new StadiumLight(this.scene, 650, -190);
    this.light5.setRotation(0.785398);
    this.add(this.light5);

    this.light6 = new StadiumLight(this.scene, -650, 287);
    this.light6.setRotation(-2.3736);
    this.add(this.light6);

    this.light7 = new StadiumLight(this.scene, 650, 277);
    this.light7.setRotation(2.3736);
    this.add(this.light7);
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
}
