import { Stadium } from "..";
import GamePlay from "../../../../scenes/GamePlay";

export default class StadiumColliders {
  topCollider: Phaser.Physics.Arcade.Body;
  bottomCollider: Phaser.Physics.Arcade.Body;
  leftTopCollider: Phaser.Physics.Arcade.Body;
  leftBottomCollider: Phaser.Physics.Arcade.Body;
  rightTopCollider: Phaser.Physics.Arcade.Body;
  rightBottomCollider: Phaser.Physics.Arcade.Body;

  borderColliders: Phaser.Physics.Arcade.Body[];

  leftGoalColliders: Phaser.Physics.Arcade.Body[];
  rightGoalColliders: Phaser.Physics.Arcade.Body[];

  constructor(public scene: GamePlay, public stadium: Stadium) {
    this.init();
  }

  init() {
    this.addBorderColliders();
    this.addGoalColliders();
  }

  addGoalColliders() {
    // Left
    this.leftGoalColliders = [];

    const leftTop = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.fieldWidth / 2 - 60,
      287,
      60,
      13
    );

    const leftBottom = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.fieldWidth / 2 - 60,
      445,
      60,
      13
    );

    const leftBase = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.fieldWidth / 2 - 70,
      288,
      13,
      170
    );

    this.leftGoalColliders.push(leftTop, leftBottom, leftBase);

    // Right
    this.rightGoalColliders = [];

    const rightTop = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.fieldWidth / 2,
      287,
      60,
      13
    );

    const rightBottom = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.fieldWidth / 2,
      445,
      60,
      13
    );

    const rightBase = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.fieldWidth / 2 + 56,
      288,
      13,
      170
    );

    this.leftGoalColliders.push(rightTop, rightBottom, rightBase);
  }

  addBorderColliders() {
    this.borderColliders = [];

    this.topCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.fieldWidth / 2,
      this.scene.game.canvas.height / 2 - this.stadium.fieldHeight / 2,
      this.stadium.fieldWidth,
      13
    );
    this.topCollider.setImmovable(true);

    this.bottomCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.fieldWidth / 2,
      this.scene.game.canvas.height / 2 + this.stadium.fieldHeight / 2 - 13,
      this.stadium.fieldWidth,
      13
    );
    this.bottomCollider.setImmovable(true);

    this.leftTopCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.fieldWidth / 2 - 13,
      this.scene.game.canvas.height / 2 - this.stadium.fieldHeight / 2,
      13,
      210
    );
    this.leftTopCollider.setImmovable(true);

    this.leftBottomCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.fieldWidth / 2 - 13,
      this.scene.game.canvas.height / 2 + this.stadium.fieldHeight / 2 - 210,
      13,
      210
    );
    this.leftBottomCollider.setImmovable(true);

    this.rightTopCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.fieldWidth / 2,
      this.scene.game.canvas.height / 2 - this.stadium.fieldHeight / 2,
      13,
      210
    );
    this.rightTopCollider.setImmovable(true);

    this.rightBottomCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.fieldWidth / 2,
      this.scene.game.canvas.height / 2 + this.stadium.fieldHeight / 2 - 210,
      13,
      210
    );
    this.rightBottomCollider.setImmovable(true);

    this.borderColliders.push(
      this.topCollider,
      this.bottomCollider,
      this.leftTopCollider,
      this.leftBottomCollider,
      this.rightTopCollider,
      this.rightBottomCollider
    );
  }
}
