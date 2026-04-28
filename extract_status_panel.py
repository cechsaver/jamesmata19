import os

src_file = 'src/app/layout/pages/ro-calculator/ro-calculator.component.html'
dest_file = 'src/app/layout/pages/ro-calculator/status-panel/status-panel.component.html'

os.makedirs(os.path.dirname(dest_file), exist_ok=True)

with open(src_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Extract lines 178 to 323 (0-indexed: 177 to 322)
# Wait, line 178 is `          <div class="col-5">` but the grid starts at line 179.
# The content to extract starts with `<div class="grid grid-nogutter">` (line 179, index 178)
# and ends with `</div>` (line 323, index 322).

extracted_lines = lines[178:323]

# In the new component, we need to bind two-way ngModel to `model` properties.
# However, modifying `model.str` directly inside the child component works fine if `model` is passed as an object reference.
# But `(valueChange)="onBaseStatusChange()"` should emit an event.
# Let's replace `(valueChange)="onBaseStatusChange()"` with `(valueChange)="statusChange.emit()"`
updated_lines = [line.replace('onBaseStatusChange()', 'statusChange.emit()') for line in extracted_lines]

with open(dest_file, 'w', encoding='utf-8') as f:
    f.writelines(updated_lines)

# Now, we replace these lines in the source file with <app-status-panel ...>
replacement = """            <app-status-panel
              [model]="model"
              [totalSummary]="totalSummary"
              [mainStatusList]="mainStatusList"
              [traitStatusList]="traitStatusList"
              [isAllowTraitStat]="isAllowTraitStat"
              (statusChange)="onBaseStatusChange()">
            </app-status-panel>
"""
new_src_lines = lines[:178] + [replacement] + lines[323:]

with open(src_file, 'w', encoding='utf-8') as f:
    f.writelines(new_src_lines)

print("Done")
