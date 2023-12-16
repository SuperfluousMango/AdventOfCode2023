import { Dirs, Pos, getNewPosFromDir } from '../utils';
import { inputData } from './data';

interface TravelStep {
    pos: Pos;
    dir: Dirs;
}

const NESWReflectDirs = {
    [Dirs.North]: Dirs.East,
    [Dirs.East]: Dirs.North,
    [Dirs.South]: Dirs.West,
    [Dirs.West]: Dirs.South,
}

const NWSEReflectDirs = {
    [Dirs.North]: Dirs.West,
    [Dirs.East]: Dirs.South,
    [Dirs.South]: Dirs.East,
    [Dirs.West]: Dirs.North,
};

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const grid = splitInput(inputData);

    return sendLightAcrossGrid(grid, { x: -1, y: 0 }, Dirs.East);
}

function puzzleB() {
    const grid = splitInput(inputData);
    let maxEnergizedTiles = Number.MIN_SAFE_INTEGER;

    for (let x = 0; x < grid[0].length; x++) {
        maxEnergizedTiles = Math.max(maxEnergizedTiles, sendLightAcrossGrid(grid, { x, y: -1 }, Dirs.South));
        maxEnergizedTiles = Math.max(maxEnergizedTiles, sendLightAcrossGrid(grid, { x, y: grid.length }, Dirs.North));
    }

    for (let y = 0; y < grid.length; y++) {
        maxEnergizedTiles = Math.max(maxEnergizedTiles, sendLightAcrossGrid(grid, { x: -1, y }, Dirs.East));
        maxEnergizedTiles = Math.max(maxEnergizedTiles, sendLightAcrossGrid(grid, { x: grid[0].length, y }, Dirs.West));
    }

    return maxEnergizedTiles;
}

function splitInput(data: string): string[][] {
    return data.split('\n')
        .map(line => line.split(''));
}

function sendLightAcrossGrid(grid: string[][], startPos: Pos, startDir: Dirs): number {
    const cache = new Set<string>(),
        energizedTiles = new Set<string>(),
        queue: TravelStep[] = [ { pos: startPos, dir: startDir} ],
        width = grid[0].length,
        height = grid.length;

    do {
        const curStep = queue.shift(),
            stepStr = `${curStep.pos.x},${curStep.pos.y},${curStep.dir}`;
        if (cache.has(stepStr)) {
            continue;
        }
        cache.add(stepStr);
        energizedTiles.add(`${curStep.pos.x},${curStep.pos.y}`);

        const nextPos = getNewPosFromDir(curStep.pos, curStep.dir);
        if (nextPos.x < 0 || nextPos.x >= width || nextPos.y < 0 || nextPos.y >= height) {
            continue;
        }

        const nextTile = grid[nextPos.y][nextPos.x];
        switch (nextTile) {
            case '.':
                queue.push({ pos: nextPos, dir: curStep.dir });
                break;
            case '/':
                queue.push({ pos: nextPos, dir: NESWReflectDirs[curStep.dir] });
                break;
            case '\\':
                queue.push({ pos: nextPos, dir: NWSEReflectDirs[curStep.dir] });
                break;
            case '|':
                if (curStep.dir === Dirs.North || curStep.dir === Dirs.South) {
                    queue.push({ pos: nextPos, dir: curStep.dir }); // Running the same direction as the splitter - no change
                } else {
                    // Running perpendicular to the splitter - split in both directions
                    queue.push({ pos: nextPos, dir: Dirs.North });
                    queue.push({ pos: nextPos, dir: Dirs.South });
                }
                break;
            case '-':
                if (curStep.dir === Dirs.East || curStep.dir === Dirs.West) {
                    queue.push({ pos: nextPos, dir: curStep.dir }); // Running the same direction as the splitter - no change
                } else {
                    // Running perpendicular to the splitter - split in both directions
                    queue.push({ pos: nextPos, dir: Dirs.East });
                    queue.push({ pos: nextPos, dir: Dirs.West });
                }
                break;
        }
    } while (queue.length);

    return energizedTiles.size - 1; // Minus one, because we start off the grid and that non-tile gets tracked
}
