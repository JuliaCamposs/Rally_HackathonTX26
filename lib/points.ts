export const POINTS_PER_PRESENCE = 50;
export const POINTS_PER_LEVEL = 150;

export type PointsDto = {
  points: number;
  level: number;
  intoLevel: number;
  nextLevelAt: number;
  checkIns: number;
  progress: number;
};

export function toPointsDto(total: number, checkIns: number): PointsDto {
  const intoLevel = total % POINTS_PER_LEVEL;
  return {
    points: total,
    level: Math.floor(total / POINTS_PER_LEVEL) + 1,
    intoLevel,
    nextLevelAt: POINTS_PER_LEVEL,
    checkIns,
    progress: Math.round((intoLevel / POINTS_PER_LEVEL) * 100),
  };
}
