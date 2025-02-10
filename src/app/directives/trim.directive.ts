import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appTrim]'
})
export class TrimDirective {
    constructor(private ngControl: NgControl) { }

    @HostListener('blur')
    onBlur(): void {
        const control = this.ngControl.control;
        if (control) {
            const currentValue = control.value;
            if (typeof currentValue === 'string') {
                const trimmed = currentValue.trim();
                if (trimmed !== currentValue) {
                    control.setValue(trimmed);
                }
            }
        }
    }
}
