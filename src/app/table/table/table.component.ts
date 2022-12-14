import { Component, Input } from '@angular/core';
import { Washed } from 'src/service/excel.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() fieldArray: Array<Washed> = [];
}
