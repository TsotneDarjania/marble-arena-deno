import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";

export default class TimeManager {
  time: number = 0;
  timerEvent: Phaser.Time.TimerEvent;

  constructor(public match: Match, public scene: Phaser.Scene) {
    this.init();
  }

  init() {
    this.time = 0;
  }

  startTimer() {
    this.timerEvent = this.scene.time.addEvent({
      delay: 1000, // 1 second
      callback: this.incrementTime,
      callbackScope: this,
      loop: true,
    });
  }

  incrementTime() {
    this.time++;
    const canvasScene = this.scene.scene.get("CanvasScene") as CanvasScene;
    canvasScene.timerText.setText(this.time.toString());

    if (this.time >= 45) {
      this.match.matchManager.stopMatch("haltTimeEnd");
    }
  }

  stopTimer() {
    if (this.timerEvent) {
      this.timerEvent.paused = true;
    }
  }

  resumeTimer() {
    if (this.timerEvent) {
      this.timerEvent.paused = false;
    }
  }
}
