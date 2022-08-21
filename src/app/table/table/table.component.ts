import { Component, Input, OnInit } from '@angular/core';
import { Washed } from 'src/service/excel.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html', 
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  	@Input() fieldArray: Array<Washed> = [];
  
  	constructor() { }
  
  	ngOnInit(): void {
  	}

	 
    addFieldValue() {
		let w = {plate: "dsd", matriculaEstrangeira: true, type: "sds", created: new Date()};
        this.fieldArray.push(w);
    }
}
