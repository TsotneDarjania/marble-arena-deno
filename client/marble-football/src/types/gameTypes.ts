import BoardFootballPlayer from "../core/match/team/footballplayers/boardFootballPlayer";

export type TeamDataType = {
  name: string;
  initials: string;
  logoKey: string;
  formation: "4-4-2" | "4-3-3" | "5-3-2";
  fansColor: number;
  tactics: {
    formation: {
      defenceLine: "wide-attack";
      centerLine: "wide-attack" | "wide-back";
    };
  };
  passSpeed: number;
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
};

export type FootballPlayerData = {
  who: "unkown" | "hostPlayer" | "guestPlayer";
  potentialShortPassVariants?: BoardFootballPlayer[];
  potentialLongPassVariants?: BoardFootballPlayer[];
  position: "goalKeeper" | "defender" | "middfielder" | "attacker";
};
