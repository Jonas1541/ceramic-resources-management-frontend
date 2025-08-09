import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateResourceCategory',
  standalone: true
})
export class TranslateResourceCategoryPipe implements PipeTransform {

  private translations: { [key: string]: string } = {
    'ELECTRICITY': 'Eletricidade',
    'WATER': 'Água',
    'GAS': 'Gás',
    'RAW_MATERIAL': 'Matéria-prima',
    'SILICATE': 'Silicato',
    'COMPONENT': 'Componente',
    'RETAIL': 'Varejo'
  };

  transform(value: string): string {
    return this.translations[value] || value;
  }

}
