const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const targetOptions = [
    'itemList', 'cardList', 'enchant1List', 'enchant2List', 'enchant3List', 'enchant4List',
    'preSets', 'characterList', 'levelList', 'jobList', 'ammoList', 'consumableList',
    'consumableList2\\[i\\]', 'aspdPotionList', 'aspdPotionList2', 'extrabuff', 'monsterList'
  ];
  
  for (const opt of targetOptions) {
    // Regex to find p-dropdown with the specific option and add virtualScroll if not already present
    // We look for [options]="opt" and then we will add [virtualScroll]="true" [virtualScrollItemSize]="38"
    const regex = new RegExp(`(<p-dropdown[^>]*\\[options\\]="${opt}"[^>]*)(>)`, 'g');
    content = content.replace(regex, (match, p1, p2) => {
      if (p1.includes('virtualScroll')) return match;
      return `${p1} [virtualScroll]="true" [virtualScrollItemSize]="38"${p2}`;
    });
  }
  
  fs.writeFileSync(filePath, content);
}

processFile('src/app/layout/pages/ro-calculator/equipment/equipment.component.html');
processFile('src/app/layout/pages/ro-calculator/ro-calculator.component.html');
console.log("Done");
