import Match from "..";
import CanvasScene from "../../../scenes/CanvasScene";
import { getRandomIntNumber } from "../../../utils/math";

export class ComentatorManager {
  canvasScene!: CanvasScene;

  constructor(public match: Match) {
    this.canvasScene = match.scene.scene.get("CanvasScene") as CanvasScene;
  }

  showCommentForDefennder(forWhichTeam: "host" | "guest") {
    this.canvasScene.showComment(
      forWhichTeam === "host"
        ? this.match.matchData.hostTeamData.comments.defenderComments[
            getRandomIntNumber(
              0,
              this.match.matchData.hostTeamData.comments.defenderComments.length
            )
          ]
        : this.match.matchData.guestTeamData.comments.defenderComments[
            getRandomIntNumber(
              0,
              this.match.matchData.guestTeamData.comments.defenderComments
                .length
            )
          ]
    );
  }

  showCommentForGoalKeeper(forWhichTeam: "host" | "guest") {
    this.canvasScene.showComment(
      forWhichTeam === "host"
        ? this.match.matchData.hostTeamData.comments.saveBallComments[
            getRandomIntNumber(
              0,
              this.match.matchData.hostTeamData.comments.saveBallComments.length
            )
          ]
        : this.match.matchData.guestTeamData.comments.saveBallComments[
            getRandomIntNumber(
              0,
              this.match.matchData.guestTeamData.comments.saveBallComments
                .length
            )
          ]
    );
  }

  showCommentForShooter(forWhichTeam: "host" | "guest") {
    this.canvasScene.showComment(
      forWhichTeam === "host"
        ? this.match.matchData.hostTeamData.comments.shooterComments[
            getRandomIntNumber(
              0,
              this.match.matchData.hostTeamData.comments.shooterComments.length
            )
          ]
        : this.match.matchData.guestTeamData.comments.shooterComments[
            getRandomIntNumber(
              0,
              this.match.matchData.guestTeamData.comments.shooterComments.length
            )
          ]
    );
  }
}
