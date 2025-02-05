import { Tweens } from "phaser";
import GamePlay from "../../../../../scenes/GamePlay";
import {
  FootballPlayerData,
  TeamDataType,
} from "../../../../../types/gameTypes";
import { getRandomIntNumber, mapToRange } from "../../../../../utils/math";

export default class BoardFootballPlayer extends Phaser.GameObjects.Container {
  image: Phaser.Physics.Arcade.Image;
  selector: Phaser.GameObjects.Image;

  // States
  withBall = false;
  wantToTakeBall = false;

  freeKickTween!: Tweens.Tween;

  playerData: FootballPlayerData;

  isFreeKickBehaviour = false;

  isDeactive = false;

  constructor(
    public scene: GamePlay,
    x: number,
    y: number,
    public teamData: TeamDataType,
    public side: "hostPlayer" | "guestPlayer"
  ) {
    super(scene, x, y);

    this.init();
  }

  init() {
    this.setScale(0.6);
    this.addSelector();
    this.addImage();
    this.addColliderDetector();

    this.setDepth(100);
  }

  addImage() {
    this.image = this.scene.physics.add.image(0, 0, this.teamData.logoKey);
    this.image.setCircle(30);
    this.add(this.image);
  }

  addColliderDetector() {
    this.scene.match.scene.physics.add.overlap(
      this.scene.match.ball,
      this.image,
      () => {
        if (this.wantToTakeBall) return;
        this.wantToTakeBall = true;
        this.takeBall();
      }
    );
  }

  addSelector() {
    this.selector = this.scene.add.image(0, 0, "circle");
    this.selector.setTint(0x48f526);
    this.selector.setScale(0.88);
    this.selector.setAlpha(0);

    this.add(this.selector);
  }

  takeBall() {
    if (this.scene.match.matchManager.matchStatus !== "playing") return;
    this.scene.match.matchManager.matchEvenetManager.footballerTakeBall(this);

    this.selectorOnn();
    this.scene.match.ball.stop();
    this.scene.match.ball.goTowardFootballer(this);

    setTimeout(() => {
      if (this.scene.match.matchManager.matchStatus !== "playing") return;
      // this.makeDesition();
    }, 300);
  }

  makeDesition() {
    if (this.scene.match.matchManager.matchStatus !== "playing") return;
    this.selectorOff();

    if (this.scene.match.matchManager.matchStatus === "playing") {
      const changeToMakeShortPass = getRandomIntNumber(0, 100);

      switch (this.playerData.position) {
        case "goalKeeper":
          break;
        case "defender":
          changeToMakeShortPass > 50
            ? this.makeShortPass()
            : this.makeLongPass();
          break;
        case "middfielder":
          this.makeShortPass();
          break;
        case "attacker":
          this.shoot();
          break;
      }

      setTimeout(() => {
        this.withBall = false;
      }, 500);
    }
  }

  makeShortPass() {
    this.scene.soundManager.pass.play();

    const { x, y } = this.getAnotherFootballerPositions(
      this.playerData.potentialShortPassVariants![
        getRandomIntNumber(
          0,
          this.playerData.potentialShortPassVariants!.length
        )
      ]
    );

    this.scene.match.ball.kick(mapToRange(this.teamData.passSpeed, 160, 300), {
      x,
      y,
    });
  }

  makeLongPass() {
    this.scene.soundManager.pass.play();

    const { x, y } = this.getAnotherFootballerPositions(
      this.playerData.potentialShortPassVariants![
        getRandomIntNumber(
          0,
          this.playerData.potentialShortPassVariants!.length
        )
      ]
    );

    this.scene.match.ball.kick(mapToRange(this.teamData.passSpeed, 160, 300), {
      x,
      y,
    });
  }

  shoot() {
    this.scene.soundManager.shoot.play();

    let x = 0;
    const isfailShoot =
      getRandomIntNumber(0, 100) < this.teamData.shootAccuracy ? false : true;

    let y = 0;

    if (isfailShoot) {
      const isTop = getRandomIntNumber(0, 100);
      if (isTop > 50) {
        y =
          this.scene.match.stadium.stadiumField.getBounds().centerY +
          getRandomIntNumber(110, 170);
      } else {
        y =
          this.scene.match.stadium.stadiumField.getBounds().centerY -
          getRandomIntNumber(110, 170);
      }
    } else {
      const isTop = getRandomIntNumber(0, 100);

      if (isTop > 50) {
        y =
          this.scene.match.stadium.stadiumField.getBounds().centerY +
          getRandomIntNumber(0, 130);
      } else {
        y =
          this.scene.match.stadium.stadiumField.getBounds().centerY -
          getRandomIntNumber(0, 130);
      }
    }

    if (this.playerData.who === "hostPlayer") {
      x =
        this.scene.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 40;
    } else {
      x =
        this.scene.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 40;
    }
    this.scene.match.ball.kick(mapToRange(this.teamData.shootSpeed, 250, 500), {
      x,
      y,
    });
  }

  getAnotherFootballerPositions(footballer: BoardFootballPlayer) {
    return {
      x: footballer.getBounds().centerX,
      y: footballer.getBounds().centerY,
    };
  }

  selectorOnn() {
    this.scene.add.tween({
      targets: this.selector,
      alpha: 1,
      duration: 200,
    });
  }

  selectorOff() {
    this.scene.add.tween({
      targets: this.selector,
      alpha: 0,
      duration: 200,
    });
  }

  public startFreeKickBehaviour() {
    if (this.isFreeKickBehaviour) return;

    this.isFreeKickBehaviour = true;
    this.selector.setTint(0xeb1611);

    this.image.alpha = 0.5;

    this.freeKickTween = this.scene.add.tween({
      targets: this.selector,
      alpha: 1,
      duration: 400,
      repeat: 5,
      yoyo: true,
      onComplete: () => {
        this.stopFreeKickBehaviour();
      },
    });
  }

  stopFreeKickBehaviour() {
    this.isFreeKickBehaviour = false;
    this.selector.setTint(0x48f526);
    this.selector.setAlpha(0);
    this.image.alpha = 1;

    this.freeKickTween?.destroy();
  }

  deactive() {
    this.setAlpha(0);
    this.isDeactive = true;
  }

  activate() {
    this.setAlpha(1);
    this.isDeactive = false;
  }
}
