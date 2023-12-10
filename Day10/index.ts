import { Dirs, Pos, getNewPosFromDir } from '../utils';
import { inputData } from './data';

const mapCells = {
    NS: '│',
    EW: '─',
    NW: '┐',
    NE: '┌',
    SE: '└',
    SW: '┘',
    '|': '│',
    '-': '─',
    '7': '┐',
    'F': '┌',
    'L': '└',
    'J': '┘',
};

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const { map, startPos } = splitInput(inputData);

    let dir = Dirs.South,
        curPos = startPos,
        steps = 0;
    do {
        [curPos, dir] = processStep(map, curPos, dir);
        steps++;
    } while (!(curPos.x === startPos.x && curPos.y === startPos.y));

    return Math.ceil(steps / 2);
}

function puzzleB() {
    const { map, startPos } = splitInput(inputData),
        loopCells = new Set<string>()

    // Figure out which cells are in the loop
    let dir = Dirs.South,
        curPos = startPos;
    do {
        [curPos, dir] = processStep(map, curPos, dir);
        loopCells.add(`${curPos.x},${curPos.y}`);
    } while (!(curPos.x === startPos.x && curPos.y === startPos.y));

    // Erase all of the other cells
    map.forEach((row, y) => {
        row.forEach((_, x) => {
            if (!loopCells.has(`${x},${y}`)) {
                map[y][x] = ' ';
            }
        });
    });

    // Process the empty cells
    return map.reduce((acc, row) => {
        row.forEach((cell, x) => {
            if (cell === ' ') {
                let hasNW = false,
                    hasNE = false,
                    hasSE = false,
                    hasSW = false,
                    crossedPipes = 0;
                for (let i = x - 1; i >= 0; i--) {
                    switch (row[i]) {
                        case mapCells.NS:
                            crossedPipes++;
                            break;
                        case mapCells.NW:
                            if (hasNE) {
                                // Formed a U - doesn't count as anything
                                hasNW = false;
                                hasNE = false;
                                crossedPipes--;
                            } else if (hasSE) {
                                // Formed a zigzag - only counts as a single crossed pipe
                                hasNW = false;
                                hasSE = false;
                            } else {
                                hasNW = true;
                                crossedPipes++;
                            }
                            break;
                        case mapCells.NE:
                            if (hasNW) {
                                // Formed a U - doesn't count as anything
                                hasNE = false;
                                hasNW = false;
                                crossedPipes--;
                            } else if (hasSW) {
                                // Formed a zigzag - only counts as a single crossed pipe
                                hasNE = false;
                                hasSW = false;
                            } else {
                                hasNE = true;
                                crossedPipes++;
                            }
                            break;
                        case mapCells.SW:
                            if (hasSE) {
                                // Formed a U - doesn't count as anything
                                hasSW = false;
                                hasSE = false;
                                crossedPipes--;
                            } else if (hasNE) {
                                // Formed a zigzag - only counts as a single crossed pipe
                                hasSW = false;
                                hasNE = false;
                            } else {
                                hasSW = true;
                                crossedPipes++;
                            }
                            break;
                        case mapCells.SE:
                            if (hasSW) {
                                // Formed a U - doesn't count as anything
                                hasSE = false;
                                hasSW = false;
                                crossedPipes--;
                            } else if (hasNW) {
                                // Formed a zigzag - only counts as a single crossed pipe
                                hasSE = false;
                                hasNW = false;
                            } else {
                                hasSE = true;
                                crossedPipes++;
                            }
                            break;
                        default:
                            break; // Don't count horizontal pipes or other non-loop cells
                    }
                }

                if (crossedPipes % 2) {
                    acc++;
                }
            }
        });

        return acc;
    }, 0);
}

function splitInput(data: string): { map: string[][], startPos: Pos } {
    const map = data.split('\n')
        .map(line => {
            return line.split('')
                .map(cell => cell === 'S' ? cell : mapCells[cell]);
        });
    const y = map.findIndex(row => row.includes('S')),
        x = map[y].indexOf('S');

    map[y][x] = mapCells['7']; // Replace the starting position with the actual pipe shape (figured out manually)

    return { map, startPos: { x, y } };
}

function processStep(map: string[][], pos: Pos, dir: Dirs): [Pos, Dirs] {
    const newPos = getNewPosFromDir(pos, dir),
        newDir = getNewDir(dir, map[newPos.y][newPos.x]);
    
    return [newPos, newDir];
}

function getNewDir(incomingDir: Dirs, pathChar: string): Dirs {
    switch (pathChar) {
        case mapCells.NS:
            return incomingDir === Dirs.South ? Dirs.South : Dirs.North;
        case mapCells.EW:
            return incomingDir === Dirs.East ? Dirs.East : Dirs.West;
        case mapCells.NW:
            return incomingDir === Dirs.North ? Dirs.West : Dirs.South;
        case mapCells.NE:
            return incomingDir === Dirs.North ? Dirs.East : Dirs.South;
        case mapCells.SE:
            return incomingDir === Dirs.South ? Dirs.East : Dirs.North;
        case mapCells.SW:
            return incomingDir === Dirs.South ? Dirs.West : Dirs.North;
    }
}
