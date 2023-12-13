import { Pos } from '../utils';
import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const [map, galaxyCoords] = splitInput(inputData, 2);

    return galaxyCoords.reduce((acc, {x, y}, idx) => {
        for (let i = idx + 1; i < galaxyCoords.length; i++) {
            const { x: gx, y: gy } = galaxyCoords[i],
                xStart = Math.min(x, gx),
                xEnd = Math.max(x, gx),
                yStart = Math.min(y, gy),
                yEnd = Math.max(y, gy);

            for (let curX = xStart + 1; curX <= xEnd; curX++) {
                acc += map.get(`${curX},${y}`);
            }

            for (let curY = yStart + 1; curY <= yEnd; curY++) {
                acc += map.get(`${gx},${curY}`);
            }
        }

        return acc;
    }, 0);
}

function puzzleB() {
    const [map, galaxyCoords] = splitInput(inputData, 1_000_000);

    return galaxyCoords.reduce((acc, {x, y}, idx) => {
        for (let i = idx + 1; i < galaxyCoords.length; i++) {
            const { x: gx, y: gy } = galaxyCoords[i],
                xStart = Math.min(x, gx),
                xEnd = Math.max(x, gx),
                yStart = Math.min(y, gy),
                yEnd = Math.max(y, gy);

            for (let curX = xStart + 1; curX <= xEnd; curX++) {
                acc += map.get(`${curX},${y}`);
            }

            for (let curY = yStart + 1; curY <= yEnd; curY++) {
                acc += map.get(`${gx},${curY}`);
            }
        }

        return acc;
    }, 0);
}

function splitInput(data: string, wideCellWeight: number): [Map<string, number>, Pos[]] {
    const splitData = data.split('\n')
            .map(line => line.split('')),
        width = splitData[0].length,
        height = splitData.length,
        emptyRows = new Set<number>(),
        emptyCols = new Set<number>(),
        map = new Map<string, number>(),
        galaxyCoords: Pos[] = [];

    // Find empty rows, because they weigh more
    for (let y = 0; y < height; y++) {
        if (splitData[y].every(n => n === '.')) {
            emptyRows.add(y);
        }
    }

    // Find empty columns, because they weigh more
    for (let x = 0; x < width; x++) {
        const col = splitData.map(line => line[x]);
        if (col.every(n => n === '.')) {
            emptyCols.add(x);
        }
    }

    // Populate map with weights and collect galaxy locations
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const key = `${x},${y}`,
                weight = emptyRows.has(y) || emptyCols.has(x)
                    ? wideCellWeight
                    : 1;
            map.set(key, weight);
            if (splitData[y][x] === '#') {
                galaxyCoords.push({ x, y });
            }
        }
    }

    return [map, galaxyCoords];
}
