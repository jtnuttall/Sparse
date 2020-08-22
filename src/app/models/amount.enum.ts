export enum DamageType {
    Energy = '836045448940874',
    Internal = '836045448940876',
    Kinetic = '',
    Elemental = '',
}

// tslint:disable-next-line: no-namespace
export namespace DamageType {
    export function read(s: string): DamageType {
        let damageType: DamageType;

        for (const type in DamageType) {
            if (RegExp(`${type}`).test(s)) {
                damageType = DamageType[type] as DamageType;
            }
        }

        return damageType;
    }
}

export class Amount {
    static read(s: string): { value: number, type?: DamageType, isCritical: boolean } {
        if (!s || /^\s*$/.test(s)) {
            return undefined;
        }

        const [amountString, typeNumber] = /(\d+)/g.exec(s);
        const value = Number.parseFloat(amountString);
        const type = typeNumber ? DamageType.read(typeNumber) : undefined;
        const isCritical = /\*/g.test(s);

        return {
            value,
            type,
            isCritical
        };
    }
}
