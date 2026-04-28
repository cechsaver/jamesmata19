import re
import sys

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    target_options = [
        r'itemList', r'cardList', r'enchant1List', r'enchant2List', r'enchant3List', r'enchant4List',
        r'preSets', r'characterList', r'levelList', r'jobList', r'ammoList', r'consumableList',
        r'consumableList2\[i\]', r'aspdPotionList', r'aspdPotionList2', r'extrabuff', r'monsterList'
    ]

    for opt in target_options:
        # Regex to find <p-dropdown ... [options]="opt" ... >
        # We need to make sure we don't duplicate virtualScroll if it's already there
        pattern = re.compile(rf'(<p-dropdown[^>]*\[options\]="{opt}"[^>]*)(>)')
        
        def repl(match):
            p1 = match.group(1)
            p2 = match.group(2)
            if 'virtualScroll' in p1:
                return match.group(0)
            return f'{p1} [virtualScroll]="true" [virtualScrollItemSize]="38"{p2}'
            
        content = pattern.sub(repl, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('src/app/layout/pages/ro-calculator/equipment/equipment.component.html')
process_file('src/app/layout/pages/ro-calculator/ro-calculator.component.html')
print("Done")
