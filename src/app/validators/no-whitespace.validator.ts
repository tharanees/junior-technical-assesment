import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator that checks if a string is not just whitespace.
 */
export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value != null && typeof control.value === 'string' && control.value.trim().length === 0) {
            return { whitespace: true };
        }
        return null;
    };
}