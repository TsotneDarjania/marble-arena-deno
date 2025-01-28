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
  goalPostColliders: Phaser.Physics.Arcade.Body[];

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
    this.goalPostColliders = [];

    // Left
    this.leftGoalColliders = [];

    const leftTop = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.innerFielddWidth / 2 - 60,
      this.scene.game.canvas.height / 2 - 79,
      60,
      13
    );
    leftTop.setImmovable(true);
    this.goalPostColliders.push(leftTop);

    const leftBottom = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.innerFielddWidth / 2 - 60,
      this.scene.game.canvas.height / 2 + 65,
      60,
      13
    );
    leftBottom.setImmovable(true);
    this.goalPostColliders.push(leftBottom);

    const leftBase = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.innerFielddWidth / 2 - 70,
      this.scene.game.canvas.height / 2 - 85,
      13,
      170
    );
    leftBase.setImmovable(true);
    this.goalPostColliders.push(leftBase);

    this.leftGoalColliders.push(leftTop, leftBottom, leftBase);

    // Right
    this.rightGoalColliders = [];

    const rightTop = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.innerFielddWidth / 2,
      this.scene.game.canvas.height / 2 - 79,
      60,
      13
    );
    rightTop.setImmovable(true);
    this.goalPostColliders.push(rightTop);

    const rightBottom = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.innerFielddWidth / 2,
      this.scene.game.canvas.height / 2 + 65,
      60,
      13
    );
    rightBottom.setImmovable(true);
    this.goalPostColliders.push(rightBottom);

    const rightBase = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.innerFielddWidth / 2 + 56,
      this.scene.game.canvas.height / 2 - 85,
      13,
      170
    );
    rightBase.setImmovable(true);
    this.goalPostColliders.push(rightBase);

    this.leftGoalColliders.push(rightTop, rightBottom, rightBase);
  }

  addBorderColliders() {
    this.borderColliders = [];

    this.topCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.innerFielddWidth / 2,
      this.scene.game.canvas.height / 2 -
        this.stadium.innerFielddHeight / 2 -
        15,
      this.stadium.innerFielddWidth,
      13
    );
    this.topCollider.setImmovable(true);

    this.bottomCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.innerFielddWidth / 2,
      this.scene.game.canvas.height / 2 +
        this.stadium.innerFielddHeight / 2 +
        5,
      this.stadium.innerFielddWidth,
      13
    );
    this.bottomCollider.setImmovable(true);

    this.leftTopCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.innerFielddWidth / 2 - 13,
      this.scene.game.canvas.height / 2 -
        this.stadium.innerFielddHeight / 2 -
        15,
      13,
      180
    );
    this.leftTopCollider.setImmovable(true);

    this.leftBottomCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 - this.stadium.innerFielddWidth / 2 - 13,
      this.scene.game.canvas.height / 2 +
        this.stadium.innerFielddHeight / 2 -
        180,
      13,
      195
    );
    this.leftBottomCollider.setImmovable(true);

    this.rightTopCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.innerFielddWidth / 2,
      this.scene.game.canvas.height / 2 -
        this.stadium.innerFielddHeight / 2 -
        15,
      13,
      195
    );
    this.rightTopCollider.setImmovable(true);

    this.rightBottomCollider = this.scene.physics.add.body(
      this.scene.game.canvas.width / 2 + this.stadium.innerFielddWidth / 2,
      this.scene.game.canvas.height / 2 +
        this.stadium.innerFielddHeight / 2 -
        187,
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
