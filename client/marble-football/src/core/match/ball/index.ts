import { Stadium } from "../stadium";

export class Ball extends Phaser.Physics.Arcade.Image {
  anglurarVelocity = 800;
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(
    scene: Phaser.Scene,
    public x: number,
    public y: number,
    public stadium: Stadium
  ) {
    super(scene, x, y - 3, "ball");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.4);
    this.setCircle(22, 10, 11);

    // Enable physics properties
    this.setBounce(0.8);
    this.setCollideWorldBounds(true);
    this.addParticles();

    this.setDepth(11);
  }

  private addParticles() {
    this.emitter = this.scene.add.particles(this.x, this.y, "circle", {
      lifespan: 370,
      alpha: { start: 0.6, end: 0 },
      scale: { start: 0.2, end: 0 },
      tint: [0xf7332d, 0xf7332d, 0xfa8238, 0xf7e52d],
      frequency: 0,
      blendMode: "ADD",
    });
    this.emitter.setDepth(10);
    this.emitter.startFollow(
      this,
      -this.scene.game.canvas.width / 2,
      -this.scene.game.canvas.height / 2
    );

    // this.stadium.add(this.emitter);
    // this.stadium.moveAbove(this, this.emitter as Phaser.GameObjects.GameObject);
  }

  kick(speed: number, { x, y }: { x: number; y: number }) {
    // Apply a force gradually for smoother motion
    this.scene.physics.moveTo(this, x, y, speed);
    this.anglurarVelocity = speed * 4;
    this.setAngularVelocity(this.anglurarVelocity);
  }

  stop() {
    this.setVelocity(0, 0);
    this.setAngularVelocity(0);
  }

  goTowardFootballer(footballer: Phaser.GameObjects.Container) {
    this.scene.tweens.add({
      targets: this,
      x: footballer.getBounds().centerX,
      y: footballer.getBounds().centerY,
      duration: 300,
    });
  }
}
