export enum EffectType {
    ApplyEffect = '836045448945477',
    RemoveEffect = '836045448945478',
    Event = '836045448945472',
    Restore = '836045448945476',
    Spend = '836045448945473'
}

export enum EffectName {
    Heal = '836045448945500',
    Damage = '836045448945501',
    AbilityActivate = '836045448945479',
    AbilityCancel = '836045448945481',
    AbilityDeactivate = '836045448945480',
    AbilityInterrupt = '836045448945482',
    Death = '836045448945493',
    EnterCombat = '836045448945489',
    ExitCombat = '836045448945490',
    FallingDamage = '836045448945484',
    ModifyThreat = '836045448945483',
    Revived = '836045448945494',
    Taunt = '836045448945488',
    FailedEffect = '836045448945499',
    SafeLoginImmunity = '973870949466372',
    Coordination = '1781346275950860',
    HuntersBoon = '1781346275950592',
    UnnaturalMight = '1781346275950868',
    MarkOfPower = '1781346275950864',
    AdvancedKyrpraxVersatileStim = '4256329770205184',
}

// tslint:disable-next-line: no-namespace
export class Effect {
    static read(effectString: string): { type: EffectType, name: EffectName } {
        let effectType: EffectType;
        let effectName: EffectName;

        for (const type in EffectType) {
            if (RegExp(`${EffectType[type]}`).test(effectString)) {
                effectType = EffectType[type] as EffectType;
            }
        }

        for (const name in EffectName) {
            if (RegExp(`${EffectName[name]}`).test(effectString)) {
                effectName = EffectName[name] as EffectName;
            }
        }

        return {
            type: effectType,
            name: effectName
        };
    }
}
