import { Stadium } from "..";
import SpectatorsGroup from "./spectatorsGroup";

export default class Spectators {
  topSpectatorsContainer: Phaser.GameObjects.Container;
  topSpectators: Array<SpectatorsGroup>;

  bottomSpectatorsContainer: Phaser.GameObjects.Container;
  bottomSpectators: Array<SpectatorsGroup>;

  leftSpectatorsContainer: Phaser.GameObjects.Container;
  leftSpectators: Array<SpectatorsGroup>;

  rightSpectatorsContainer: Phaser.GameObjects.Container;
  rightSpectators: Array<SpectatorsGroup>;

  constructor(public stadium: Stadium) {
    this.init();
  }

  init() {
    this.topSpectators = [];
    this.bottomSpectators = [];
    this.leftSpectators = [];
    this.rightSpectators = [];

    this.addTopSpectators();
    this.addBottomSpectators();
    this.addLeftSpectators();
    this.addRightSpectators();
  }

  addTopSpectators() {
    this.topSpectatorsContainer = this.stadium.scene.add.container(
      0,
      -this.stadium.stadiumHeight / 2
    );

    let posX = 0;
    let posY = -170;

    for (let i = 1; i < 7; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5
      );
      spectatorsGroup.setScale(0.8);
      this.topSpectatorsContainer.add(spectatorsGroup);
      this.topSpectators.push(spectatorsGroup);

      posX += 300;
      if (i % 3 === 0) {
        posY -= 210;
        posX = 0;
      }
    }

    this.topSpectatorsContainer.setPosition(-430, -315);
    this.stadium.add(this.topSpectatorsContainer);
  }

  addBottomSpectators() {
    this.bottomSpectatorsContainer = this.stadium.scene.add.container(
      0,
      this.stadium.stadiumHeight / 2
    );

    let posX = 0;
    let posY = 170;

    for (let i = 1; i < 7; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5
      );
      spectatorsGroup.setScale(0.8);
      this.bottomSpectatorsContainer.add(spectatorsGroup);
      this.bottomSpectators.push(spectatorsGroup);

      posX += 300;
      if (i % 3 === 0) {
        posY += 210;
        posX = 0;
      }
    }

    this.bottomSpectatorsContainer.setPosition(440, 915);
    this.bottomSpectatorsContainer.setRotation(3.14159);
    this.stadium.add(this.bottomSpectatorsContainer);
  }

  addLeftSpectators() {
    this.leftSpectatorsContainer = this.stadium.scene.add.container(
      -this.stadium.stadiumWidth / 2,
      0
    );

    let posX = 0;
    let posY = 0;

    for (let i = 1; i < 5; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5
      );
      spectatorsGroup.setScale(0.8);
      this.leftSpectatorsContainer.add(spectatorsGroup);
      this.leftSpectators.push(spectatorsGroup);

      posX += 300;
      if (i % 2 === 0) {
        posY += 210;
        posX = 0;
      }
    }

    this.leftSpectatorsContainer.setPosition(-970, 307);
    this.leftSpectatorsContainer.setRotation(-1.5708);
    this.stadium.add(this.leftSpectatorsContainer);
  }

  addRightSpectators() {
    this.rightSpectatorsContainer = this.stadium.scene.add.container(
      this.stadium.stadiumWidth / 2,
      0
    );

    let posX = 0;
    let posY = 0;

    for (let i = 1; i < 5; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5
      );
      spectatorsGroup.setScale(0.8);
      this.rightSpectatorsContainer.add(spectatorsGroup);
      this.rightSpectators.push(spectatorsGroup);

      posX += 300;
      if (i % 2 === 0) {
        posY += 210;
        posX = 0;
      }
    }

    this.rightSpectatorsContainer.setPosition(970, -266);
    this.rightSpectatorsContainer.setRotation(1.5708);
    this.stadium.add(this.rightSpectatorsContainer);
  }
}
