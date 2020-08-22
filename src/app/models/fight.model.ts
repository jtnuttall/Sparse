import { CombatLine } from './combat-line.model';
import { EffectName } from './effect.enum';

export class Fight {
  combatEvents: Array<CombatLine>;
  readonly totalDps: number;
  readonly totalHps: number;
  readonly totalTps: number;
  readonly maxDamage: number;

  constructor(data: Partial<Fight>) {
    Object.assign(this, data);

    this.totalDps = this.dpsSlice(0);
    this.totalHps = this.hpsSlice(0);
    this.totalTps = this.tpsSlice(0);
    this.maxDamage = this.damage.length > 0 ? this.damage.map(dmg => dmg.damage).maximum() : 0;
  }

  get timeElapsedMs(): number {
    return this.combatEvents[this.combatEvents.length - 1].time - this.combatEvents[0].time;
  }

  get damage(): Array<{time: number, damage: number}> {
    const startTime = this.combatEvents[0].time;

    return this
      .combatEvents
      .filter(line => line.effect.name === EffectName.Damage)
      .map(line => {
        return {
          time: line.time - startTime,
          damage: line.amount.value
        };
      });
  }

  dpsSlice(startMs: number, endMs?: number): number {
    const damage =
      this
        .sliceMs(startMs, endMs)
        .filter(line => line.effect.name === EffectName.Damage)
        .map(line => line.amount.value)
        .sum();

    return damage / (this.timeElapsedMs / 1000.0);
  }

  hpsSlice(startMs: number, endMs?: number): number {
    return 0;
  }

  tpsSlice(startMs: number, endMs?: number): number {
    return 0;
  }

  private sliceMs(startMs: number, endMs?: number): Array<CombatLine> {
    const start = this.combatEvents.findIndex(line => line.time >= startMs);
    const end = endMs
      ? this.combatEvents.map(line => line.time > endMs).indexOf(true) - 1
      : this.combatEvents.length;

    return this.combatEvents.slice(start, end);
  }
}
