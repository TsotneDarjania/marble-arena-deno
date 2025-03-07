export class SoundManager {
  private static instance: SoundManager;

  stadiumNoice: Phaser.Sound.BaseSound;
  timeStartReferee: Phaser.Sound.BaseSound;
  pass: Phaser.Sound.BaseSound;
  catchBall: Phaser.Sound.BaseSound;
  shoot: Phaser.Sound.BaseSound;
  goalBorder: Phaser.Sound.BaseSound;
  border: Phaser.Sound.BaseSound;
  goalSelebration: Phaser.Sound.BaseSound;
  halfTimeEnd: Phaser.Sound.BaseSound;
  faul: Phaser.Sound.BaseSound;
  referee: Phaser.Sound.BaseSound;
  goalKeeperJumpSound: Phaser.Sound.BaseSound;

  constructor(public scene: Phaser.Scene) {
    if (SoundManager.instance) {
      return SoundManager.instance;
    }
    this.init();
  }

  init() {
    SoundManager.instance = this;

    this.stadiumNoice = this.scene.sound.add("stadium-noice", {
      volume: 0.2,
      loop: true,
    });

    this.timeStartReferee = this.scene.sound.add("time-start-referee", {
      volume: 1,
      loop: false,
    });

    this.pass = this.scene.sound.add("catch-ball", {
      volume: 1,
      loop: false,
    });

    this.catchBall = this.scene.sound.add("pass", {
      volume: 1,
      loop: false,
    });

    this.shoot = this.scene.sound.add("shoot", {
      volume: 1,
      loop: false,
    });

    this.goalBorder = this.scene.sound.add("goalBorder", {
      volume: 1,
      loop: false,
    });

    this.border = this.scene.sound.add("border", {
      volume: 1,
      loop: false,
    });

    this.goalSelebration = this.scene.sound.add("goalSelebration", {
      volume: 1,
      loop: false,
    });

    this.halfTimeEnd = this.scene.sound.add("halt-time-referee", {
      volume: 1,
      loop: false,
    });

    this.faul = this.scene.sound.add("faul", {
      volume: 1,
      loop: false,
    });

    this.referee = this.scene.sound.add("referee", {
      volume: 1,
      loop: false,
    });

    this.goalKeeperJumpSound = this.scene.sound.add("goalkeeperJumpSound", {
      volume: 1,
      loop: false,
    });
  }
}
