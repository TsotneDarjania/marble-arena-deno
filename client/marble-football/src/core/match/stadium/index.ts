import Spectators from "./spectators";

export class Stadium extends Phaser.GameObjects.Container {
  stadiumWidth = 1176;
  stadiumHeight = 599;

  spectators: Spectators;

  stadiumLights: Array<Phaser.GameObjects.Image>;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.stadiumLights = [];

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
    const light1 = this.scene.add.image(0, -320, "stadiumLight").setScale(1.2);
    light1.setTint(0x205c5c);

    this.add(light1);
    this.stadiumLights.push(light1);

    const light2 = this.scene.add
      .image(-400, -320, "stadiumLight")
      .setScale(1.2);
    light2.setTint(0x205c5c);

    this.add(light2);
    this.stadiumLights.push(light2);

    const light3 = this.scene.add
      .image(400, -320, "stadiumLight")
      .setScale(1.2);
    light3.setTint(0x205c5c);

    this.add(light3);
    this.stadiumLights.push(light3);

    const light4 = this.scene.add
      .image(-650, -200, "stadiumLight")
      .setScale(1.2);
    light4.setTint(0x205c5c);
    light4.setRotation(-0.785398);

    this.add(light4);
    this.stadiumLights.push(light4);

    const light5 = this.scene.add
      .image(650, -190, "stadiumLight")
      .setScale(1.2);
    light5.setTint(0x205c5c);
    light5.setRotation(0.785398);

    this.add(light5);
    this.stadiumLights.push(light5);

    const light6 = this.scene.add
      .image(-650, 287, "stadiumLight")
      .setScale(1.2);

    light6.setTint(0x205c5c);
    light6.setRotation(-2.3736);

    this.add(light6);
    this.stadiumLights.push(light6);

    const light7 = this.scene.add.image(650, 277, "stadiumLight").setScale(1.2);

    light7.setTint(0x205c5c);
    light7.setRotation(2.3736);

    this.add(light7);
    this.stadiumLights.push(light7);
  }

  set fansData(fansData: {
    hostColor: number;
    guestColor: number;
    hostQuantityPercent: number;
  }) {
    console.log(fansData);

    this.spectators.fansColor = fansData.hostColor;
  }
}
