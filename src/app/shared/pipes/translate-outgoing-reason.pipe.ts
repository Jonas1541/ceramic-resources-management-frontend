import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateOutgoingReason',
  standalone: true
})
export class TranslateOutgoingReasonPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'SOLD':
        return 'Vendido';
      case 'DEFECT_DISPOSAL':
        return 'Descartado';
      default:
        return value;
    }
  }

}