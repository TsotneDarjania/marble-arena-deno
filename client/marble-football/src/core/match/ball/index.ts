import { getRandomIntNumber } from "../../../utils/math";
import { Stadium } from "../stadium";

export class Ball extends Phaser.Physics.Arcade.Image {
  anglurarVelocity = 800;
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public stadium: Stadium
  ) {
    super(scene, x, y - 3, "ball");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.stadium.add(this);

    this.setScale(0.4);
    this.setCircle(22, 10, 11);

    // Enable physics properties
    this.setBounce(0.8);
    this.setCollideWorldBounds(true);
    this.addParticles();
  }

  private addParticles() {
    this.emitter = this.scene.add.particles(this.x + 1, this.y + 3, "circle", {
      lifespan: 370,
      alpha: { start: 0.6, end: 0 },
      scale: { start: 0.2, end: 0 },
      tint: [0xf7332d, 0xf7332d, 0xfa8238, 0xf7e52d],
      frequency: 0,
      blendMode: "ADD",
    });
    this.emitter.startFollow(this);

    this.stadium.add(this.emitter);
    this.stadium.moveAbove(this, this.emitter as Phaser.GameObjects.GameObject);
  }

  kick(speed: number) {
    // Apply a force gradually for smoother motion
    this.scene.physics.moveTo(this, getRandomIntNumber(-100, 100), 100, speed);
    this.anglurarVelocity = speed * 4;
    this.setAngularVelocity(this.anglurarVelocity);
  }
}
