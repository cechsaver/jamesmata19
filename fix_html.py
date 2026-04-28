import sys

# 1. Update calculator-summary.component.html
file1 = 'src/app/layout/pages/ro-calculator/calculator-summary/calculator-summary.component.html'
with open(file1, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove the first line <div class="grid grid-nogutter" style="position: relative">
# and the last line </div>
# The loading block should also be moved out, or kept? Let's keep it here, it works without the wrapper if it's placed inside the parent grid.
# Actually, the parent grid has position:relative which is needed for loading_block.
# So if we remove the wrapper from component, parent must have it.
if "position: relative" in lines[0]:
    new_lines_1 = lines[1:-1]
    with open(file1, 'w', encoding='utf-8') as f:
        f.writelines(new_lines_1)


# 2. Update ro-calculator.component.html
file2 = 'src/app/layout/pages/ro-calculator/ro-calculator.component.html'
with open(file2, 'r', encoding='utf-8') as f:
    lines2 = f.readlines()

# We need to wrap <app-calculator-summary> in the grid.
# In ro-calculator, <app-calculator-summary> starts at line 328 (index 327)
for i, line in enumerate(lines2):
    if "<app-calculator-summary" in line:
        # Insert grid wrapper before
        lines2.insert(i, '            <div class="grid grid-nogutter" style="position: relative">\n')
        break

# The grid is still open! But wait, previously the original grid was closed at line 494. 
# But when I replaced lines 327 to 477, I replaced 151 lines with 6 lines.
# So the closing </div> of the original grid was at index 494 in original file.
# Since I replaced lines 327 to 477, the original closing </div> was NOT replaced! It is still there!
# Let me double check if it's still there.

with open(file2, 'w', encoding='utf-8') as f:
    f.writelines(lines2)

print("Done")
