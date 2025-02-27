import { Tweens } from "phaser";
import GamePlay from "../../../../../scenes/GamePlay";
import { TeamDataType } from "../../../../../types/gameTypes";
import { calculatePercentage, mapToRange } from "../../../../../utils/math";
import { Stadium } from "../../../stadium";
import BoardFootballPlayer from "../../footballplayers/boardFootballPlayer";

export class Column extends Phaser.GameObjects.Container {
  footballers: BoardFootballPlayer[];
  quantity: number;
  motionDistance = 0;
  tweenDuration = 0;

  tween?: Tweens.Tween;
  toBottom = true;

  isInMotion = false;

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
          x = -calculatePercentage(41, this.stadium.innerFielddWidth);
          break;
        case "middle":
          x = -calculatePercentage(10, this.stadium.innerFielddWidth);
          break;
        case "attack":
          x = calculatePercentage(25, this.stadium.innerFielddWidth);
          break;
        default:
          throw Error("Invalid Parameter");
      }
    } else {
      switch (this.type) {
        case "defence":
          x = calculatePercentage(41, this.stadium.innerFielddWidth);
          break;
        case "middle":
          x = calculatePercentage(10, this.stadium.innerFielddWidth);
          break;
        case "attack":
          x = -calculatePercentage(25, this.stadium.innerFielddWidth);
          break;
        default:
          throw Error("Invalid Parameter");
      }
    }

    const padding = this.stadium.innerFielddHeight / (this.quantity + 1);
    let y = -this.stadium.innerFielddHeight / 2 + padding;

    for (let i = 0; i < this.quantity; i++) {
      let playerPosition:
        | "goalKeeper"
        | "defender"
        | "middfielder"
        | "attacker" = "goalKeeper";

      if (this.type === "defence") {
        playerPosition = "defender";
      }
      if (this.type === "middle") {
        playerPosition = "middfielder";
      }
      if (this.type === "attack") {
        playerPosition = "attacker";
      }

      const footballer = new BoardFootballPlayer(
        this.scene,
        x,
        y,
        this.teamData,
        {
          position: playerPosition,
          who: this.side === "left" ? "hostPlayer" : "guestPlayer",
        }
      );

      if (
        this.teamData.tactics.formation.defenceLine === "wide-attack" &&
        this.type === "defence"
      ) {
        if (i === 0 || i === this.quantity - 1) {
          this.side === "left"
            ? (footballer.x += calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ))
            : (footballer.x -= calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ));
        }
      }

      if (
        this.teamData.tactics.formation.centerLine === "wide-attack" &&
        this.type === "middle"
      ) {
        if (i === 0 || i === this.quantity - 1) {
          this.side === "left"
            ? (footballer.x += calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ))
            : (footballer.x -= calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ));
        }
      }

      if (
        this.teamData.tactics.formation.centerLine === "wide-back" &&
        this.type === "middle"
      ) {
        if (i === 0 || i === this.quantity - 1) {
          this.side === "left"
            ? (footballer.x -= calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ))
            : (footballer.x += calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ));
        }
      }

      if (
        this.teamData.tactics.formation.attackLine === "wide-attack" &&
        this.type === "attack"
      ) {
        if (i === 0 || i === this.quantity - 1) {
          this.side === "left"
            ? (footballer.x += calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ))
            : (footballer.x -= calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ));
        }
      }

      if (
        this.teamData.tactics.formation.attackLine === "wide-back" &&
        this.type === "attack"
      ) {
        if (i === 0 || i === this.quantity - 1) {
          this.side === "left"
            ? (footballer.x -= calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ))
            : (footballer.x += calculatePercentage(
                2.5,
                this.stadium.innerFielddWidth
              ));
        }
      }

      y += padding;

      this.footballers.push(footballer);
      this.add(footballer);

      if (i === 0) {
        this.motionDistance = padding - footballer.image.displayHeight / 2;
      }
    }
  }

  startMotion(duration: number) {
    this.tweenDuration = duration;
    if (this.isInMotion === true) return;
    this.isInMotion = true;

    if (this.tween) {
      this.scene.tweens.add({
        targets: this.tween,
        timeScale: 1, // Restore normal speed
        duration: 150, // Adjust duration for smooth resuming
        ease: "Linear",
      });

      return;
    }

    this.startInitialMotion(duration);
  }

  startInitialMotion(duration: number) {
    this.tween = this.scene.add.tween({
      targets: this,
      y: -this.motionDistance - 15,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      duration: mapToRange(duration, 1200, 600),
      onComplete: () => {
        this.tween = this.scene.add.tween({
          targets: this,
          y: { from: -this.motionDistance - 15, to: this.motionDistance + 15 },
          yoyo: true,
          ease: Phaser.Math.Easing.Quadratic.InOut,
          duration: mapToRange(duration, 1200, 600),
          repeat: -1,
          complete: () => {
            this.toBottom = true;
          },
          onYoyo: () => {
            this.toBottom = false;
          },
        });
      },
    });
  }

  // stopMotion() {
  //   if (this.isInMotion === false) return;
  //   this.isInMotion = false;

  //   this.tween?.pause();
  // }

  stopMotion() {
    if (this.tween) {
      this.scene.tweens.add({
        targets: this.tween,
        timeScale: 0, // Gradually reduce speed to zero
        duration: 150, // Adjust the duration to control how slowly it stops
        ease: "Linear",
        onComplete: () => {
          this.isInMotion = false;
        },
      });
    }
  }

  public reset() {
    this.tween?.destroy();
    this.tween = undefined;

    this.setPosition(this.x, 0);

    this.footballers.forEach((f) => {
      f.activate();
    });
  }

  set distance(distance: number) {
    this.motionDistance = distance;
  }
}
