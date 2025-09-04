
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') {
      return null;
    }
    const isInteger = Number.isInteger(Number(control.value));
    return isInteger ? null : { 'integer': true };
  };
}
