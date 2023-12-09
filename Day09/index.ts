import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    data.forEach(row => {
        const curRowPatterns = [row];

        do {
            const lastPattern = curRowPatterns[curRowPatterns.length - 1],
                newPattern = [];
            for (let i = 1; i < lastPattern.length; i++) {
                newPattern.push(lastPattern[i] - lastPattern[i - 1]);
            }
            curRowPatterns.push(newPattern);
        } while (!curRowPatterns[curRowPatterns.length - 1].every(x => x === 0));

        curRowPatterns.reverse()
            .forEach((pattern, idx) => {
                const newVal = idx === 0
                    ? 0
                    : pattern.slice(-1)[0] + curRowPatterns[idx - 1].slice(-1)[0];

                pattern.push(newVal);
            });
    });

    return data.reduce((acc, row) => acc + row[row.length - 1], 0);
}

function puzzleB() {
    const data = splitInput(inputData);

    data.forEach(row => {
        const curRowPatterns = [row];

        do {
            const lastPattern = curRowPatterns[curRowPatterns.length - 1],
                newPattern = [];
            for (let i = 1; i < lastPattern.length; i++) {
                newPattern.push(lastPattern[i] - lastPattern[i - 1]);
            }
            curRowPatterns.push(newPattern);
        } while (!curRowPatterns[curRowPatterns.length - 1].every(x => x === 0));

        curRowPatterns.reverse()
            .forEach((pattern, idx) => {
                const newVal = idx === 0
                    ? 0
                    : pattern[0] - curRowPatterns[idx - 1][0];

                pattern.unshift(newVal);
            });
    });

    return data.reduce((acc, row) => acc + row[0], 0);
}

function splitInput(data: string): number[][] {
    return data.split('\n')
        .map(line => line.split(' ').map(Number));
}
