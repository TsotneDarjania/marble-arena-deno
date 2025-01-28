import Match from "..";

export class MatchIntroEnvironment {
  images: Array<Phaser.GameObjects.Image> = [];

  constructor(public match: Match) {
    this.init();
  }

  init() {
    this.addHostTeamfootballers();
    this.addGuestTeamfootballers();
  }

  addHostTeamfootballers() {
    this.addfootballers("left");
  }

  addGuestTeamfootballers() {
    this.addfootballers("right");
  }

  addfootballers(side: "left" | "right") {
    let y = -150;

    for (let i = 0; i < 10; i++) {
      const image = this.match.scene.add.image(
        side === "left" ? -40 : 40,
        y,
        side === "left"
          ? this.match.matchData.hostTeamData.logoKey
          : this.match.matchData.guestTeamData.logoKey
      );
      image.setScale(0.5);
      image.alpha = 0;

      this.match.scene.tweens.add({
        targets: image,
        alpha: 1,
        duration: 1000,
        delay: i * 380,
      });
      this.images.push(image);
      this.match.stadium.add(image);

      y += 33;
    }
  }

  destroy() {
    this.images.forEach((image) => {
      this.match.scene.tweens.add({
        targets: image,
        duration: 180,
        alpha: 0,
        onComplete: () => {
          image.destroy(true);
        },
      });
    });
  }
}
