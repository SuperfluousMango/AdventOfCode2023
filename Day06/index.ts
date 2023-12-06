import { getAllNumbers, getQuadraticRoots } from '../utils';
import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const races = splitInput(inputData);

    return races.map(({ time, distance }) => calcWinningRaceTimes(time, distance))
        .reduce((acc, val) => acc * val, 1);
}

function puzzleB() {
    const races = splitInput(inputData, true),
        { time, distance } = races[0];
        
    return calcWinningRaceTimes(time, distance);
}

function splitInput(data: string, removeSpaces = false): { time: number, distance: number }[] {
    const [timeRow, distanceRow] = data.split('\n'),
        times = removeSpaces ? getAllNumbers(timeRow.replace(/ /g, '')) : getAllNumbers(timeRow),
        distances = removeSpaces ? getAllNumbers(distanceRow.replace(/ /g, '')) : getAllNumbers(distanceRow);

    return times.map((time, idx) => ({ time, distance: distances[idx] }));
}

function calcWinningRaceTimes(time: number, recordDistance: number): number {
    // (-b +/- sqrt(b^2 - 4ac)) / 2a
    // x is the time holding the button down; b is the max race time; c is the record distance * -1
    // x * (time - x) > (record distance)
    // -x^2 + (time * x) - (record distance) > 0
    const a = -1,
        b = time,
        c = -recordDistance,
        [added, subtracted] = getQuadraticRoots(a, b, c);
    
    return Math.floor(subtracted) - Math.ceil(added) + 1;
}
