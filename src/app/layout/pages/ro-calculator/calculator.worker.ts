/// <reference lib="webworker" />
import { Calculator } from './calculator';
import { getClassDropdownList } from '../../../jobs/_class-list';

const Characters = getClassDropdownList();
const calculator = new Calculator();
const calculator2 = new Calculator();

addEventListener('message', ({ data }) => {
  const { type, payload } = data;

  if (type === 'INIT') {
    const { items, hpSpTable } = payload;
    calculator.setMasterItems(items).setHpSpTable(hpSpTable);
    calculator2.setMasterItems(items).setHpSpTable(hpSpTable);
    postMessage({ type: 'INIT_DONE' });
  } else if (type === 'CALCULATE') {
    const {
      model,
      compareModel,
      selectedChanceList,
      equipAtks,
      masteryAtks,
      activeSkillNames,
      learnedSkillMap,
      consumeData,
      buffMasterys,
      buffEquips,
      monster,
      aspdPotion,
      extraOptions,
      selectedAtkSkill,
      usedHpL,
      calcCompare
    } = payload;

    const selectedCharacter = Characters.find(c => c.value === model.class)?.instant;
    if (!selectedCharacter) {
      postMessage({ type: 'CALCULATE_ERROR', error: 'Character not found' });
      return;
    }

    try {
      const calc = calculator.setClass(selectedCharacter);
      calc.loadItemFromModel(model);

      calc
        .setMonster(monster)
        .setEquipAtkSkillAtk(equipAtks)
        .setBuffBonus({ masteryAtk: buffMasterys, equipAtk: buffEquips })
        .setMasterySkillAtk(masteryAtks)
        .setConsumables(consumeData)
        .setAspdPotion(aspdPotion)
        .setExtraOptions(extraOptions)
        .setUsedSkillNames(new Set(activeSkillNames))
        .setLearnedSkills(new Map(learnedSkillMap))
        .setOffensiveSkill(selectedAtkSkill)
        .prepareAllItemBonus()
        .calcAllAtk()
        .setSelectedChances(selectedChanceList)
        .calcAllDefs()
        .calculateHpSp({ isUseHpL: usedHpL })
        .calculateAllDamages(selectedAtkSkill);

      const totalSummary = calc.getTotalSummary();
      const modelSummary = calc.getModelSummary() as any;
      const itemSummary = calc.getItemSummary();
      const chanceList = calc.chanceList;

      let compareResult = null;
      if (calcCompare && compareModel) {
        const calc2 = calculator2.setClass(selectedCharacter);
        calc2.loadItemFromModel(compareModel);
        calc2
          .setMonster(monster)
          .setEquipAtkSkillAtk(equipAtks)
          .setBuffBonus({ masteryAtk: buffMasterys, equipAtk: buffEquips })
          .setMasterySkillAtk(masteryAtks)
          .setConsumables(consumeData)
          .setAspdPotion(aspdPotion)
          .setExtraOptions(payload.compareExtraOptions || extraOptions)
          .setUsedSkillNames(new Set(activeSkillNames))
          .setLearnedSkills(new Map(learnedSkillMap))
          .setOffensiveSkill(selectedAtkSkill)
          .prepareAllItemBonus()
          .calcAllAtk()
          .setSelectedChances(payload.selectedChanceList2 || selectedChanceList)
          .calcAllDefs()
          .calculateHpSp({ isUseHpL: usedHpL })
          .calculateAllDamages(selectedAtkSkill);

        compareResult = {
          totalSummary: calc2.getTotalSummary(),
          itemSummary: calc2.getItemSummary(),
          chanceList: calc2.chanceList
        };
      }

      postMessage({
        type: 'CALCULATE_DONE',
        payload: {
          totalSummary,
          modelSummary: { ...modelSummary, rawOptionTxts: modelSummary.rawOptionTxts.filter(Boolean) },
          itemSummary,
          chanceList,
          compareResult
        }
      });
    } catch (e) {
      console.error(e);
      postMessage({ type: 'CALCULATE_ERROR', error: e.message });
    }
  } else if (type === 'CALCULATE_MONSTERS') {
    const { selectedMonsterIds, monsters, selectedAtkSkill, isUseHpL } = payload;
    
    try {
      const calcDamages = selectedMonsterIds.map((monsterId: number) => {
        const monsterData = monsters[monsterId];
        const calculated = calculator
          .setMonster(monsterData)
          .prepareAllItemBonus()
          .calcDmgWithExtraBonus({ skillValue: selectedAtkSkill, isUseHpL });

        const {
          id,
          name,
          stats: { elementShortName, level, elementName, raceName, scaleName, health, class: _class },
        } = monsterData;

        return {
          id,
          label: `${level} ${name} (${raceName}, ${scaleName?.at(0) || ''}, ${elementName})`,
          health,
          monsterClass: ['Normal', 'Champion', 'Boss'][_class],
          elementName: elementShortName,
          ...calculated,
        };
      });

      postMessage({
        type: 'CALCULATE_MONSTERS_DONE',
        payload: { calcDamages }
      });
    } catch (e) {
      console.error(e);
      postMessage({ type: 'CALCULATE_ERROR', error: e.message });
    }
  }
});
