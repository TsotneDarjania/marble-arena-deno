import { MatchDataType, MatchInfoType } from "../types/gameTypes";

export const matchDataConfig: MatchDataType = {
  hostTeamData: {
    name: "Liverpool",
    initials: "LV",
    logoKey: "liverpool",
    formation: "3-4-3",
    fansColor: 0xc8102e,
    tactics: {
      formation: {
        defenceLine: "normal",
        centerLine: "wide-attack",
        attackLine: "wide-back",
      },
    },
    passSpeed: 70,
    shootSpeed: 90,
    shootAccuracy: 51,
    goalKeeperSpeed: 84,
    motionSpeed: 51,
    comments: {
      saveBallComments: [
        "Nice Save",
        "Great GoalKeeper",
        "Good Job",
        "Fantascit Save",
        "Buffon Is Amazing",
      ],
      defenderComments: [
        "Good Defence",
        "Chiellinni was good",
        "Good Chance for CounterAttack",
      ],
      shooterComments: [
        "Great Shoot!",
        "May it will be Goal",
        "Look at that, wow !!",
      ],
    },
    freeKiskFrequency: 100, // from 0 to 100
    penaltyFrequency: 0, // from 0 to 100
  },
  guestTeamData: {
    name: "Manchester City",
    initials: "MC",
    logoKey: "manchester-city",
    formation: "4-3-3",
    fansColor: 0x6cabdd,
    tactics: {
      formation: {
        defenceLine: "wide-attack",
        centerLine: "wide-attack",
        attackLine: "normal",
      },
    },
    passSpeed: 100,
    shootSpeed: 100,
    shootAccuracy: 50,
    goalKeeperSpeed: 100,
    motionSpeed: 100,
    comments: {
      saveBallComments: [
        "Nice Save",
        "Great GoalKeeper",
        "Good Job",
        "Fantascit Save",
        "Buffon Is Amazing",
      ],
      defenderComments: [
        "Good Defence",
        "Chiellinni was good",
        "Good Chance for CounterAttack",
      ],
      shooterComments: [
        "Great Shoot!",
        "May it will be Goal",
        "Look at that, wow !!",
      ],
    },
    freeKiskFrequency: 100, // from 0 to 100
    penaltyFrequency: 0, // from 0 to 100
  },
  gameConfig: {
    mode: "marble-football",
    hostFansCountPercent: 50,
    mathTime: 0.5, //in minutes,
  },
} as MatchDataType;

export const matchInfo = {
  matchTitle: "Marble League",
  matchSubTitle: "Fixture 1",
} as MatchInfoType;

export const stadiumConfig = {
  spectatorsBackground: 0xbac1cc,
};
