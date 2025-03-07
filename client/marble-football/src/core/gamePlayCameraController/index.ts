import GamePlay from "../../scenes/GamePlay";

export default class GamePlayCameraController {
  constructor(public scene: GamePlay) {}

  showStartGameAnimation() {
    this.scene.cameras.main.zoomTo(
      this.scene.cameras.main.zoom + 0.7, // Target zoom level
      7000, // Duration (in milliseconds)
      "Cubic.easeInOut", // Easing function
      false // Force (set to true if you want to force the zoom change)
    );

    this.scene.cameras.main.once("camerazoomcomplete", () => {
      this.scene.events.emit("cameraZoomFinished");
    });
  }

  startFollow(ball: Phaser.Physics.Arcade.Image) {
    this.scene.cameras.main.startFollow(ball, false, 0.003);

    this.updateCameraZoom(ball);
  }

  updateCameraZoom(ball: Phaser.Physics.Arcade.Image) {
    const defaultCameraZoom = this.scene.cameras.main.zoom - 0.18;
    const closeCameraZoom = this.scene.cameras.main.zoom - 0.18;

    this.scene.events.on("update", () => {
      if (
        this.scene.match.matchManager.matchEvenetManager.matchStatus !==
        "playing"
      ) {
        this.scene.cameras.main.zoomTo(
          defaultCameraZoom,
          6000,
          "Cubic.easeInOut"
        );

        return;
      }

      if (ball.x > this.scene.game.canvas.width / 2 + 200) {
        this.scene.cameras.main.zoomTo(
          closeCameraZoom,
          3000,
          "Cubic.easeInOut"
        ); // Zoom in when x > 50
      }

      if (ball.x < this.scene.game.canvas.width / 2 - 200) {
        this.scene.cameras.main.zoomTo(
          closeCameraZoom,
          3000,
          "Cubic.easeInOut"
        ); // Zoom out when x < -50
      }

      if (
        ball.x > this.scene.game.canvas.width / 2 - 200 &&
        ball.x < this.scene.game.canvas.width / 2 + 200
      ) {
        this.scene.cameras.main.zoomTo(
          defaultCameraZoom,
          1000,
          "Cubic.easeInOut"
        );
      }
    });
  }
}
