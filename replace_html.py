import sys

file_path = 'src/app/layout/pages/ro-calculator/ro-calculator.component.html'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Lines to replace: 328 to 478 (0-indexed: 327 to 477)
replacement = """            <app-calculator-summary
              [totalSummary]="totalSummary"
              [isCalculating]="isCalculating"
              [isProduction]="env.production"
              [hideHpSp]="hideHpSp[selectedCharacter?.className]">
            </app-calculator-summary>
"""

new_lines = lines[:327] + [replacement] + lines[478:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Done")
