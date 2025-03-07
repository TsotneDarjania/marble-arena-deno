import * as Phaser from "phaser";
import { CameraController } from "../core";
import GamePlay from "./GamePlay";
import { IntroOverlay } from "../uiComponents/overlay";
import { IntroWindow } from "../uiComponents/introWindow";
import { matchDataConfig, matchInfo } from "../config/matchConfig";
import { calculatePercentage } from "../utils/math";

export default class CanvasScene extends Phaser.Scene {
  cameraController: CameraController;
  introOverlay: IntroOverlay;

  gamePlayMenu: Phaser.GameObjects.Container;
  introWindow: IntroWindow;

  timerText: Phaser.GameObjects.Text;
  hostTeamScoretext: Phaser.GameObjects.Text;
  guestTeamScoretext: Phaser.GameObjects.Text;

  lastPenaltiesLeftXPosition = -50;
  lastPenaltiesRightXPosition = 50;

  possibleToShowCommentatorTexrt = true;

  constructor() {
    super("CanvasScene");
  }

  create() {
    this.addIntroOverlay();
    this.createCameraController();
    this.createIndicators();
  }

  showComentator(side: "left" | "right", comment: string) {
    const image = this.add.image(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "default"
    );
    image.setAlpha(0);
    image.setScale(1.2);
    image.setOrigin(0.5);
    image.setTint(0x000000);
    image.setAlpha(0.7);
    image.setDisplaySize(this.game.canvas.width, this.game.canvas.height);

    const comentatorImage = this.add.image(0, 0, "comentator");
    comentatorImage.setOrigin(0.5);
    comentatorImage.setScale(0.35);
    comentatorImage.setAlpha(0);
    comentatorImage.setPosition(
      side === "left"
        ? comentatorImage.getBounds().width / 2 + 20
        : this.game.canvas.width - comentatorImage.getBounds().width / 2 - 20,
      comentatorImage.getBounds().height / 2 + 20
    );

    // const liveImage = this.add.image(0, 0, "live");
    // liveImage.setOrigin(0.5);
    // liveImage.setScale(0.3);
    // liveImage.setAlpha(0);
    // liveImage.setPosition(
    //   side === "left"
    //     ? comentatorImage.getBounds().width / 2 + 152
    //     : this.game.canvas.width - comentatorImage.getBounds().width / 2 - 152,
    //   comentatorImage.getBounds().centerY + 246
    // );

    // const mikeImage = this.add.image(0, 0, "mike");
    // mikeImage.setOrigin(0.5);
    // mikeImage.setScale(0.4);
    // mikeImage.setAlpha(0);
    // mikeImage.setPosition(
    //   side === "left"
    //     ? comentatorImage.getBounds().width / 2 - 80
    //     : this.game.canvas.width - comentatorImage.getBounds().width / 2 + 80,
    //   comentatorImage.getBounds().centerY + 246
    // );

    const text = this.add.text(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2 + 100,
      comment,
      {
        fontSize: "85px",
        color: "#DBD65C",
        align: "center",
        strokeThickness: 5,
      }
    );
    text.setAlpha(0);
    text.setScale(0);
    text.setOrigin(0.5);

    this.tweens.add({
      targets: [image],
      duration: 800,
      ease: Phaser.Math.Easing.Back.Out,
      alpha: 0.6,
    });

    this.tweens.add({
      targets: [comentatorImage],
      duration: 300,
      ease: Phaser.Math.Easing.Back.Out,
      alpha: 1,
    });

    this.tweens.add({
      targets: [text],
      duration: 700,
      ease: Phaser.Math.Easing.Back.Out,
      alpha: 1,
      scale: 1,
      delay: 400,
    });

    setTimeout(() => {
      image.destroy();
      comentatorImage.destroy();
      text.destroy();
    }, 2000);
  }

