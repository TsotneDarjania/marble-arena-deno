import { Tweens } from "phaser";
import { Stadium } from "..";
import GamePlay from "../../../../scenes/GamePlay";
import SpectatorsGroup from "./spectatorsGroup";

export default class Spectators extends Phaser.GameObjects.Container {
  topSpectatorsContainer: Phaser.GameObjects.Container;
  bottomSpectatorsContainer: Phaser.GameObjects.Container;
  leftSpectatorsContainer: Phaser.GameObjects.Container;
  rightSpectatorsContainer: Phaser.GameObjects.Container;
  topLeftAngleSpectatroContainer: Phaser.GameObjects.Container;
  topRightAngleSpectatroContainer: Phaser.GameObjects.Container;
  bottomLeftAngleSpectatroContainer: Phaser.GameObjects.Container;
  bottomRightAngleSpectatroContainer: Phaser.GameObjects.Container;

  allSpectators: Array<Phaser.GameObjects.Bob>;

  hostTeamSpectators: Array<Phaser.GameObjects.Bob>;
  guestTeamSpectators: Array<Phaser.GameObjects.Bob>;

  tween: Tweens.Tween;

  constructor(public scene: GamePlay, public stadium: Stadium) {
    super(scene);
    this.init();
  }

  init() {
    this.allSpectators = [];
    this.hostTeamSpectators = [];
    this.guestTeamSpectators = [];

    this.addTopSpectators();
    this.addTopRightAngleSpectators();
    this.addRightSpectators();
    this.addBottomRightAngleSpectators();
    this.addBottomSpectators();
    this.addBottomLeftAngleSpectators();
    this.addLeftSpectators();
    this.addTopLeftAngleSpectators();
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
      this.allSpectators.push(...spectatorsGroup.images);

      posX += 300;
      if (i % 3 === 0) {
        posY -= 210;
        posX = 0;
      }
    }

    this.topSpectatorsContainer.setPosition(-430, -315);
    this.add(this.topSpectatorsContainer);
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
      this.allSpectators.push(...spectatorsGroup.images);

      posX += 300;
      if (i % 3 === 0) {
        posY += 210;
        posX = 0;
      }
    }

    this.bottomSpectatorsContainer.setPosition(440, 715);
    this.bottomSpectatorsContainer.setRotation(3.14159);
    this.add(this.bottomSpectatorsContainer);
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
      this.allSpectators.push(...spectatorsGroup.images);

      posY += 210;
    }

    this.leftSpectatorsContainer.setPosition(-970, 222);
    this.leftSpectatorsContainer.setRotation(-1.5708);
    this.add(this.leftSpectatorsContainer);
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
      this.allSpectators.push(...spectatorsGroup.images);

      posY += 210;
    }

    this.rightSpectatorsContainer.setPosition(970, -180);
    this.rightSpectatorsContainer.setRotation(1.5708);
    this.add(this.rightSpectatorsContainer);
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
      this.allSpectators.push(...spectatorsGroup.images);

      posY += 210;
    }

    this.topLeftAngleSpectatroContainer.setPosition(-900, -455);
    this.topLeftAngleSpectatroContainer.setRotation(-0.785398);
    this.add(this.topLeftAngleSpectatroContainer);
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
      this.allSpectators.push(...spectatorsGroup.images);

      posY += 210;
    }

    this.topRightAngleSpectatroContainer.setPosition(715, -650);
    this.topRightAngleSpectatroContainer.setRotation(0.785398);
    this.add(this.topRightAngleSpectatroContainer);
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
      this.allSpectators.push(...spectatorsGroup.images);

      posY += 210;
    }

    this.bottomLeftAngleSpectatroContainer.setPosition(-705, 690);
    this.bottomLeftAngleSpectatroContainer.setRotation(-2.35619);
    this.add(this.bottomLeftAngleSpectatroContainer);
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
      this.allSpectators.push(...spectatorsGroup.images);

      posY += 210;
    }

    this.bottomRightAngleSpectatroContainer.setPosition(907, 497);
    this.bottomRightAngleSpectatroContainer.setRotation(2.35619);
    this.add(this.bottomRightAngleSpectatroContainer);
  }

  set fanColors(fansData: {
    hostColor: number;
    guestColor: number;
    hostQuantityPercent: number;
  }) {
    const HostColorQuantity = Math.floor(
      (fansData.hostQuantityPercent / 100) * this.allSpectators.length
    );

    for (let i = 0; i < this.allSpectators.length; i++) {
      if (i < HostColorQuantity) {
        this.hostTeamSpectators.push(this.allSpectators[i]);
        this.allSpectators[i].setTint(fansData.hostColor);
      } else {
        this.guestTeamSpectators.push(this.allSpectators[i]);
        this.allSpectators[i].setTint(fansData.guestColor);
      }
    }
  }

  startGoalSelebration(whoScored: "host" | "guest") {
    this.tween = this.stadium.scene.tweens.add({
      targets:
        whoScored === "host"
          ? this.hostTeamSpectators
          : this.guestTeamSpectators,
      alpha: 0.5,
      y: `-=15`,
      duration: 200,
      yoyo: true,
      repeat: -1,
    });
  }

  stopGoalSelebration() {
    this.tween?.destroy();
    this.stadium.scene.tweens.add({
      targets: [this.hostTeamSpectators, this.guestTeamSpectators],
      alpha: 1,
      y: 0,
      duration: 200,
    });
  }
}
