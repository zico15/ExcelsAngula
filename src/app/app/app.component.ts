import { Component } from '@angular/core';
import { ExcelService, Washed } from 'src/service/excel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  fieldList: Array<Washed> = [];

  async openFile(event: any) {
    let file: File = event.target.files[0];

    console.log('file: ' + file);
    let excel = new ExcelService('testeFile');
    await excel.importFile(file);
    try {
      this.fieldList = await excel.getValues(excel.getWorksheet(1));
      console.log('LIST OK => ' + JSON.stringify(this.fieldList));
    } catch (error: any) {
      this.fieldList = error;
      console.log('LIST ERROR => ' + JSON.stringify(this.fieldList));
    }
  }

  generateExcel() {
    let excel = new ExcelService('testeSave');
    excel.exportFile();
  }
}
