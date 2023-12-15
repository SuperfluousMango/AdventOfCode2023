import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const steps = splitInput(inputData);

    return steps.reduce((acc, val) => acc + HASHFunction(val), 0);
}

function puzzleB() {
    const steps = splitInput(inputData),
        boxes = new Map<number, string[]>();

    for (let i = 0; i < 256; i++) {
        boxes.set(i, []);
    }

    steps.forEach(step => {
        const label = step.match(/([a-z]+)/)[0],
            op = step.match(/([-=])/)[0],
            boxNum = HASHFunction(label),
            box = boxes.get(boxNum),
            idx = box.findIndex(lens => lens.startsWith(label));
        
        if (op === '-') {
            // Remove the lens
            if (idx > -1) {
                box.splice(idx, 1);
            }
        } else {
            // Add/replace the lens
            const focalLength = step.match(/(\d+)/)[0],
                lens = `${label} ${focalLength}`;
            if (idx > -1) {
                box[idx] = lens;
            } else {
                box.push(lens);
            }
        }
    });

    return Array.from(boxes.entries())
        .reduce((acc, [boxNum, lenses]) => {
            return acc += lenses.reduce((acc, lens, idx) => {
                return acc + (boxNum + 1) * (idx + 1) * Number(lens.split(' ')[1]);
            }, 0);
        }, 0);
}

function splitInput(data: string): string[] {
    return data.split(',');
}

function HASHFunction(str: string): number {
    let val = 0;

    for (let i = 0; i < str.length; i++) {
        val += str.charCodeAt(i);
        val *= 17;
        val = val % 256;
    }

    return val;
}
