import * as Phaser from "phaser";
import { Match } from "../core";
import CameraMotion from "../core/cameraMotion";
import CanvasScene from "./CanvasScene";

export default class GamePlay extends Phaser.Scene {
  match: Match;
  cameraMotion: CameraMotion;
  matchIsPossibleToStart: boolean = false;

  constructor() {
    super("GamePlay");
  }

  create() {
    // Change the fixedStep to true to make the physics simulation more smooth
    this.physics.world.fixedStep = true;
    this.physics.world.setFPS(150);
    // Run Canvas Scene simultaneously
    this.scene.launch("CanvasScene");

    this.createMatch();
    this.createCameraMotion();
  }

  createMatch() {
    this.match = new Match(
      this,
      {
        name: "Liverpool",
        logoKey: "liverpool",
        formation: "5-3-2",
      },
      {
        name: "Manchester City",
        logoKey: "manchester-city",
        formation: "4-4-2",
      }
    );
  }

  createCameraMotion() {
    this.cameraMotion = new CameraMotion(this);
  }

  startMatchPrepare() {
    this.cameraMotion.showStartGameAnimation();
    this.match.addStartLeyoutTeams();

    setTimeout(() => {
      this.addEventListeners();
    }, 7000);
  }

  addEventListeners() {
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.code === "Space") {
        const canvasScene = this.scene.get("CanvasScene") as CanvasScene;
        canvasScene.hideIntroWindow();
        this.match.startMatch();
      }
    });
  }
}
