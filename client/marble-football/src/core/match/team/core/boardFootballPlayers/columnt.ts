import { Tweens } from "phaser";
import GamePlay from "../../../../../scenes/GamePlay";
import { TeamDataType } from "../../../../../types/gameTypes";
import { calculatePercentage } from "../../../../../utils/math";
import { Stadium } from "../../../stadium";
import BoardFootballPlayer from "../../footballplayers/boardFootballPlayer";

export class Column extends Phaser.GameObjects.Container {
  footballers: BoardFootballPlayer[];
  quantity: number;
  motionDistance = 0;

  tween: Tweens.Tween;

  constructor(
    public scene: GamePlay,
    x: number,
    y: number,
    public stadium: Stadium,
    public teamData: TeamDataType,
    public type: "defence" | "middle" | "attack",
    public side: "left" | "right"
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    switch (this.type) {
      case "defence":
        this.quantity = Number(this.teamData.formation.split("-")[0]);
        break;
      case "middle":
        this.quantity = Number(this.teamData.formation.split("-")[1]);
        break;
      case "attack":
        this.quantity = Number(this.teamData.formation.split("-")[2]);
        break;
      default:
        throw Error("Invalied Formation Parameter");
    }

    this.footballers = [];

    this.addFootballers();
  }

  private addFootballers() {
    let x = 0;

    if (this.side === "left") {
      switch (this.type) {
        case "defence":
          x = -calculatePercentage(40, this.stadium.fieldWidth);
          break;
        case "middle":
          x = -calculatePercentage(10, this.stadium.fieldWidth);
          break;
        case "attack":
          x = calculatePercentage(30, this.stadium.fieldWidth);
          break;
        default:
          throw Error("Invalid Parameter");
      }
    } else {
      switch (this.type) {
        case "defence":
          x = calculatePercentage(40, this.stadium.fieldWidth);
          break;
        case "middle":
          x = calculatePercentage(10, this.stadium.fieldWidth);
          break;
        case "attack":
          x = -calculatePercentage(30, this.stadium.fieldWidth);
          break;
        default:
          throw Error("Invalid Parameter");
      }
    }

    const padding = this.stadium.fieldHeight / (this.quantity + 1);
    let y = -this.stadium.stadiumHeight / 2 + padding;

    for (let i = 0; i < this.quantity; i++) {
      const footballer = new BoardFootballPlayer(
        this.scene,
        x,
        y,
        this.teamData
      );

      y += padding;

      this.footballers.push(footballer);
      this.add(footballer);

      if (i === 0) {
        this.motionDistance = padding - footballer.image.displayHeight;
      }
    }
  }

  startMotion() {
    if (this.tween) {
      this.tween.resume();
      return;
    }

    this.tween = this.scene.add.tween({
      targets: this,
      y: { from: -this.motionDistance - 15, to: this.motionDistance + 15 },
      yoyo: true,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      duration: 1000,
      repeat: -1,
    });

    this.tween.seek(calculatePercentage(50, 1000));
  }

  stopMotion() {
    this.tween?.pause();
  }

  public reset() {
    this.tween.destroy();
    this.setPosition(this.x, 0);
  }

  set distance(distance: number) {
    this.motionDistance = distance;
  }
}
