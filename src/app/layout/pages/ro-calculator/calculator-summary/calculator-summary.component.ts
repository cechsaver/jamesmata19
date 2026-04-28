import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calculator-summary',
  templateUrl: './calculator-summary.component.html',
})
export class CalculatorSummaryComponent {
  @Input() totalSummary: any;
  @Input() isCalculating = false;
  @Input() isProduction = true;
  @Input() hideHpSp = false;
}
