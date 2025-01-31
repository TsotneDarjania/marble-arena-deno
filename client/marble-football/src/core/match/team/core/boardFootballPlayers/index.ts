import GamePlay from "../../../../../scenes/GamePlay";
import { TeamDataType } from "../../../../../types/gameTypes";
import { Stadium } from "../../../stadium";
import BoardGoalKeeper from "./boardGoolKeeper";
import { Column } from "./columnt";

export default class BoardFootballPlayers {
  goalKeeper: BoardGoalKeeper;

  defenceColumn: Column;
  middleColumn: Column;
  attackColumn: Column;

  constructor(
    public scene: GamePlay,
    public stadium: Stadium,
    public teamData: TeamDataType,
    public side: "left" | "right"
  ) {
    this.init();
  }

  private init() {
    this.addGoalKeeper();
    this.addFootballers();

    this.setMotionDisance();
  }

  private addGoalKeeper() {
    this.goalKeeper = new BoardGoalKeeper(this.scene, 0, 0, this.teamData);
    // Adjust Positions
    this.goalKeeper.setPosition(
      this.side === "left"
        ? -this.stadium.innerFielddWidth / 2 - this.goalKeeper.displayWidth / 2
        : this.stadium.innerFielddWidth / 2 - this.goalKeeper.displayWidth / 2,
      0
    );
    this.stadium.add(this.goalKeeper);
  }

  private addFootballers() {
    this.defenceColumn = new Column(
      this.scene,
      0,
      0,
      this.stadium,
      this.teamData,
      "defence",
      this.side
    );
    this.stadium.add(this.defenceColumn);

    this.middleColumn = new Column(
      this.scene,
      0,
      0,
      this.stadium,
      this.teamData,
      "middle",
      this.side
    );
    this.stadium.add(this.middleColumn);

    this.attackColumn = new Column(
      this.scene,
      0,
      0,
      this.stadium,
      this.teamData,
      "attack",
      this.side
    );
    this.stadium.add(this.attackColumn);

    // For Show Animation
    [
      this.defenceColumn,
      this.middleColumn,
      this.attackColumn,
      this.goalKeeper,
    ].forEach((column) => column.setAlpha(0));

    this.scene.tweens.add({
      targets: [
        this.defenceColumn,
        this.middleColumn,
        this.attackColumn,
        this.goalKeeper,
      ],
      duration: 600,
      alpha: 1,
    });
  }

  private setMotionDisance() {
    let motionDistance = 10000;
    [this.defenceColumn, this.middleColumn, this.attackColumn].forEach(
      (collumn) => {
        if (collumn.motionDistance < motionDistance) {
          motionDistance = collumn.motionDistance;
        }
      }
    );

    motionDistance -= 20;

    this.defenceColumn.motionDistance = motionDistance;
    this.middleColumn.motionDistance = motionDistance;
    this.attackColumn.motionDistance = motionDistance;
  }

  startMotion() {
    this.defenceColumn.startMotion(undefined, this.teamData.motionSpeed);
    this.middleColumn.startMotion(undefined, this.teamData.motionSpeed);
    this.attackColumn.startMotion(undefined, this.teamData.motionSpeed);
  }

  stopMotion() {
    this.defenceColumn.stopMotion();
    this.middleColumn.stopMotion();
    this.attackColumn.stopMotion();
  }
}
