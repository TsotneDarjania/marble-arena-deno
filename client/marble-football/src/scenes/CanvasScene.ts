import * as Phaser from "phaser";
import { CameraController } from "../core";
import GamePlay from "./GamePlay";
import { Overlay } from "../uiComponents/overlay";
import { IntroWindow } from "../uiComponents/introWindow";
import matchConfig from "../config/matchConfig";

export default class CanvasScene extends Phaser.Scene {
  cameraController: CameraController;
  startOverlay: Overlay;

  gamePlayMenu: Phaser.GameObjects.Container;
  introWindow: IntroWindow;

  timerText: Phaser.GameObjects.Text;
  hostTeamScoretext: Phaser.GameObjects.Text;
  guestTeamScoretext: Phaser.GameObjects.Text;

  constructor() {
    super("CanvasScene");
  }

  create() {
    this.addStartOverlay();
    this.createCameraController();
    this.createIndicators();
  }

  createIndicators() {
    // Background
    this.add
      .image(this.game.canvas.width / 2, 60, "matchIndicatorBck")
      .setTint(0x02010d)
      .setAlpha(0.6);

    // Timer text
    this.timerText = this.add.text(this.game.canvas.width / 2, 83, "0", {
      fontSize: "25px",
      color: "#F3FFFF",
      align: "center",
      strokeThickness: 1,
    });
    this.timerText.setOrigin(0.5);

    // hostTeamLogo
    this.add.image(
      this.game.canvas.width / 2 - 158,
      56,
      matchConfig.hostTeam.logoKey
    );

    // guestTeamLogo
    this.add.image(
      this.game.canvas.width / 2 + 158,
      56,
      matchConfig.guestTeam.logoKey
    );

    // hostTeamInitials
    this.add
      .text(
        this.game.canvas.width / 2 - 120,
        60,
        matchConfig.hostTeam.initials,
        {
          fontSize: "35px",
          color: "#E9FFFF",
          fontStyle: "bold",
          strokeThickness: 2,
          align: "left",
        }
      )
      .setOrigin(0, 0.5);

    //guestTeamInitials
    this.add
      .text(
        this.game.canvas.width / 2 + 120,
        60,
        matchConfig.guestTeam.initials,
        {
          fontSize: "35px",
          color: "#E9FFFF",
          fontStyle: "bold",
          strokeThickness: 2,
          align: "right",
        }
      )
      .setOrigin(1, 0.5);

    // hostTeamScore
    this.hostTeamScoretext = this.add
      .text(this.game.canvas.width / 2 - 20, 60, "0", {
        fontSize: "45px",
        color: "#E9FFFF",
        fontStyle: "bold",
        strokeThickness: 2,
        align: "right",
      })
      .setOrigin(1, 0.5);

    this.hostTeamScoretext = this.add
      .text(this.game.canvas.width / 2 + 50, 60, "0", {
        fontSize: "45px",
        color: "#E9FFFF",
        fontStyle: "bold",
        strokeThickness: 2,
        align: "left",
      })
      .setOrigin(1, 0.5);

    // HorizontalLine
    this.add
      .image(this.game.canvas.width / 2, 60, "default")
      .setDisplaySize(20, 7);
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
