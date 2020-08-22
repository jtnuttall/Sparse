import { Action } from './action.enum';
import { EffectName, EffectType } from './effect.enum';
import { DamageType } from './amount.enum';

export class CombatLine {
    time: number;
    actor: string;
    actorCompanion?: string;
    target: string;
    targetCompanion?: string;
    action: string;
    effect: {
        name: EffectName;
        type: EffectType;
    };
    amount?: {
        value: number;
        type?: DamageType;
        isCritical: boolean;
    };
    isCombatStart: boolean;
    isCombatEnd: boolean;
    enemy: string;

    constructor(data: Partial<CombatLine>) {
        Object.assign(this, data);
    }
}
