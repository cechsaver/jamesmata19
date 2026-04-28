import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-status-panel',
  templateUrl: './status-panel.component.html',
})
export class StatusPanelComponent {
  @Input() model: any;
  @Input() totalSummary: any;
  @Input() mainStatusList: any[] = [];
  @Input() traitStatusList: any[] = [];
  @Input() isAllowTraitStat = false;

  @Output() statusChange = new EventEmitter<void>();
}
