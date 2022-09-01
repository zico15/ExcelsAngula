import { Cell, Workbook, Worksheet } from 'exceljs';
import { environment } from 'src/environments/environment';
import { MomentjsService } from './momentjs.service';
import { GlobalService } from './global.service';
import * as fs from 'file-saver';

export class ExcelService {
  private workbook = new Workbook();

  constructor() {
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
    this.setColumDropDown(pagie1, 'C', this.getWashTypes);
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
    const values: Washed[] = [];
    const erros: Washed[] = [];
    sheet?.eachRow(async (row, rowNumber) => {
      if (rowNumber > 1) {
        const isEstrangeira = row.getCell(2).value == 'Sim';
        const hour: any = row.getCell(4).value?.toString();
        const plate: any = row.getCell(1).value?.toString().toUpperCase();
        let date: any = row.getCell(5).value;
        if (plate) {
          if (MomentjsService.isValid(date))
            date = MomentjsService.format(date.toISOString(), 'DD/MM/yyyy');
          let data: Washed = {
            plate: GlobalService.validatePlate(plate),
            matriculaEstrangeira: isEstrangeira,
            type: row.getCell(3).value,
            created: MomentjsService.getMoment(
              hour + date,
              'HH:mmDD/MM/yyyy'
            ).toDate(),
          };
          if (isEstrangeira) data.plate = plate;
          if (this.isValidateWashed(data)) values.push(data);
          else if (data.plate) erros.push(data);
        }
      }
    });
    if (erros.length > 0) throw erros;
    return values;
  }

  private get getWashTypes() {
    return environment.results.map((n) => n.name);
  }

  private isValidateWashed(washed: Washed): boolean {
    if (
      (washed.plate || washed.matriculaEstrangeira) &&
      MomentjsService.isValid(washed.created) &&
      this.getWashTypes.includes(washed.type)
    )
      return true;
    return false;
  }

  private createWorksheet(pagineNmae: string, header?: string[]): Worksheet {
    let worksheet: Worksheet = this.workbook.addWorksheet(pagineNmae);
    if (header != undefined) worksheet.addRow(header);
    return worksheet;
  }
}

export interface Washed {
  plate?: string;
  matriculaEstrangeira: boolean;
  type: string | any;
  created: Date;
}
