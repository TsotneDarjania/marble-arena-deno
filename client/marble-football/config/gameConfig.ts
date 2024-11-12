import { MatchDataType } from "../types/gameTypes";
import { initialTeamsData } from "./initialTeamsData";

export const matchData: MatchDataType = {
  hostTeam: initialTeamsData.find((team) => team.name === "Arsenal")!,
  guestTeam: initialTeamsData.find((team) => team.name === "Barselona")!,
  matchTime: 2,
  mathMode: "experimental",
  stadiumSize: "small",
  isExtraTimes: false,
  matchIsFor: "Quiq Match",
};

export const matchStats = {
  hostTeamStats: {
    shoots: 0,
    passes: 0,
    ballPossession: 0,
    corners: 0,
    fouls: 0,
    score: 0,
  },
  guesTeamStats: {
    shoots: 0,
    passes: 0,
    ballPossession: 0,
    corners: 0,
    fouls: 0,
    score: 0,
  },
};

export type matchStatsProps = {
  hostTeamStats: {
    shoots: number;
    passes: number;
    ballPossession: number;
    corners: number;
    fouls: number;
    score: number;
  };
  guesTeamStats: {
    shoots: number;
    passes: number;
    ballPossession: number;
    corners: number;
    fouls: number;
    score: number;
  };
};
