import Match from "../../..";
import GamePlay from "../../../../../scenes/GamePlay";
import {
  FootballPlayerData,
  TeamDataType,
} from "../../../../../types/gameTypes";
import { getRandomIntNumber } from "../../../../../utils/math";

export default class BoardFootballPlayer extends Phaser.GameObjects.Container {
  image: Phaser.Physics.Arcade.Image;
  selector: Phaser.GameObjects.Image;
  match: Match;

  withBall = false;

  playerData: FootballPlayerData;

  constructor(
    scene: GamePlay,
    x: number,
    y: number,
    public teamData: TeamDataType
  ) {
    super(scene, x, y);

    this.init();
  }

  init() {
    this.setScale(0.6);
    this.addSelector();
    this.addImage();

    this.setDepth(100);
  }

  addImage() {
    this.image = this.scene.physics.add.image(0, 0, this.teamData.logoKey);
    this.image.setCircle(30);
    this.add(this.image);
  }

  addSelector() {
    this.selector = this.scene.add.image(0, 0, "circle");
    this.selector.setTint(0x48f526);
    this.selector.setScale(0.88);
    this.selector.setAlpha(0);

    this.add(this.selector);
  }

  addCollider() {
    this.scene.physics.add.overlap(this.match.ball, this.image, () => {
      if (!this.withBall) {
        this.withBall = true;
        this.takeBall();
      }
    });
  }

  set setMatch(match: Match) {
    this.match = match;
  }

  takeBall() {
    this.selectorOnn();

    this.match.ball.stop();
    this.match.ball.goTowardFootballer(this);

    this.match.matchManager.someoneTakeBall(this);

    setTimeout(() => {
      this.makeDesition();
    }, 300);
  }

  makeDesition() {
    this.selectorOff();

    if (this.match.matchManager.matchStatus === "playing") {
      const changeToMakeShortPass = getRandomIntNumber(0, 100);

      switch (this.playerData.position) {
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
    const { x, y } = this.getAnotherFootballerPositions(
      this.playerData.potentialShortPassVariants![
        getRandomIntNumber(
          0,
          this.playerData.potentialShortPassVariants!.length
        )
      ]
    );

    this.match.ball.kick(200, {
      x,
      y,
    });
  }

  makeLongPass() {
    const { x, y } = this.getAnotherFootballerPositions(
      this.playerData.potentialShortPassVariants![
        getRandomIntNumber(
          0,
          this.playerData.potentialShortPassVariants!.length
        )
      ]
    );

    this.match.ball.kick(200, {
      x,
      y,
    });
  }

  shoot() {
    let x = 0;
    let y =
      this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds().centerY;

    if (this.playerData.who === "hostPlayer") {
      x =
        this.match.guestTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX + 40;
    } else {
      x =
        this.match.hostTeam.boardFootballPlayers.goalKeeper.getBounds()
          .centerX - 40;
    }

    this.match.ball.kick(300, { x, y });
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
}
