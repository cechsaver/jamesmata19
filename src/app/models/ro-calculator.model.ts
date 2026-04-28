import { SelectItemGroup } from 'primeng/api';
import { ItemTypeEnum } from 'src/app/constants';

export interface MonsterSelectItemGroup extends SelectItemGroup {
  items: any[];
}

export interface ClassModel extends Partial<Record<ItemTypeEnum, number>> {
  rawOptionTxts: string[];
  weaponGrade?: any;
  leftWeaponGrade?: any;
  shieldGrade?: any;
  headUpperGrade?: any;
  headMiddleGrade?: any;
  headLowerGrade?: any;
  armorGrade?: any;
  garmentGrade?: any;
  bootGrade?: any;
  accLeftGrade?: any;
  accRightGrade?: any;
}

export interface ElementDataModel {
  name: string;
  physicalElementToMonster: number;
  magicalElementToMonster: number;
  myElement: number;
}

export interface RaceDataModel {
  name: string;
  physical: number;
  magical: number;
}

export interface SkillMultiplierModel {
  name: string;
  value: number;
  cd: string;
}
