import { Scene } from "phaser";

export default class Preload extends Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.load.setPath("assets/");

    this.load.glsl("crowdWaveShader", "/crowdWaveShader.frag");

    // Stadium
    this.load.image("stadiumLines", "image/gameObjects/stadium-lines.png");

    // UI
    this.load.image("defaultButton", "image/ui/default-button.png");
    this.load.image("default", "image/ui/default.png");
    this.load.image("cameraZoomButton", "image/ui/camera-zoom-button.png");
  }

  create() {
    this.scene.start("Menu");
  }
}
