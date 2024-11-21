import * as Phaser from "phaser";
import { CameraController } from "../core";
import GamePlay from "./GamePlay";
import { Overlay } from "../uiComponents/overlay";
import { IntroWindow } from "../uiComponents/introWindow";

export default class CanvasScene extends Phaser.Scene {
  cameraController: CameraController;
  startOverlay: Overlay;

  gamePlayMenu: Phaser.GameObjects.Container;
  introWindow: IntroWindow;

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

      const gamePlayScene = this.scene.get("GamePlay") as GamePlay;
      gamePlayScene.startMatchPrepare();
      this.makeIntroAnimations();
    });
  }

  createCameraController() {
    const gamePlayScene = this.scene.get("GamePlay") as GamePlay;
    this.cameraController = new CameraController(this, gamePlayScene);
  }

  createGameConfigMenu() {}

  makeIntroAnimations() {
    this.introWindow = new IntroWindow(this, 0, 0, {
      hostTeam: {
        name: "Manchester City",
        logoKey: "manchester-city",
      },
      guestTeam: {
        name: "Manchester United",
        logoKey: "manchester-united",
      },
      info: {
        mode: "Marble League",
        title: "Fexture 1",
      },
    });
  }

  hideIntroWindow() {
    this.add.tween({
      targets: this.introWindow,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        this.introWindow.destroy(true);
      },
    });
  }
}
