import { MatchDataType, MatchInfoType } from "../types/gameTypes";

export const matchDataConfig = {
  hostTeamData: {
    name: "Liverpool",
    initials: "LV",
    logoKey: "liverpool",
    formation: "5-3-2",
    fansColor: 0x205c5c,
    tactics: {
      formation: {
        defenceLine: "wide-attack",
        centerLine: "wide-attack",
        attackLine: "wide-attack", //ეს ჯერ არ მუშაობს
      },
    },
    passSpeed: 1,
    shootSpeed: 1,
    goalKeeperSpeed: 1,
    motionSpeed: 1,
  },
  guestTeamData: {
    name: "Manchester City",
    initials: "MC",
    logoKey: "manchester-city",
    formation: "4-4-2",
    fansColor: 0x205c5c,
    tactics: {
      formation: {
        defenceLine: "wide-attack",
        centerLine: "wide-attack",
        attackLine: "wide-attack", // ეს ჯერ არ მუშაობს
      },
    },
    passSpeed: 100,
    shootSpeed: 100,
    goalKeeperSpeed: 100,
    motionSpeed: 100,
  },
  gameConfig: {
    mode: "board-football",
    withExtraTimes: true,
    hostFansCountPercent: 50,
  },
} as MatchDataType;

export const matchInfo = {
  matchTitle: "Marble League",
  matchSubTitle: "Fixture 1",
} as MatchInfoType;
