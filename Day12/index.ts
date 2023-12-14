import { memoize } from '../utils';
import { inputData } from './data';

let processFn = memoize(processSpringRow);

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const data = splitInput(inputData);

    return data.reduce((acc, [layout, specs]) => acc + processFn(layout, specs), 0);
}

function puzzleB() {
    const data = splitInput(inputData)
        .map(([layout, specs]) => [
                [layout, layout, layout, layout, layout].join('?'),
                [specs, specs, specs, specs, specs].flat()
            ] as [string, number[]]
        );

    return data.reduce((acc, [layout, specs]) => acc + processFn(layout, specs), 0);
}

function splitInput(data: string): [string, number[]][] {
    return data.split('\n')
        .map(line => {
            const [springs, specs] = line.split(' ');
            return [springs, specs.split(',').map(Number)];
        });
}

function processSpringRow(layout: string, specs: number[]): number {
    if (layout.length < specs.reduce((acc, val) => acc + val, 0) + specs.length - 1) {
        // Not enough springs to fulfill our specs - this was a bad path
        // Add (specs.length - 1) because there has to be a broken spring after
        // each run but the last
        return 0;
    }
    
    if (specs.length === 0) {
        return layout.includes('#')
        ? 0 // We have no more specs to meet, but there are still working springs - this was a bad path
        : 1; // We have no more specs to meet, and everything left can be a broken spring - this was a good path
    }
    
    switch (layout[0]) {
        case '.':
            // Hard-coded broken spring; can't affect our specs, so drop it and continue
            return processSpringRow(layout.slice(1, layout.length), specs);
            break;
        case '#':
            // Hard-coded working spring; if it doesn't match our current spec, it's a fail
            // If it does match our current spec, drop the whole batch of working springs and the
            // following broken spring, along with the current spec, and continue
            const potentialRun = layout.substring(0, specs[0]);
            if (potentialRun.includes('.')) {
                // Didn't have enough working or unknown springs to fill out the run - this won't work
                return 0;
            } else if (layout.length > specs[0] && layout[specs[0]] === '#') {
                // Had too many working springs in a row for this run - this won't work
                return 0;
            } else {
                // Had the right amount working or unknown springs in a row, followed by a broken or
                // unknown spring - chop off this bit and keep going
                return processSpringRow(layout.slice(specs[0] + 1), specs.slice(1));
            }
            break;
        case '?':
            // Unknown ones are tricky - they could be either working or broken, so we have to try both
            const workingVersion = '#' + layout.slice(1),
                brokenVersion = '.' + layout.slice(1);
            return processSpringRow(workingVersion, specs) + processSpringRow(brokenVersion, specs);
            break;
    }
}
