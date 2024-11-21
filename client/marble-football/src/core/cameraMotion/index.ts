import GamePlay from "../../scenes/GamePlay";

export default class CameraMotion {
  constructor(public scene: GamePlay) {}

  showStartGameAnimation() {
    this.scene.cameras.main.zoomTo(
      this.scene.cameras.main.zoom + 0.7, // Target zoom level
      7000, // Duration (in milliseconds)
      "Cubic.easeInOut", // Easing function
      false // Force (set to true if you want to force the zoom change)
    );
  }
}
