import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor() {}

	public static async validatePlate(plate: string): Promise<string> {
    // se já tiver hifen e for portuguesa
    if (
      plate.match('-') &&
      plate.length == 8 &&
      (await this.isHasLetterAndNumber(plate))
    ) {
      return plate.toUpperCase();
      // Se portuguesa sem '-', add '-'
    } else if (plate.length == 6 && (await this.isHasLetterAndNumber(plate))) {
      plate =
        plate.substring(0, 2) +
        '-' +
        plate.substring(2, 2) +
        '-' +
        plate.substring(4, 5);
      return plate.toUpperCase();
    }
    return '';
  }

  private static isHasLetterAndNumber(str: string) {
    return !/^\d+$/.test(str) && !/^[a-zA-Z]+$/.test(str) ? true : false;
  }
}