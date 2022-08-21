import { Component, OnInit } from '@angular/core';
import { Row } from 'exceljs';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { ExcelService, Washed } from 'src/service/excel.service';
import { TableComponent } from '../table/table/table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'teste';
  name = 'dsdsd';
  file = 'sds';
  stream = '';
  fileName = '';
  fieldList: Array<Washed> = [];

  constructor()
  {
	
  }
  ngOnInit(): void {}

  async openFile(event: any) {
    let file: File = event.target.files[0];

    console.log('file: ' + file);
    let excel = new ExcelService('testeFile');
    await excel.importFile(file);
	try {
		this.fieldList = await excel.getValues(excel.getWorksheet(1));
		console.log("LIST OK => " + JSON.stringify(this.fieldList));	
	} catch (error) {
		let w = error;
		this.fieldList = JSON.parse(JSON.stringify(error));
		console.log("LIST ERROR => " + (JSON.stringify(error)));
	}
  }

  generateExcel() {
    let excel = new ExcelService('testeSave');
    let pagie1 = excel.createWorksheet('Table 1', [
      'Matrícula',
      'Matrícula é estrangeira?',
      'Serviço',
	  'Hora',
      'Data',
    ]);
    excel.setColumColor(['A', 'B', 'C', 'D', 'E']);
	excel.setColumDropDown(pagie1, 'B', ["Sim", "Não"]);
    excel.setColumDate(pagie1, 'E');
    excel.setResizePage(pagie1);	
	const values: Array<string> = environment.results.map((n) => n.name);
	excel.setColumDropDown(pagie1, 'C', values);
    excel.exportFile();
  }
}
