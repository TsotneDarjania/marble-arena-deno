import * as Phaser from "phaser";
import { Match } from "../core";
import CameraMotion from "../core/cameraMotion";
import CanvasScene from "./CanvasScene";
import { SoundManager } from "../core/soundManager";

export default class GamePlay extends Phaser.Scene {
  match: Match;
  cameraMotion: CameraMotion;
  soundManager: SoundManager;

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
  }

  addSoundManager() {
    this.soundManager = new SoundManager(this);
  }

  createMatch() {
    this.soundManager.stadiumNoice.play();

    this.match = new Match(
      {
        scene: this,
        hostTeamData: {
          name: "Liverpool",
          initials: "LV",
          logoKey: "liverpool",
          formation: "5-3-2",
          fansColor: 0x205c5c,
          tactics: {
            formation: {
              defenceLine: "wide-attack",
              centerLine: "wide-attack",
              attackLine: "wide-attack", //ეს ჯერ არ მუშაობს
            },
          },
          passSpeed: 1,
          shootSpeed: 1,
          goalKeeperSpeed: 1,
          motionSpeed: 1,
        },
        guestTeamData: {
          name: "Manchester City",
          initials: "MC",
          logoKey: "manchester-city",
          formation: "4-4-2",
          fansColor: 0x205c5c,
          tactics: {
            formation: {
              defenceLine: "wide-attack",
              centerLine: "wide-attack",
              attackLine: "wide-attack", // ეს ჯერ არ მუშაობს
            },
          },
          passSpeed: 100,
          shootSpeed: 100,
          goalKeeperSpeed: 100,
          motionSpeed: 100,
        },
        gameConfig: {
          mode: "board-football",
          withExtraTimes: true,
          hostFansCountPercent: 50,
        },
      },
      this
    );
  }

  createCameraMotion() {
    this.cameraMotion = new CameraMotion(this);
  }

  startMatchPrepare() {
    this.cameraMotion.showStartGameAnimation();
    this.match.showMatchIntroEnvironment();

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
