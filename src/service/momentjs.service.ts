import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class MomentjsService {
  /** Acho que você só vai precisar disto para formatar uma string para Date
   * @param date Pode ser do tipo date ou string.
   * @param type Aqui precisas colocar o tipo da data passada.
   * @example format(11/02/1999, 'DD/MM/YYYY')
   * @returns Moment Date Object.
   */
  static format(date: any, value?: string) {
    return moment(date).format(value);
  }

  static isValid(date: any, format: string): boolean {
    return moment(date, format, true).isValid();
  }

  static getMoment(date: any, format: string): moment.Moment {
    return moment(date, format);
  }
}
