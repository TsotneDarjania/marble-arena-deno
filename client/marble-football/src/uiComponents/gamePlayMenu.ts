import GamePlay from "../scenes/GamePlay";

export default class GamePlayMenu extends Phaser.GameObjects.Container {
  constructor(public scene: GamePlay) {
    super(scene);
    scene.add.existing(this);

    this.init();
  }

  init() {}
}
