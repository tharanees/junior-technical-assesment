/**
 * Trims the given string.
 */
export function sanitizeString(input: string): string {
    return input.trim();
}

/**
 * Sanitizes all the fields of a product payload.
 */
export function sanitizeProduct<T extends { name: string; description: string; department: string }>(
    product: T
): T {
    return {
        ...product,
        name: sanitizeString(product.name),
        description: sanitizeString(product.description),
        department: sanitizeString(product.department),
    };
}
