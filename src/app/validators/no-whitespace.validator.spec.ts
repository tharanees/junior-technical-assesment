import { FormControl } from '@angular/forms';
import { noWhitespaceValidator } from './no-whitespace.validator';

describe('noWhitespaceValidator', () => {
    const validatorFn = noWhitespaceValidator();

    it('should return an error object when the control value is only whitespace', () => {
        const control = new FormControl('   ');
        const result = validatorFn(control);
        expect(result).toEqual({ whitespace: true });
    });

    it('should return null when the control value contains non-whitespace characters', () => {
        const control = new FormControl(' hello ');
        const result = validatorFn(control);
        expect(result).toBeNull();
    });

    it('should return null when the control value is null', () => {
        const control = new FormControl(null);
        const result = validatorFn(control);
        expect(result).toBeNull();
    });
});
