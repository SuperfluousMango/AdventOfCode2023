import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const lines = splitInput(inputData),
        regex = /\d+/g;

    return lines.reduce((acc, line, lineNum) => {
        let result: RegExpExecArray;

        while (result = regex.exec(line)) {
            const index = result.index,
                length = result[0].length;

            if (isAdjacentToSymbol(lines, lineNum, index, index + length - 1)) {
                acc += Number(result[0]);
            }
        }

        return acc;
    }, 0);
}

function puzzleB() {
    const lines = splitInput(inputData),
        regex = /\*/g;

    return lines.reduce((acc, line, lineNum) => {
        let result: RegExpExecArray;

        while (result = regex.exec(line)) {
            acc += getGearValue(lines, lineNum, result.index);
        }

        return acc;
    }, 0);
}

function splitInput(data: string): string[] {
    return data.split('\n');
}

function isAdjacentToSymbol(lines: string[], lineNum: number, start: number, end: number): boolean {
    const symbolRegex = /[^\d.]/,
        startPos = Math.max(start - 1, 0),
        endPos = Math.min(end + 1, lines[0].length - 1);

    // Check the line above it, including characters before and after
    if (lineNum > 0) {
        if (symbolRegex.test(lines[lineNum - 1].slice(startPos, endPos + 1))) {
            return true;
        }
    }

    // Check the line below it, including characters before and after
    if (lineNum < lines.length - 1) {
        if (symbolRegex.test(lines[lineNum + 1].slice(startPos, endPos + 1))) {
            return true;
        }
    }

    // Check the characters before and after on the current line
    return symbolRegex.test(lines[lineNum][startPos]) || symbolRegex.test(lines[lineNum][endPos]);
}

function getGearValue(lines: string[], lineNum: number, gearPos: number): number {
    const numberRegex = /\d+/g,
        numbers: number[] = [];
    let result: RegExpExecArray;

    // Check the previous line, the current line, and the next line. Lines that do not exist will
    // be undefined, which the RegExp.prototype.exec handles just fine.
    const linesToCheck = [ lines[lineNum - 1], lines[lineNum], lines[lineNum + 1] ];
    linesToCheck.forEach(line => {
        while (result = numberRegex.exec(line)) {
            const start = result.index,
                end = start + result[0].length - 1;
            // This number counts if any of these are true:
            // * Gear pos is between start and end, inclusive
            // * Start pos is gear pos + 1
            // * End pos is gear pos - 1
            const gearIsBetween = gearPos >= start && gearPos <= end,
                gearIsBefore = start === gearPos + 1,
                gearIsAfter = end === gearPos - 1;
            if (gearIsBetween || gearIsBefore || gearIsAfter) {
                numbers.push(Number(result[0]));
            }
        }
    });

    return numbers.length === 2
        ? numbers[0] * numbers[1]
        : 0;
}