  //For Comentator
  showComment(message: string) {
    if (!this.possibleToShowCommentatorTexrt) return;
    this.possibleToShowCommentatorTexrt = false;

    const text = this.add.text(this.game.canvas.width / 2, 83, message, {
      fontSize: "65px",
      color: "#2CE67C",
      align: "center",
      strokeThickness: 5,
    });
    text.setOrigin(0.5);

    text.setPosition(this.game.canvas.width / 2, this.game.canvas.height - 80);

    this.tweens.add({
      targets: text,
      duration: 600,
      delay: 1200,
      alpha: 0,
      scale: 0,
      onComplete: () => {
        text.destroy();
        this.possibleToShowCommentatorTexrt = true;
      },
    });
  }

  showBallSaveIcon(side: "left" | "right") {
    const image = this.add.image(
      20,
      this.game.canvas.height / 2 + 40,
      "ballSaveIcon"
    );
    image.setTint(0x94ff98);
    image.setOrigin(0.5);
    image.setScale(0.4);

    if (side === "left") {
      image.setPosition(
        image.getBounds().width / 2 +
          calculatePercentage(3, this.game.canvas.width),
        this.game.canvas.height -
          image.getBounds().height / 2 -
          calculatePercentage(3, this.game.canvas.height)
      );
    } else {
      image.setPosition(
        this.game.canvas.width -
          image.getBounds().width / 2 -
          calculatePercentage(3, this.game.canvas.width),
        this.game.canvas.height -
          image.getBounds().height / 2 -
          calculatePercentage(3, this.game.canvas.height)
      );
    }

    this.tweens.add({
      targets: image,
      duration: 400,
      delay: 1100,
      alpha: 0,
      onComplete: () => {
        image.destroy();
      },
    });
  }

  // During Transitions
  showMarbleArenaLogo() {
    const marbleArenaLogo = this.add
      .image(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "marbleArenaLogo"
      )
      .setScale(0)
      .setOrigin(0.5)
      .setDepth(150)
      .setAlpha(0);

    this.tweens.add({
      targets: marbleArenaLogo,
      alpha: 1,
      scale: 0.45,
      duration: 500,
      onComplete: () => {
        setTimeout(() => {
          this.tweens.add({
            targets: marbleArenaLogo,
            alpha: 0,
            scale: 0,
            delay: 300,
            duration: 500,
            onComplete: () => {
              marbleArenaLogo.destroy();
            },
          });
        }, 300);
      },
    });
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
      matchDataConfig.hostTeamData.logoKey
    );

    // guestTeamLogo
    this.add.image(
      this.game.canvas.width / 2 + 158,
      56,
      matchDataConfig.guestTeamData.logoKey
    );

    // hostTeamInitials
    this.add
      .text(
        this.game.canvas.width / 2 - 120,
        60,
        matchDataConfig.hostTeamData.initials,
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
        matchDataConfig.guestTeamData.initials,
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

  addIntroOverlay() {
    this.introOverlay = new IntroOverlay(
      this,
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      this.game.canvas.width,
      this.game.canvas.height
    );

    this.introOverlay.addText(
      "Set Your Camera Zoom to Begin the Simulation",
      0,
      0
    );

    this.introOverlay.addButton("Start Simulation");
  }

  startIntroAnimation() {
    this.introOverlay.destroy(true);
    this.cameraController.destroy();

    const gamePlayScene = this.scene.get("GamePlay") as GamePlay;
    gamePlayScene.startMatchPrepare();
    this.makeIntroAnimation();
  }

  createCameraController() {
    const gamePlayScene = this.scene.get("GamePlay") as GamePlay;
    this.cameraController = new CameraController(this, gamePlayScene);
  }

  makeIntroAnimation() {
    this.introWindow = new IntroWindow(this, 0, 0, {
      hostTeam: {
        name: matchDataConfig.hostTeamData.name,
        logoKey: matchDataConfig.hostTeamData.logoKey,
      },
      guestTeam: {
        name: matchDataConfig.guestTeamData.name,
        logoKey: matchDataConfig.guestTeamData.logoKey,
      },
      info: {
        matchTitle: matchInfo.matchTitle,
        matchSubTitle: matchInfo.matchSubTitle,
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
