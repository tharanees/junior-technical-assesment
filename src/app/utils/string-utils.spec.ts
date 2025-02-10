import { sanitizeString, sanitizeProduct } from './string-utils';

describe('StringUtils', () => {
    describe('sanitizeString', () => {
        it('should trim leading and trailing whitespace', () => {
            expect(sanitizeString('  hello  ')).toBe('hello');
        });

        it('should return an empty string when given only whitespace', () => {
            expect(sanitizeString('   ')).toBe('');
        });
    });

    describe('sanitizeProduct', () => {
        it('should trim whitespace from all product fields', () => {
            const input = {
                name: '  Product  ',
                description: '  Some description  ',
                department: '  Dept  '
            };
            const sanitized = sanitizeProduct(input);
            expect(sanitized.name).toBe('Product');
            expect(sanitized.description).toBe('Some description');
            expect(sanitized.department).toBe('Dept');
        });
    });
});
