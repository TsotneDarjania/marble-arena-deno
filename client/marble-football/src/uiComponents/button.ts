import { calculatePercentage } from "../utils/math";

export default class Button extends Phaser.GameObjects.Container {
  background: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public width: number,
    public height: number,
    public innertext: string,
    public onClick?: () => void
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.addBackground();
    this.addText(this.innertext, 0, 0);

    this.makeInteractive();
  }

  addOnClickEvent(onClick: () => void) {
    this.background.on("pointerdown", () => {
      onClick();
    });

    this.text.on("pointerdown", () => {
      onClick();
    });
  }

  makeInteractive() {
    this.background.setInteractive({
      cursor: "pointer",
    });

    this.text.setInteractive({
      cursor: "pointer",
    });
  }

  addBackground() {
    this.background = this.scene.add
      .image(0, 0, "defaultButton")
      .setDisplaySize(this.width, this.height);

    this.add(this.background);
  }

  addText(textValue: string, x: number, y: number) {
    this.text = this.scene.add
      .text(x, y, textValue, {
        fontSize: `${calculatePercentage(1.5, this.scene.game.canvas.width)}px`,
        color: "#ffffff",
        align: "center",
        fixedWidth: this.width,
      })
      .setOrigin(0.5);

    this.add(this.text);
  }
}
