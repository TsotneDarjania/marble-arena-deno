export function calculateStadiumHeight(width: number) {
  const aspectRatio = 0.5; // Height-to-width ratio
  return width * aspectRatio;
}

export function calculatePercentage(percent: number, value: number): number {
  return (percent / 100) * value;
}
