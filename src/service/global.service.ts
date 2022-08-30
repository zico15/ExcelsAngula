import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public static validatePlate(plate: string): string {
    // se já tiver hifen e for portuguesa
    if (plate)
      if (
        plate.match('-') &&
        plate.length == 8 &&
        this.isHasLetterAndNumber(plate)
      ) {
        return plate.toUpperCase();
        // Se portuguesa sem '-', add '-'
      } else if (plate.length == 6 && this.isHasLetterAndNumber(plate)) {
        plate =
          plate.substr(0, 2) +
          '-' +
          plate.substr(2, 2) +
          '-' +
          plate.substr(4, 5);
        return plate.toUpperCase();
      }
    return '';
  }

  private static isHasLetterAndNumber(str: string) {
    return !/^\d+$/.test(str) && !/^[a-zA-Z]+$/.test(str) ? true : false;
  }
}
