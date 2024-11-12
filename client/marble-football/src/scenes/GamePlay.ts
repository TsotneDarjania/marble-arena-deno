import * as Phaser from "phaser";
import { CameraController, Match } from "../core";

export default class GamePlay extends Phaser.Scene {
  match: Match;
  cameraController: CameraController;

  constructor() {
    super("GamePlay");
  }

  create() {
    // Run Canvas Scene simultaneously
    this.scene.launch("CanvasScene");

    this.createMatch();
  }

  createMatch() {
    this.match = new Match(this);

    const image = this.add
      .image(400, 300, "default")
      .setPipeline("CrowdWavePipeline");
    image.setDisplaySize(800, 600);
  }

  update() {}
}
