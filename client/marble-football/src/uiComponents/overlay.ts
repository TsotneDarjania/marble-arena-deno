import { calculatePercentage } from "../utils/math";
import Button from "./button";

export class IntroOverlay extends Phaser.GameObjects.Container {
  background: Phaser.GameObjects.Image;
  button: Button;
  text: Phaser.GameObjects.Text;

  constructor(
    public scene: Phaser.Scene,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.addBackground();
  }

  addBackground() {
    this.background = this.scene.add
      .image(0, 0, "default")
      .setTint(0x000000)
      .setAlpha(0.8)
      .setDisplaySize(this.width, this.height);

    this.add(this.background);
  }

  addText(textValue: string, x: number, y: number) {
    this.text = this.scene.add
      .text(x, y, textValue, {
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
        fixedWidth: calculatePercentage(this.width, 80),
        wordWrap: {
          width: calculatePercentage(this.width, 80),
          useAdvancedWrap: true,
        },
      })
      .setOrigin(0.5);

    this.add(this.text);
  }

  addButton(textValue: string) {
    this.button = new Button(
      this.scene,
      0,
      this.text.y + this.text.height * 2 + calculatePercentage(2, this.height),
      calculatePercentage(this.width, 18),
      calculatePercentage(this.width, 6),
      textValue
    );
    this.add(this.button);
  }
}
