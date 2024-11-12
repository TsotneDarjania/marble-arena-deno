import * as Phaser from "phaser";
import { CameraController } from "../core";
import GamePlay from "./GamePlay";
import { Overlay } from "../uiComponents/overlay";

export default class CanvasScene extends Phaser.Scene {
  cameraController: CameraController;
  startOverlay: Overlay;

  constructor() {
    super("CanvasScene");
  }

  create() {
    this.addStartOverlay();
    this.createCameraController();
  }

  addStartOverlay() {
    this.startOverlay = new Overlay(
      this,
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      this.game.canvas.width,
      this.game.canvas.height
    );

    this.startOverlay.addText(
      "Set Your Camera Zoom to Begin the Simulation",
      0,
      0
    );

    this.startOverlay.addButton("Start Simulation", () => {
      this.startOverlay.destroy(true);
      this.cameraController.destroy();
    });
  }

  createCameraController() {
    const gamePlayScene = this.scene.get("GamePlay") as GamePlay;
    this.cameraController = new CameraController(this, gamePlayScene);
  }
}
