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

  // /** Verificar se é data válida */
  // isValid(date: any): boolean {
  //   return moment(date, true).isValid();
  // }

  // // Ordenação por data de criação
  // async sortCreated(val: any) {
  //   let res = await val.sort((a: any, b: any) => {
  //     return moment(a.attributes.created).diff(b.attributes.created);
  //   });
  //   return res;
  // }

  // /** Can add many types like days or months.
  //  * @param date The date to some.
  //  * @param type minutes | hours | days | weeks | months | years.
  //  * @param qtd Amount of the value that will be added (default 1).
  //  * @returns New date added.
  //  */
  // addGlobal(
  //   date: Date,
  //   type: "minutes" | "hours" | "days" | "weeks" | "months" | "years",
  //   qtd?: number
  // ) {
  //   return moment(date)
  //     .add(qtd ? qtd : 1, type)
  //     .toDate();
  // }

  // /** Get end of date passed. The end will be defined by the type passed.
  //  * @param date
  //  * @param type "year" | "month" | "week" | "day" | "hour" | "minute" | "second"
  //  * @returns Moment object with the end of the date.
  //  */
  // getEnd(
  //   date: any,
  //   type: "year" | "month" | "week" | "day" | "hour" | "minute" | "second"
  // ) {
  //   return moment(date).endOf(type);
  // }
  // /** Get start of date passed. The start will be defined by the type passed.
  //  * @param date Date passed to get the start.
  //  * @param type "year" | "month" | "week" | "day" | "hour" | "minute" | "second"
  //  * @returns Moment object with the start of the date.ƒ
  //  */
  // getStart(
  //   date: any,
  //   type: "year" | "month" | "week" | "day" | "hour" | "minute" | "second"
  // ) {
  //   return moment(date).startOf(type);
  // }

  // hoursBetweenDays(dayInit: any, dayEnd: any) {
  //   var duration = moment.duration(moment(dayEnd).diff(moment(dayInit)));
  //   return duration.asHours();
  // }

  // // Usada para o gráfico em consulta diária
  // getHour(date: Date) {
  //   return parseInt(moment(date).format("H"));
  // }
}
