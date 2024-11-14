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

  topLeftAngleSpectatroContainer: Phaser.GameObjects.Container;
  topLeftAngleSpectators: Array<SpectatorsGroup>;

  topRightAngleSpectatroContainer: Phaser.GameObjects.Container;
  topRightAngleSpectators: Array<SpectatorsGroup>;

  bottomLeftAngleSpectatroContainer: Phaser.GameObjects.Container;
  bottomLeftAngleSpectators: Array<SpectatorsGroup>;

  bottomRightAngleSpectatroContainer: Phaser.GameObjects.Container;
  bottomRightAngleSpectators: Array<SpectatorsGroup>;

  allSpectators: Array<Array<SpectatorsGroup>>;

  constructor(public stadium: Stadium) {
    this.init();
  }

  init() {
    this.allSpectators = [];

    this.topSpectators = [];
    this.bottomSpectators = [];
    this.leftSpectators = [];
    this.rightSpectators = [];
    this.topLeftAngleSpectators = [];
    this.topRightAngleSpectators = [];
    this.bottomLeftAngleSpectators = [];
    this.bottomRightAngleSpectators = [];

    this.addTopSpectators();
    this.addBottomSpectators();
    this.addLeftSpectators();
    this.addRightSpectators();
    this.addTopLeftAngleSpectators();
    this.addTopRightAngleSpectators();
    this.addBottomLeftAngleSpectators();
    this.addBottomRightAngleSpectators();

    this.combineAllSpectators();
  }

  addTopSpectators() {
    this.topSpectatorsContainer = this.stadium.scene.add.container(
      0,
      -this.stadium.stadiumHeight / 2
    );

    let posX = 0;
    let posY = -170;

    for (let i = 1; i < 4; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5,
        "spectatorLine"
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

    for (let i = 1; i < 4; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5,
        "spectatorLine"
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

    this.bottomSpectatorsContainer.setPosition(440, 715);
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

    for (let i = 1; i < 3; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5,
        "spectatorLine13"
      );
      spectatorsGroup.setScale(0.8);
      this.leftSpectatorsContainer.add(spectatorsGroup);
      this.leftSpectators.push(spectatorsGroup);

      posY += 210;
    }

    this.leftSpectatorsContainer.setPosition(-970, 222);
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

    for (let i = 1; i < 3; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5,
        "spectatorLine13"
      );
      spectatorsGroup.setScale(0.8);
      this.rightSpectatorsContainer.add(spectatorsGroup);
      this.rightSpectators.push(spectatorsGroup);

      posY += 210;
    }

    this.rightSpectatorsContainer.setPosition(970, -180);
    this.rightSpectatorsContainer.setRotation(1.5708);
    this.stadium.add(this.rightSpectatorsContainer);
  }

  addTopLeftAngleSpectators() {
    this.topLeftAngleSpectatroContainer = this.stadium.scene.add.container(
      -this.stadium.stadiumWidth / 2,
      -this.stadium.stadiumHeight / 2
    );

    let posX = 0;
    let posY = 0;

    for (let i = 0; i < 2; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5,
        "spectatorLine"
      );
      spectatorsGroup.setScale(0.8);
      this.topLeftAngleSpectatroContainer.add(spectatorsGroup);
      this.topLeftAngleSpectators.push(spectatorsGroup);

      posY += 210;
    }

    this.topLeftAngleSpectatroContainer.setPosition(-900, -455);
    this.topLeftAngleSpectatroContainer.setRotation(-0.785398);
    this.stadium.add(this.topLeftAngleSpectatroContainer);
  }

  addTopRightAngleSpectators() {
    this.topRightAngleSpectatroContainer = this.stadium.scene.add.container(
      this.stadium.stadiumWidth / 2,
      -this.stadium.stadiumHeight / 2
    );

    let posX = 0;
    let posY = 0;

    for (let i = 0; i < 2; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5,
        "spectatorLine"
      );
      spectatorsGroup.setScale(0.8);
      this.topRightAngleSpectatroContainer.add(spectatorsGroup);
      this.topRightAngleSpectators.push(spectatorsGroup);

      posY += 210;
    }

    this.topRightAngleSpectatroContainer.setPosition(715, -650);
    this.topRightAngleSpectatroContainer.setRotation(0.785398);
    this.stadium.add(this.topRightAngleSpectatroContainer);
  }

  addBottomLeftAngleSpectators() {
    this.bottomLeftAngleSpectatroContainer = this.stadium.scene.add.container(
      -this.stadium.stadiumWidth / 2,
      this.stadium.stadiumHeight / 2
    );

    let posX = 0;
    let posY = 0;

    for (let i = 0; i < 2; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5,
        "spectatorLine"
      );
      spectatorsGroup.setScale(0.8);
      this.bottomLeftAngleSpectatroContainer.add(spectatorsGroup);
      this.bottomLeftAngleSpectators.push(spectatorsGroup);

      posY += 210;
    }

    this.bottomLeftAngleSpectatroContainer.setPosition(-705, 690);
    this.bottomLeftAngleSpectatroContainer.setRotation(-2.35619);
    this.stadium.add(this.bottomLeftAngleSpectatroContainer);
  }

  addBottomRightAngleSpectators() {
    this.bottomRightAngleSpectatroContainer = this.stadium.scene.add.container(
      this.stadium.stadiumWidth / 2,
      this.stadium.stadiumHeight / 2
    );

    let posX = 0;
    let posY = 0;

    for (let i = 0; i < 2; i++) {
      const spectatorsGroup = new SpectatorsGroup(
        this.stadium.scene,
        posX,
        posY,
        5,
        "spectatorLine"
      );
      spectatorsGroup.setScale(0.8);
      this.bottomRightAngleSpectatroContainer.add(spectatorsGroup);
      this.bottomRightAngleSpectators.push(spectatorsGroup);

      posY += 210;
    }

    this.bottomRightAngleSpectatroContainer.setPosition(907, 497);
    this.bottomRightAngleSpectatroContainer.setRotation(2.35619);
    this.stadium.add(this.bottomRightAngleSpectatroContainer);
  }

  combineAllSpectators() {
    this.allSpectators = [
      this.topSpectators,
      this.bottomSpectators,
      this.leftSpectators,
      this.rightSpectators,
      this.topLeftAngleSpectators,
      this.topRightAngleSpectators,
      this.bottomLeftAngleSpectators,
      this.bottomRightAngleSpectators,
    ];
  }

  set fansColor(newColor: number) {
    this.allSpectators.forEach((spectatorsGroup) => {
      spectatorsGroup.forEach((spectator) => {
        spectator.color = newColor;
      });
    });
  }
}
