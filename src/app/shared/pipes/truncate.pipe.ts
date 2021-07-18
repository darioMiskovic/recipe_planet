import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, length: number, showAll: boolean = false, suffix: string = '...'): string {

    if (showAll) {
      return value;
    }

    if ( value.split("").length > length ) {

      return value.split("").splice(0, length).join("") + suffix;
    }
    return value;
  }

}
