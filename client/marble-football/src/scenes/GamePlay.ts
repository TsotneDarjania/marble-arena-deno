import * as Phaser from "phaser";
import { Match } from "../core";
import CanvasScene from "./CanvasScene";
import { SoundManager } from "../core/soundManager";
import GamePlayCameraController from "../core/gamePlayCameraController";
import { matchDataConfig } from "../config/matchConfig";
import { EventManager } from "../core/eventManager";

export default class GamePlay extends Phaser.Scene {
  match: Match;
  cameraController: GamePlayCameraController;
  soundManager: SoundManager;
  eventManager: EventManager;

  constructor() {
    super("GamePlay");
  }

  create() {
    // Change the fixedStep to true to make the physics simulation more smooth
    this.physics.world.fixedStep = true;
    this.physics.world.setFPS(4500);
    // Run Canvas Scene simultaneously
    this.scene.launch("CanvasScene");
    this.addSoundManager();
    this.createMatch();
    this.createCameraMotion();
    this.createEventManager();
  }

  addSoundManager() {
    this.soundManager = new SoundManager(this);
  }

  createMatch() {
    this.soundManager.stadiumNoice.play();

    this.match = new Match(matchDataConfig, this);
  }

  createCameraMotion() {
    this.cameraController = new GamePlayCameraController(this);
  }

  startMatchPrepare() {
    this.cameraController.showStartGameAnimation();
    this.match.showMatchIntroEnvironment();
  }

  async createEventManager() {
    const canvasScene = (await this.scene.get("CanvasScene")) as CanvasScene;
    this.eventManager = new EventManager(this, canvasScene);
  }
}
