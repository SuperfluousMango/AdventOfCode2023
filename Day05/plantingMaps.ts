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
        const matchingRanges = inputRanges.flatMap(([start, end]) => this.splitRangeIntoRanges(start, end)),
            mappedValues = matchingRanges.map(([start, end]): [number, number] => ([ this.getMappedValue(start), this.getMappedValue(end) ]));

        console.log(`${this.name} ranges: ${mappedValues.flat().join(',')}`);
        
        return this.nextMap
            ? this.nextMap.getMinValueForRanges(mappedValues)
            : Math.min(...mappedValues.map(r => r[0])); // We're the bottom of the chain - no need to keep mapping, so only consider the lowest number in each output
    }

    private splitRangeIntoRanges(rangeStart: number, rangeEnd: number): [number, number][] {
        const ranges: [number, number][] = [];

        do {
            const map = this.maps.find(m => m.start <= rangeStart && m.end >= rangeStart);
            let start: number,
                end: number;
            
            if (map) {
                // Found an overlapping map range - store it
                start = rangeStart;
                end = Math.min(rangeEnd, map.end);
            } else {
                // Didn't find an overlapping map range - create a range for the unmapped values
                // Means we need to find the first range that starts higher than we are now
                // Good thing we're sorting our maps as we add them
                const nextMap = this.maps.find(m => m.start > rangeStart);
                start = rangeStart;
                end = nextMap ? nextMap.start - 1 : rangeEnd;
            }

            ranges.push([ start, end ]);
            rangeStart = end + 1;
        } while (rangeStart < rangeEnd)

        return ranges;
    }
}
