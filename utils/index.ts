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

export function getRangeOverlap(range1Start: number, range1End: number, range2Start: number, range2End: number): [number, number] | null {
    // An overlap between the two ranges exists if:
    //     - The start of range 1 lies between (inclusive) the start and end of range 2, OR
    //     - The start of range 2 lies between (inclusive) the start and end of range 1
    const overlapExists = (range1Start >= range2Start && range1Start <= range2End) ||
        (range2Start >= range1Start && range2Start <= range1End);

    return overlapExists
        ? [Math.max(range1Start, range2Start), Math.min(range1End, range2End)]
        : null;
}
