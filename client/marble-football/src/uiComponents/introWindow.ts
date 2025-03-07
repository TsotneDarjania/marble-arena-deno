import { calculatePercentage } from "../utils/math";

export class IntroWindow extends Phaser.GameObjects.Container {
  hostTeamIndicators: Phaser.GameObjects.Container;
  guestTeamIndicators: Phaser.GameObjects.Container;

  background: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public matchData: {
      hostTeam: {
        name: string;
        logoKey: string;
      };
      guestTeam: {
        name: string;
        logoKey: string;
      };
      info: {
        matchTitle: string;
        matchSubTitle: string;
      };
    }
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.init();
  }

  init() {
    this.addBackground();
    this.showBrandTitle();
    this.addMatchInfoTexts();
  }

  addMatchInfoTexts() {
    setTimeout(() => {
      const matchModeTitle = this.scene.add
        .text(
          this.scene.game.canvas.width / 2 +
            calculatePercentage(100, this.scene.game.canvas.width),
          this.scene.game.canvas.height / 2 - 50,
          this.matchData.info.matchTitle,
          {
            fontSize: "64px",
            color: "#ffffff",
            fontStyle: "bold",
            align: "center",
          }
        )
        .setScale(0)
        .setAlpha(0)
        .setOrigin(0.5);

      this.add(matchModeTitle);

      this.scene.tweens.add({
        targets: matchModeTitle,
        duration: 2000,
        scale: 1,
        alpha: 1,
        x: this.scene.game.canvas.width / 2,
        ease: "Expo.easeInOut",
      });

      const matchInfo = this.scene.add
        .text(
          this.scene.game.canvas.width / 2 -
            calculatePercentage(100, this.scene.game.canvas.width),
          this.scene.game.canvas.height / 2 + 50,
          this.matchData.info.matchSubTitle,
          {
            fontSize: "45px",
            color: "#ffffff",
            fontStyle: "bold",
            align: "center",
          }
        )
        .setScale(0)
        .setAlpha(0)
        .setOrigin(0.5);

      this.add(matchInfo);

      this.scene.tweens.add({
        targets: matchInfo,
        duration: 2000,
        scale: 1,
        alpha: 1,
        x: this.scene.game.canvas.width / 2,
        ease: "Expo.easeInOut",
        onComplete: () => {
          setTimeout(() => {
            this.scene.tweens.add({
              targets: matchModeTitle,
              duration: 200,
              scale: 0,
              alpha: 0,
              x:
                this.scene.game.canvas.width / 2 -
                calculatePercentage(100, this.scene.game.canvas.width),
            });

            this.scene.tweens.add({
              targets: matchInfo,
              duration: 200,
              scale: 0,
              alpha: 0,
              x:
                this.scene.game.canvas.width / 2 +
                calculatePercentage(100, this.scene.game.canvas.width),
            });
          }, 800);
        },
      });
    }, 2000);
  }

  addBackground() {
    this.background = this.scene.add
      .image(-40, 0, "default")
      .setTint(0x000000)
      .setAlpha(0.3)
      .setDisplaySize(
        this.scene.game.canvas.width + 100,
        this.scene.game.canvas.height
      )
      .setOrigin(0);

    this.add(this.background);
  }

  showBrandTitle() {
    const title = this.scene.add
      .text(
        this.scene.game.canvas.width / 2,
        this.scene.game.canvas.height / 2,
        "Marble Arena",
        {
          fontSize: "144px",
          color: "#ffffff",
          fontStyle: "bold",
          align: "center",
        }
      )
      .setScale(0)
      .setAlpha(0)
      .setOrigin(0.5);

    this.add(title);

    this.scene.tweens.add({
      targets: title,
      duration: 1200,
      scale: 1,
      alpha: 1,
      ease: "Expo.easeInOut",
    });

    setTimeout(() => {
      this.scene.tweens.add({
        targets: title,
        duration: 1200,
        scale: 0,
        alpha: 0,
        ease: "Expo.easeInOut",
      });

      this.addHostTeamIndicators();
      this.addGuesTeamIndicators();
    }, 2000);
  }

  addGuesTeamIndicators() {
    this.guestTeamIndicators = this.scene.add
      .container(
        this.scene.game.canvas.width -
          calculatePercentage(7, this.scene.game.canvas.width),
        this.scene.game.canvas.height + 500
      )
      .setAlpha(0);

    // const guestTeamLogo = this.scene.add
    //   .image(0, 0, this.matchData.guestTeam.logoKey)
    //   .setDisplaySize(
    //     calculatePercentage(12, this.scene.game.canvas.width),
    //     calculatePercentage(12, this.scene.game.canvas.width)
    //   );

    // this.guestTeamIndicators.add(guestTeamLogo);

    //Title
    // const title = this.scene.add
    //   .text(
    //     calculatePercentage(-7, this.scene.game.canvas.width),
    //     calculatePercentage(-0.5, this.scene.game.canvas.width),
    //     this.matchData.guestTeam.name,
    //     {
    //       fontSize: "42px",
    //       color: "#ffffff",
    //       fontStyle: "bold",
    //       align: "right",
    //     }
    //   )
    //   .setOrigin(1, 0);

    // this.guestTeamIndicators.add(title);

    this.add(this.guestTeamIndicators);

    this.scene.tweens.add({
      targets: this.guestTeamIndicators,
      duration: 2000,
      y:
        this.scene.game.canvas.height -
        calculatePercentage(7, this.scene.game.canvas.width),
      alpha: 1,
      ease: "Expo.easeInOut",
    });
  }

  addHostTeamIndicators() {
    this.hostTeamIndicators = this.scene.add
      .container(calculatePercentage(7, this.scene.game.canvas.width), -500)
      .setAlpha(0);

    // const hostTeamLogo = this.scene.add
    //   .image(0, 0, this.matchData.hostTeam.logoKey)
    //   .setDisplaySize(
    //     calculatePercentage(12, this.scene.game.canvas.width),
    //     calculatePercentage(12, this.scene.game.canvas.width)
    //   );

    // this.hostTeamIndicators.add(hostTeamLogo);

    //Title
    // const title = this.scene.add.text(
    //   calculatePercentage(7, this.scene.game.canvas.width),
    //   calculatePercentage(-0.5, this.scene.game.canvas.width),
    //   this.matchData.hostTeam.name,
    //   {
    //     fontSize: "42px",
    //     color: "#ffffff",
    //     fontStyle: "bold",
    //     align: "left",
    //   }
    // );

    // this.hostTeamIndicators.add(title);

    this.add(this.hostTeamIndicators);

    this.scene.tweens.add({
      targets: this.hostTeamIndicators,
      duration: 2000,
      y: calculatePercentage(7, this.scene.game.canvas.width),
      alpha: 1,
      ease: "Expo.easeInOut",
    });
  }
}
