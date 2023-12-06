export function getAllNumbers(str: string): number[] {
    return Array.from(str.matchAll(/\d+/g))
        .map(m => m[0])
        .map(Number);
}

export function getQuadraticRoots(a, b, c): number[] {
    const sqrt = Math.sqrt(b ** 2 - (4 * a * c)),
        added = (-b + sqrt) / (2 * a),
        subtracted = (-b - sqrt) / (2 * a);

    return [added, subtracted];
}
