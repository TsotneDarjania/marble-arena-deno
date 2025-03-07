import CanvasScene from "../../scenes/CanvasScene";
import GamePlay from "../../scenes/GamePlay";

export class EventManager {
  status: "init" | "ready-for-start-match" | "match-is-started" = "init";

  constructor(public gamePlayScene: GamePlay, public canvasScene: CanvasScene) {
    this.manageUserEventListeners();
    this.manageGameEvents();
  }

  manageUserEventListeners() {
    // When you will click Start Simulation Button
    this.canvasScene.introOverlay.button.addOnClickEvent(() => {
      this.canvasScene.startIntroAnimation();
    });

    this.gamePlayScene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.code === "Space") {
        if (this.gamePlayScene.match.matchManager === undefined) return;
        if (
          this.gamePlayScene.match.matchManager.matchEvenetManager === undefined
        )
          return;
        if (
          this.gamePlayScene.match.matchManager.matchEvenetManager
            .matchStatus === "pause"
        ) {
          this.gamePlayScene.match.matchManager.resumeMatch();
        }
      }
    });

    // Player Wants to Start match he will pressed space for that
    this.gamePlayScene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (this.status !== "ready-for-start-match") return;
      if (event.code === "Space") {
        this.canvasScene.hideIntroWindow();
        this.gamePlayScene.match.startMatch();
      }
      this.status = "match-is-started";
    });
  }

  manageGameEvents() {
    this.gamePlayScene.events.on("cameraZoomFinished", () => {
      this.status = "ready-for-start-match";
    });
  }
}
