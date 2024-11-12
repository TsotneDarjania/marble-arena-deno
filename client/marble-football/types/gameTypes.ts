export type Team = {
  name: string;
  mainColor: string;
  secondaryColor: string;
  players: Player[];
};

export type Player = {
  name: string;
  number: number;
  position: string;
};

export type PlayerSkills = {};

export type MatchDataType = {
  hostTeam: TeamDataType;
  guestTeam: TeamDataType;
  matchTime: number;
  mathMode: "classic" | "experimental";
  stadiumSize: "small" | "normal" | "big" | "Mega";
  isExtraTimes: boolean;
  matchIsFor: "Quiq Match" | "League" | "Cup";
};

export type TeamDataType = {
  name: string;
  logoKey: string;
  formation:
    | "4-4-2"
    | "5-4-1"
    | "5-3-2"
    | "3-3-4"
    | "4-3-3"
    | "3-4-3"
    | "3-5-2";
  teamColor: string;
  teamSecondaryColor: string;
  goalSoundKey: string;
  coach: {
    name: string;
    image: string;
    happyImage: string;
    sadImage: string;
  };
  defensLine: LinePropertieTypes;
  midfieldLine: LinePropertieTypes;
  attackLine: LinePropertieTypes;
  goalKeeperSpeed: number;
  footballers: FootballerDataTypes[];
};

export type LinePropertieTypes = {
  speed: number;
  compatchness: number;
  defencStyle: "Gegenpressing" | "Zone Defence";
  passingStyle: "Direct Attack" | "Possition Attack";
  speedOfGame: "Spending Time" | "Normal" | "Play Quickly";
  wingersStyle: "Follow the Attack" | "Stay Your Position";
};

export type FootballerDataTypes = {
  name: string;
  role: "GK" | "Defender" | "Midfielder" | "Forward";
  imageURL: string;
  logoKey: string;
  passAccuracy: number;
  playerSpeed: number;
  passSpeed: number;
  shootAccuracy: number;
  shootSpeed: number;
  dribbling: number;
  defenceStrength: number;
  descipline: number;
  reaction: number;
};
