import { inputData } from './data';

const maxVals = {
    red: 12,
    green: 13,
    blue: 14
};

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const lines = splitInput(inputData);

    return lines.reduce((acc, line, idx) => {
        const allAreBelowMaxVals = line.every(group => {
            const [num, color] = group.split(' ');
            return num <= maxVals[color];
        });

        return allAreBelowMaxVals
            ? acc + idx + 1
            : acc;
    }, 0);
}

function puzzleB() {
    const lines = splitInput(inputData);

    return lines.reduce((acc, line) => {
        const map = new Map<string, number>();
        line.forEach(group => {
            const [num, color] = group.split(' '),
                curMax = map.get(color) ?? 0,
                newMax = Math.max(curMax, Number(num));
            map.set(color, newMax);
        });

        const power = (map.get('red') ?? 0) * (map.get('green') ?? 0) * (map.get('blue') ?? 0);
        return acc + power;
    }, 0);
}

function splitInput(data: string, mapLiteralNumbers = false): string[][] {
    return data.replace(/;/g, ',')
        .split('\n')
        .map(line => line.split(': ')[1])
        .map(line => line.split(', '));
}
