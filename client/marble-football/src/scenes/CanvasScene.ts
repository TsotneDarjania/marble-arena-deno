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

  lastPenaltiesLeftXPosition = -50;
  lastPenaltiesRightXPosition = 50;

  constructor() {
    super("CanvasScene");
  }

  create() {
    this.addStartOverlay();
    this.createCameraController();
    this.createIndicators();
  }

  drawPenaltyDone(side: "left" | "right") {
    const image = this.scene.scene.add.image(
      side === "left"
        ? this.game.canvas.width / 2 + this.lastPenaltiesLeftXPosition
        : this.game.canvas.width / 2 + this.lastPenaltiesRightXPosition,
      140,
      "penaltyDone"
    );
    image.setScale(0.65);

    side === "left"
      ? (this.lastPenaltiesLeftXPosition -= 56)
      : (this.lastPenaltiesRightXPosition += 56);
  }

  drawPenaltyFail(side: "left" | "right") {
    const image = this.scene.scene.add.image(
      side === "left"
        ? this.game.canvas.width / 2 + this.lastPenaltiesLeftXPosition
        : this.game.canvas.width / 2 + this.lastPenaltiesRightXPosition,
      140,
      "penaltyFail"
    );
    image.setScale(0.65);

    side === "left"
      ? (this.lastPenaltiesLeftXPosition -= 56)
      : (this.lastPenaltiesRightXPosition += 56);
  }

  createIndicators() {
    // Background
    this.add
      .image(this.game.canvas.width / 2, 60, "matchIndicatorBck")
      .setTint(0x02010d)
      .setAlpha(0.6);

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

    this.guestTeamScoretext = this.add
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

  showLastresult(data: { winner?: string; winnerLogoKey: string }) {
    const background = this.scene.scene.add.image(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "default"
    );
    background.setDisplaySize(600, this.game.canvas.height);
    background.setTint(0x0c1c2d);
    background.setAlpha(0);

    const winnerText = this.scene.scene.add
      .text(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 - 160,
        "Winner",
        {
          fontSize: "45px",
          color: "#E9FFFF",
          fontStyle: "bold",
          strokeThickness: 2,
          align: "center",
        }
      )
      .setAlpha(0)
      .setOrigin(0.5);

    const winnerLogo = this.scene.scene.add
      .image(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        data.winnerLogoKey
      )
      .setAlpha(0)
      .setScale(2.2);

    const winnerTeamText = this.scene.scene.add
      .text(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 + 160,
        data.winner ? data.winner : "Draw",
        {
          fontSize: "45px",
          color: "#E9FFFF",
          fontStyle: "bold",
          strokeThickness: 2,
          align: "center",
        }
      )
      .setAlpha(0)
      .setOrigin(0.5);

    this.scene.scene.tweens.add({
      targets: [background, winnerLogo, winnerText, winnerTeamText],
      duration: 500,
      alpha: 1,
    });
  }

  showMatchEvent(eventText: string) {
    const background = this.scene.scene.add.image(0, 0, "default");
    background.setDisplaySize(this.game.canvas.width, this.game.canvas.height);
    background.setOrigin(0);
    background.setTint(0x0f2721);
    background.setAlpha(0.4);
    background.setAlpha(0);

    const text = this.scene.scene.add.text(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      eventText,
      {
        fontSize: "60px",
        color: "#E9FFFF",
        fontStyle: "bold",
        strokeThickness: 2,
        align: "center",
      }
    );
    text.setOrigin(0.5);
    text.setAlpha(0);

    this.scene.scene.add.tween({
      targets: background,
      alpha: 0.4,
      duration: 400,
    });
    this.scene.scene.add.tween({
      targets: text,
      alpha: 1,
      duration: 400,
    });

    setTimeout(() => {
      background.destroy();
      text.destroy();
    }, 1500);
  }
}
