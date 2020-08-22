import { Injectable } from '@angular/core';
import { Observable, empty } from 'rxjs';

import * as moment from 'moment';

import { CombatLine } from '../../../models/combat-line.model';
import { Effect, EffectName } from 'src/app/models/effect.enum';
import { Amount } from 'src/app/models/amount.enum';

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  constructor() {
  }

  parse(file: Buffer): Array<CombatLine> {
    const fileStr = file.toString();
    if (/^\s*$/.test(fileStr)) { // log is empty, ignore it
      return undefined;
    }

    return fileStr
      .split('\n')
      .filter(line => !/^\s*$/.test(line))
      .map(line => this.parseLine(line));
  }

  parseLine(line: string): CombatLine {
    const elements = line.match(/(?<=\[|\()(.*?)(?=\]|\))/g);

    const time = this.parseTime(elements[0]);
    const [actor, actorCompanion] =
      elements[1]
        .replace('@', '')
        .split(':');
    const [target, targetCompanion] =
      elements[2]
        .replace('@', '')
        .split(':');
    const action = elements[3];
    const effect = elements[4];
    const isCombatStart = /EnterCombat/.test(effect);
    const isCombatEnd = /ExitCombat/.test(effect);

    let enemy: string;
    let amount: string;
    if (isCombatStart || isCombatEnd) {
      enemy = elements[5];
    } else {
      amount = elements[5];
    }


    return {
      time,
      actor,
      actorCompanion,
      target,
      targetCompanion,
      action,
      effect: Effect.read(effect),
      amount: Amount.read(amount),
      isCombatStart,
      isCombatEnd,
      enemy
    };
  }

  /**
   * Convert the time string in the log to milliseconds.
   *
   * @param time The time string in hh:mm:ss.ms format.
   */
  parseTime(time: string): number {
    const [hours, minutes, seconds, miliseconds] =
      time
        .split(/:|\./g)
        .map(Number);

    return miliseconds + (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000);
  }
}
