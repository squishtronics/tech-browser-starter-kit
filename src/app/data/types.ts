export interface Data {
  technologies: Technology[];
  facilities: Facility[];
  weapons: Weapon[];
  armors: Armor[];
  abilities: Ability[];
}

export type GameObject =
  | Ability
  | Armor
  | Facility
  | Technology
  | Weapon;

export interface Ability {
  readonly type: 'ability';
  readonly name: string;
  readonly cost: number;
  readonly prereq: TechnologyId;
  readonly description: string;
}

export interface Armor {
  readonly type: 'armor';
  readonly name: string;
  readonly shortName: string;
  readonly rating: number;
  readonly mode: ArmorMode;
  readonly cost: number;
  readonly prereq: TechnologyId;
}

export type ArmorMode = 'projectile' | 'binary';

export interface Facility {
  readonly type: 'facility';
  readonly name: string;
  readonly cost: number;
  readonly maintenance: number;
  readonly prereq: TechnologyId;
  readonly effect: string;
  readonly isSecretProject: boolean;
  readonly blurb: string | null;
}

export interface Technology {
  readonly type: 'technology';
  readonly index: number;
  readonly name: string;
  readonly id: TechnologyId;
  readonly prereq1: TechnologyId;
  readonly prereq2: TechnologyId;
  readonly blurb: string;
}

export interface Weapon {
  readonly type: 'weapon';
  readonly name: string;
  readonly shortName: string;
  readonly offense: number;
  readonly mode: WeaponMode;
  readonly cost: number;
  readonly prereq: TechnologyId;
}

export type WeaponMode =
  | 'projectile'
  | 'colonist';

export type TechnologyId = string & { ___brand: 'technologyId' };

export const TechnologyId = {
  Root: 'None' as TechnologyId
};


export function getTechnologyPrereqs(technology: Technology): readonly TechnologyId[] {
  const result = [technology.prereq1];
  if (
    technology.prereq2 !== TechnologyId.Root &&
    technology.prereq2 !== technology.prereq1
  ) {
    result.push(technology.prereq2);
  }
  return result;
}

export function getDetails(object: GameObject): string {
  switch (object.type) {
    case 'facility':
      return object.effect;
    case 'ability':
      return object.description;
    case 'armor':
      return `D${object.rating}, ${capitalize(object.mode)} `;
    case 'weapon':
      return `A${object.offense}, ${capitalize(object.mode)} `;
  }
  return '';
}

function capitalize(value: string): string {
  try {
    return value[0].toUpperCase() + value.substring(1);
  } catch {
    console.error(`failed to capitalize ${value}`);
    return '?';
  }
}
