export function calculatePercentage(percent: number, value: number): number {
  return (percent / 100) * value;
}

export function getRandomIntNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function mapToRange(
  value: number,
  outputMin: number,
  outputMax: number
): number {
  return ((value - 0) / (100 - 0)) * (outputMax - outputMin) + outputMin;
}

export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
