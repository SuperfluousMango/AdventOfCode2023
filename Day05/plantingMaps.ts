import { getRangeOverlap } from '../utils';

export interface PlantingMap {
    start: number;
    end: number;
    adjustment: number;
}

export class PlantingMaps {
    private maps: PlantingMap[] = [];
    private nextMap: PlantingMaps = null;

    constructor(public name: string) { }

    addMap(map: PlantingMap): void {
        this.maps.push(map);
        this.maps.sort((a, b) => a.start - b.start); // Ensures our maps are always in order
    }

    setNextMap(chainedMap: PlantingMaps): void {
        this.nextMap = chainedMap;
    }

    private getMappedValue(val: number): number {
        const map = this.maps.find(m => m.start <= val && m.end >= val);
        return map
            ? val + map.adjustment
            : val;
    }

    getFullyMappedValue(val: number): number {
        val = this.getMappedValue(val);
        return this.nextMap
            ? this.nextMap.getFullyMappedValue(val)
            : val;
    }

    getMinValueForRanges(inputRanges: [number, number][]): number {
        const mappedRanges = inputRanges
            .flatMap(([start, end]) => this.splitRangeIntoMappedRanges(start, end))
            .map(([start, end]) => [this.getMappedValue(start), this.getMappedValue(end)] as [number, number]);
        
        return this.nextMap
            ? this.nextMap.getMinValueForRanges(mappedRanges)
            : Math.min(...mappedRanges.map(r => r[0])); // We're the bottom of the chain - no need to keep mapping, so only consider the lowest number in each output
    }

    private splitRangeIntoMappedRanges(rangeStart: number, rangeEnd: number): [number, number][] {
        const queue: [number, number][] = [[rangeStart, rangeEnd]],
            outputRanges: [number, number][] = [];

        do {
            const [start, end] = queue.shift();
            let foundOverlap = false;

            for (let m = 0; m < this.maps.length; m++) {
                const overlap = getRangeOverlap(start, end, this.maps[m].start, this.maps[m].end);
                if (overlap) {
                    // Add the overlapping bit to the output and stuff any dangling edges back in the queue
                    outputRanges.push([overlap[0], overlap[1]]);
                    foundOverlap = true;

                    if (start < overlap[0]) {
                        queue.push([start, overlap[0] - 1]);
                    }
                    if (end > overlap[1]) {
                        queue.push([overlap[1] + 1, end]);
                    }

                    // We know no more maps can overlap the overlapped piece of the range, and any leftover edges were put back in the queue
                    break;
                }
            }

            if (!foundOverlap) {
                // Didn't find any matches, so the range goes through untouched
                outputRanges.push([start, end]);
            }
        } while (queue.length);

        return outputRanges;
    }
}
