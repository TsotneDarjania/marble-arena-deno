import BoardFootballPlayer from "../core/match/team/footballplayers/boardFootballPlayer";
import GamePlay from "../scenes/GamePlay";

export type MatchType = {
  scene: GamePlay;
  hostTeamData: TeamDataType;
  guestTeamData: TeamDataType;
  gameConfig: GameConfigType;
};

export type TeamDataType = {
  name: string;
  initials: string;
  logoKey: string;
  formation: "4-4-2" | "4-3-3" | "5-3-2";
<<<<<<< HEAD
  tactics: {
    formation: {
      defenceLine: "normal" | "wide-attack";
      centerLine: "normal" | "wide-attack" | "wide-back";
      attackLine: "normal" | "wide-attack" | "wide-back";
=======
  fansColor: number;
  tactics: {
    formation: {
      defenceLine: "wide-attack";
      centerLine: "wide-attack" | "wide-back";
>>>>>>> 80a553d86706c7472dda376310a9803cf7936adf
    };
  };
  passSpeed: number;
  fansColor: number;
  shootSpeed: number;
  goalKeeperSpeed: number;
  motionSpeed: number;
};

export type GameConfigType = {
  mode:
    | "board-football"
    | "old-style"
    | "new-style"
    | "marble-football"
    | "experimental";
  withExtraTimes: boolean;
  hostFansCountPercent: number; // her you can set how many host team fans you want on stadium (from 0 to 100)
};

export type FootballPlayerData = {
  who: "unkown" | "hostPlayer" | "guestPlayer";
  potentialShortPassVariants?: BoardFootballPlayer[];
  potentialLongPassVariants?: BoardFootballPlayer[];
  position: "goalKeeper" | "defender" | "middfielder" | "attacker";
};
