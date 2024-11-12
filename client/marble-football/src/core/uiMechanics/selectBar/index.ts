import { calculatePercentage } from "../../../utils/math";

export default class SelectBar extends Phaser.GameObjects.Container {
  background: Phaser.GameObjects.Image;
  indicatorButton: Phaser.GameObjects.Image;
  eventEmitter: Phaser.Events.EventEmitter;

  constructor(
    public scene: Phaser.Scene,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public zoomIndicatorKey: string = "default",
    public value: number = 50 //percentage
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.eventEmitter = new Phaser.Events.EventEmitter();

    this.init();
  }

  init() {
    this.addBackground();
    this.addIndicatorButton();

    this.makeInteractive();
    this.addEventListeners();
  }

  addBackground() {
    this.background = this.scene.add
      .image(0, 0, "default")
      .setDisplaySize(this.width, this.height);

    this.add(this.background);
  }

  addIndicatorButton() {
    const xPosition =
      -this.width / 2 + calculatePercentage(this.width, this.value);

    this.indicatorButton = this.scene.add
      .image(xPosition, 0, this.zoomIndicatorKey)
      .setDisplaySize(
        calculatePercentage(this.width, 4),
        calculatePercentage(this.width, 4)
      );

    this.add(this.indicatorButton);
  }

  makeInteractive() {
    this.background.setInteractive({
      cursor: "pointer",
    });

    this.indicatorButton.setInteractive({
      cursor: "pointer",
    });

    this.scene.input.setDraggable(this.background);
    this.scene.input.setDraggable(this.indicatorButton);
  }

  addEventListeners() {
    this.scene.input.on(
      Phaser.Input.Events.DRAG,
      (_pointer: any, gameObject: any, dragX: number, _dragY: number) => {
        if (
          gameObject === this.background ||
          gameObject === this.indicatorButton
        ) {
          this.updateIndicatorPosition(dragX);
          this.calculateNewValue();
        }
      }
    );
  }

  updateIndicatorPosition(mousePosX: number) {
    this.indicatorButton.x = Phaser.Math.Clamp(
      mousePosX,
      -this.width / 2,
      this.width / 2
    );
  }

  calculateNewValue() {
    this.value = Math.floor(
      Phaser.Math.Percent(
        this.indicatorButton.x,
        -this.width / 2,
        this.width / 2
      ) * 100
    );

    this.eventEmitter.emit("valueChanged", this.value);
  }

  onValueChanged(callback: (value: number) => void) {
    this.eventEmitter.on("valueChanged", callback);
  }
}
