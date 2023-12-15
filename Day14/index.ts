import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const platform = splitInput(inputData);
    
    shiftRocksToNorth(platform);

    return platform.reduce((acc, val, idx) => {
        return acc + val.filter(x => x === 'O').length * (platform.length - idx);
    }, 0);
}

function puzzleB() {
    const platform = splitInput(inputData),
        cacheByStr = new Map<string, number>(),
        cacheByNum = new Map<number, string>();

    let cycleCnt = 0,
        matchingStr: string,
        matchingCycle: number;
    while(true) {
        cycleCnt++;
        shiftRocksToNorth(platform);
        shiftRocksToWest(platform);
        shiftRocksToSouth(platform);
        shiftRocksToEast(platform);

        const str = platform.map(line => line.join('')).join('\n');
        if (cacheByStr.has(str)) {
            matchingStr = str;
            matchingCycle = cacheByStr.get(str);
            break;
        }
        cacheByStr.set(str, cycleCnt);
        cacheByNum.set(cycleCnt, str);
    }

    const billionthCycleMatchNum = (1_000_000_000 - matchingCycle) % (cycleCnt - matchingCycle) + matchingCycle,
        matchingPlatformStr = cacheByNum.get(billionthCycleMatchNum),
        matchingPlatform = splitInput(matchingPlatformStr);

    return matchingPlatform.reduce((acc, val, idx) => {
        return acc + val.filter(x => x === 'O').length * (platform.length - idx);
    }, 0);
}

function splitInput(data: string): string[][] {
    return data.split('\n')
        .map(line => line.split(''));
}

function shiftRocksToNorth(platform: string[][]): void {
    let rocksWereShifted;

    do {
        rocksWereShifted = false;
        for (let i = 1; i < platform.length; i++) {
            platform[i].forEach((val, idx) => {
                if (val === 'O') {
                    if (platform[i - 1][idx] === '.') {
                        platform[i - 1][idx] = 'O';
                        platform[i][idx] = '.';
                        rocksWereShifted = true;
                    }
                }
            });
        }
    } while (rocksWereShifted);
}

function shiftRocksToWest(platform: string[][]): void {
    let rocksWereShifted;

    do {
        rocksWereShifted = false;
        for (let i = 1; i < platform[0].length; i++) {
            platform.forEach((row, idx) => {
                if (row[i] === 'O') {
                    if (platform[idx][i - 1] === '.') {
                        platform[idx][i - 1] = 'O';
                        platform[idx][i] = '.';
                        rocksWereShifted = true;
                    }
                }
            });
        }
    } while (rocksWereShifted);
}

function shiftRocksToSouth(platform: string[][]): void {
    let rocksWereShifted;

    do {
        rocksWereShifted = false;
        for (let i = platform.length - 2; i >= 0; i--) {
            platform[i].forEach((val, idx) => {
                if (val === 'O') {
                    if (platform[i + 1][idx] === '.') {
                        platform[i + 1][idx] = 'O';
                        platform[i][idx] = '.';
                        rocksWereShifted = true;
                    }
                }
            });
        }
    } while (rocksWereShifted);
}

function shiftRocksToEast(platform: string[][]): void {
    let rocksWereShifted;

    do {
        rocksWereShifted = false;
        for (let i = platform[0].length - 2; i >= 0; i--) {
            platform.forEach((row, idx) => {
                if (row[i] === 'O') {
                    if (platform[idx][i + 1] === '.') {
                        platform[idx][i + 1] = 'O';
                        platform[idx][i] = '.';
                        rocksWereShifted = true;
                    }
                }
            });
        }
    } while (rocksWereShifted);
}
