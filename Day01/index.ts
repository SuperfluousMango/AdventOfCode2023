import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    return data.reduce((acc, val) => val + acc, 0);
}

function puzzleB() {
    const data = splitInput(inputData, true);

    return data.reduce((acc, val) => val + acc, 0);
}

function splitInput(data: string, mapLiteralNumbers = false): number[] {
    const origLines = data.split('\n');
    
    const lines = mapLiteralNumbers
        ? origLines.map(line => processLineForLiteralNumbers(line))
        : origLines.map(line => line.replace(/\D/g, ''));

    return lines.map(line => line.split(''))
        .map(digits => Number(digits[0]) * 10 + Number(digits.slice(-1)));
}

function processLineForLiteralNumbers(line: string): string {
    const oneLen = 'one'.length,
        twoLen = 'two'.length,
        threeLen = 'three'.length,
        fourFiveLen = 'four'.length, // Same length as 'five'
        sixLen = 'six'.length,
        sevenLen = 'seven'.length,
        eightLen = 'eight'.length,
        nineLen = 'nine'.length;

    const lineArr = line.split(''),
        outputArr: string[] = [];

    for (let i = 0; i < lineArr.length; i++) {
        switch (lineArr[i]) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                outputArr.push(lineArr[i]);
                break;
            case 'o':
                if (getLineChunk(lineArr, i, oneLen) === 'one') {
                    outputArr.push('1');
                }
                break;
            case 't':
                if (getLineChunk(lineArr, i, twoLen) === 'two') {
                    outputArr.push('2');
                } else if (getLineChunk(lineArr, i, threeLen) === 'three') {
                    outputArr.push('3');
                }
                break;
            case 'f':
                const chunk = getLineChunk(lineArr, i, fourFiveLen);
                if (chunk === 'four') {
                    outputArr.push('4');
                } else if (chunk === 'five') {
                    outputArr.push('5');
                }
                break;
            case 's':
                if (getLineChunk(lineArr, i, sixLen) === 'six') {
                    outputArr.push('6');
                } else if (getLineChunk(lineArr, i, sevenLen) === 'seven') {
                    outputArr.push('7');
                }
                break;
            case 'e':
                if (getLineChunk(lineArr, i, eightLen) === 'eight') {
                    outputArr.push('8');
                }
                break;
            case 'n':
                if (getLineChunk(lineArr, i, nineLen) === 'nine') {
                    outputArr.push('9');
                }
                break;
            default:
                break;
        }
    }

    return outputArr.join('');
}

function getLineChunk(lineArr: string[], start: number, len: number): string {
    return lineArr.slice(start, start + len).join('');
}
