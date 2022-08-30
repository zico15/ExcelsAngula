import { Cell, Row, Workbook, Worksheet } from 'exceljs';
import { environment } from 'src/environments/environment';
import { MomentjsService } from './momentjs.service';
import { GlobalService } from './global.service';
import * as fs from 'file-saver';

export class ExcelService {
  private workbook = new Workbook();

  constructor(private fileName: string) {
    this.generateExcel();
  }

  generateExcel() {
    let pagie1 = this.createWorksheet('Table 1', [
      'Matrícula',
      'Matrícula é estrangeira?',
      'Serviço',
      'Hora',
      'Data',
    ]);
    this.setColumColor(['A', 'B', 'C', 'D', 'E']);
    this.setColumDropDown(pagie1, 'B', ['Não', 'Sim']);
    this.setColumDate(pagie1, 'E');
    this.setColumText(pagie1, 'D');
    this.setResizePage(pagie1);
    const values: Array<string> = environment.results.map((n) => n.name);
    this.setColumDropDown(pagie1, 'C', values);
  }

  createWorksheet(pagineNmae: string, header?: string[]): Worksheet {
    let worksheet: Worksheet = this.workbook.addWorksheet(pagineNmae);
    if (header != undefined) worksheet.addRow(header);
    return worksheet;
  }

  async importFile(file: File) {
    this.workbook = await this.workbook.xlsx.load(await file.arrayBuffer());
  }

  public getWorksheet(indexSheet: number): Worksheet {
    return this.workbook.getWorksheet(indexSheet);
  }

  public exportFile(): void {
    this.workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'CarData.xlsx');
    });
  }

  public setColumDropDown(
    worksheet: Worksheet,
    colum: string,
    values: string[],
    max?: number
  ) {
    const size: Number = max == undefined ? 100 : max;
    let sizeText: number = 12;
    values.map((n) => {
      if (n.length > sizeText) sizeText = n.length;
    });
    for (let i = 2; i < size; i++) {
      let cell: Cell = worksheet.getCell(colum + i);
      cell.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"' + values.toString() + '"'],
      };
      cell.value = values[0];
    }
    worksheet.getColumn(colum).width = sizeText + 3;
  }

  public setColumDate(worksheet: Worksheet, colum: string, max?: number) {
    const size: Number = max == undefined ? 100 : max;
    for (let i = 2; i < size; i++) {
      let cell: Cell = worksheet.getCell(colum + i);
      cell.dataValidation = {
        type: 'date',
        allowBlank: true,
        formulae: [],
      };
      cell.value = MomentjsService.format(new Date(), 'DD/MM/yyyy').toString();
      cell.numFmt = 'DD/MM/yyyy';
    }
  }

  public setColumText(worksheet: Worksheet, colum: string, max?: number) {
    const size: Number = max == undefined ? 100 : max;
    for (let i = 2; i < size; i++) {
      let cell: Cell = worksheet.getCell(colum + i);
      cell.dataValidation = {
        type: 'textLength',
        allowBlank: true,
        formulae: [],
      };
      cell.value = '';
      cell.numFmt = '@';
    }
  }

  public setColumColor(colum: string[]) {
    this.workbook.eachSheet((worksheet) => {
      colum.forEach((c) => {
        let color: string = 'ffffff';
        for (let i = 1; i < 100; i++) {
          let cell: Cell = worksheet.getCell(c + i);
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          };
          cell.style.alignment = { horizontal: 'center', vertical: 'middle' };
          color = color == 'ffffff' ? 'dfdfdb' : 'ffffff';
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      });
    });
  }

  public setResizePage(worksheet: Worksheet, size?: number) {
    worksheet.eachRow((row) => {
      row.height = 20;
    });
    worksheet.columns.forEach((c) => {
      c.alignment = { vertical: 'middle', horizontal: 'center' };
      if (!size) {
        let rowSize: number = 0;
        c.values?.forEach((value) => {
          if (value && rowSize < value.toString().length)
            rowSize = value.toString().length;
        });
        c.width = rowSize < 10 ? 12 : rowSize + 3;
      } else c.width = size;
    });
  }

  public async getValues(sheet: Worksheet): Promise<Array<Washed>> {
    let plate: string = washed.plate ? washed.plate : '';
    plate = GlobalService.validatePlate(plate);
    if ((plate || washed.matriculaEstrangeira) && washed.created && washed.type)
      return true;
    return false;
  }

  async getValues(sheet: Worksheet): Promise<Array<Washed>> {
    const values: Washed[] = [];
    const erros: Washed[] = [];
    const rows: Row[] = [];

    sheet?.eachRow(async (row, rowNumber) => {
      if (rowNumber > 1) {
        let isEstrangeira = row.getCell(2).value?.toString().toUpperCase();
        let hour: any = row.getCell(4).value?.toString();
        let date: any = row.getCell(5).value?.toString();
        let data: Washed = {
          plate: GlobalService.validatePlate(plate),
          matriculaEstrangeira: isEstrangeira == 'SIM' ? true : false,
          type: row.getCell(3).value?.toString(),
          created: MomentjsService.getMoment(
            hour + date,
            'HH:mmDD/MM/yyyy'
          ).toDate(),
        };
        if (
          MomentjsService.isValid(hour, 'HH:mm') &&
          MomentjsService.isValid(date, 'DD/MM/yyyy') &&
          this.isValidateWashed(data)
        )
          values.push(data);
        else if (data.plate) erros.push(data);
      }
    });
    if (erros.length > 0) throw erros;
    return values;
  }
}

export interface Washed {
  plate?: string;
  matriculaEstrangeira: boolean;
  type?: string;
  created: Date;
}
