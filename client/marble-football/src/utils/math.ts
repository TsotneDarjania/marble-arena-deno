export function calculatePercentage(percent: number, value: number): number {
  return (percent / 100) * value;
}

export function getRandomIntNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
