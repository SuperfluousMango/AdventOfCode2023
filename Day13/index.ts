import { rotateArray } from '../utils';
import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const chunks = splitInput(inputData);

    return chunks.reduce((acc, chunk) => acc + findLineOfSymmetryValue(chunk), 0);
}

function puzzleB() {
    const chunks = splitInput(inputData);

    return chunks.reduce((acc, chunk) => acc + findAlmostLineOfSymmetryValue(chunk), 0);
}

function splitInput(data: string): string[][][] {
    return data.split('\n\n')
        .map(chunk => chunk.split('\n').map(line => line.split('')));
}

function findLineOfSymmetryValue(chunk: string[][]): number {
    return findLineOfSymmetry(chunk) * 100 ||
        findLineOfSymmetry(rotateArray(chunk));
}

function findLineOfSymmetry(chunk: string[][]): number {
    for (let i = 1; i < chunk.length; i++) {
        const numLinesToCheck = Math.min(i, chunk.length - i),
            topLines = chunk.slice(i - numLinesToCheck, i),
            bottomLines = chunk.slice(i, i + numLinesToCheck).reverse();

        let allRowsMatch = true;
        for (let j = 0; j < topLines.length; j++) {
            if (topLines[j].join('') !== bottomLines[j].join('')) {
                allRowsMatch = false;
                break;
            }
        }

        if (allRowsMatch) {
            return i;
        }
    }

    return 0;
}

function findAlmostLineOfSymmetryValue(chunk: string[][]): number {
    return findAlmostLineOfSymmetry(chunk) * 100 ||
        findAlmostLineOfSymmetry(rotateArray(chunk));
}

function findAlmostLineOfSymmetry(chunk: string[][]): number {
    for (let i = 1; i < chunk.length; i++) {
        const numLinesToCheck = Math.min(i, chunk.length - i),
            topLines = chunk.slice(i - numLinesToCheck, i),
            bottomLines = chunk.slice(i, i + numLinesToCheck).reverse();

        let totalMismatchedCells = 0;
        for (let j = 0; j < topLines.length; j++) {
            totalMismatchedCells += topLines[j].filter((val, idx) => val !== bottomLines[j][idx]).length;
        }

        if (totalMismatchedCells === 1) {
            return i;
        }
    }

    return 0;
}
