import { CombatLine } from './combat-line.model';

import { Fight } from './fight.model';

export class Log {
  trackingId: number;
  filename: string;
  filePath: string;
  actor: string;
  date: Date;
  fights: Array<Fight>;
  nonCombatEvents: Array<Array<CombatLine>>;
  readonly topDps: number;
  readonly topHps: number;
  readonly topTps: number;

  constructor(data: Partial<Log>) {
    Object.assign(this, data);

    this.topDps = this.getTopDps();
    this.topHps = this.getTopHps();
    this.topTps = this.getTopTps();
  }

  private getTopDps(): number {
    return this
      .fights
      .map(fight => fight.totalDps)
      .maximum();
  }

  private getTopHps(): number {
    return this
        .fights
        .map(fight => fight.totalHps)
        .maximum();
  }

  private getTopTps(): number {
    return this
      .fights
      .map(fight => fight.totalTps)
      .maximum();
  }
}
