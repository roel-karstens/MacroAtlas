export type IndexPoint = {
  period: string;
  /** Null is a missing observation. It is not a zero and it is not filled in. */
  value: number | null;
};

const PERIOD = /^(\d{4})-(\d{2})$/;

export function isPeriod(period: string) {
  const match = PERIOD.exec(period);
  if (!match) return false;
  const month = Number(match[2]);
  return month >= 1 && month <= 12;
}

export function previousYear(period: string) {
  const match = PERIOD.exec(period);
  if (!match) return null;
  return `${Number(match[1]) - 1}-${match[2]}`;
}

/**
 * Percent change from the same month a year earlier.
 * A missing point, or a missing partner, stays missing. Nothing is interpolated.
 */
export function yearOverYear(points: IndexPoint[]): IndexPoint[] {
  const byPeriod = new Map(points.map((point) => [point.period, point.value]));
  return points.map((point) => {
    const priorPeriod = previousYear(point.period);
    const prior = priorPeriod == null ? undefined : byPeriod.get(priorPeriod);
    if (point.value == null || prior == null || prior === 0) {
      return { period: point.period, value: null };
    }
    return { period: point.period, value: (point.value / prior - 1) * 100 };
  });
}

export type RebaseResult =
  | { ok: true; baseMean: number; points: IndexPoint[] }
  | { ok: false; reason: "empty-base" | "missing-base" | "non-positive-base" };

/**
 * Rebase to the mean of an explicit set of periods, then set that mean to 100.
 * If any requested base month is absent or null, the rebase is refused.
 * Other missing months stay null. They are not dropped and not interpolated.
 */
export function rebaseToMean(points: IndexPoint[], basePeriods: string[]): RebaseResult {
  if (basePeriods.length === 0) return { ok: false, reason: "empty-base" };
  const byPeriod = new Map(points.map((point) => [point.period, point.value]));
  const baseValues: number[] = [];
  for (const period of basePeriods) {
    if (!byPeriod.has(period) || byPeriod.get(period) == null) {
      return { ok: false, reason: "missing-base" };
    }
    baseValues.push(byPeriod.get(period) as number);
  }
  const baseMean = baseValues.reduce((sum, value) => sum + value, 0) / baseValues.length;
  if (!(baseMean > 0)) return { ok: false, reason: "non-positive-base" };
  return {
    ok: true,
    baseMean,
    points: points.map((point) => ({
      period: point.period,
      value: point.value == null ? null : (point.value / baseMean) * 100,
    })),
  };
}

/** Successive index levels. `changesPercent` are rates, not new levels. */
export function successiveLevels(start: number, changesPercent: number[]) {
  const levels = [start];
  for (const change of changesPercent) {
    const previous = levels[levels.length - 1] ?? start;
    levels.push(previous * (1 + change / 100));
  }
  return levels;
}
