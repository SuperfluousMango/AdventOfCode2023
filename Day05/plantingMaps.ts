export interface PlantingMap {
    start: number;
    end: number;
    adjustment: number;
}

export class PlantingMaps {
    private maps: PlantingMap[] = [];
    private chainedMap: PlantingMaps = null;

    constructor(public name: string) { }

    addMap(map: PlantingMap): void {
        this.maps.push(map);
        this.maps.sort((a, b) => a.start - b.start); // Ensures our maps are always in order
    }

    setChainedMap(chainedMap: PlantingMaps): void {
        this.chainedMap = chainedMap;
    }

    private getMappedValue(val: number): number {
        const map = this.maps.find(m => m.start <= val && m.end >= val);
        return map
            ? val + map.adjustment
            : val;
    }

    getChainedValue(val: number): number {
        val = this.getMappedValue(val);
        return this.chainedMap
            ? this.chainedMap.getChainedValue(val)
            : val;
    }

    getMinValueForRange(rangeStart: number, rangeEnd: number): number {
        const ranges = this.splitRangeIntoRanges(rangeStart, rangeEnd);
        if (this.chainedMap) {
            return Math.min(
                ...ranges.map(r => {
                    // console.log(`${this.name}: ${r.start}-${r.end}`);
                    return this.chainedMap.getMinValueForRange(
                        this.getMappedValue(r.start),
                        this.getMappedValue(r.end)
                    );
                })
            );
        } else {
            return Math.min(
                ...ranges.map(r => r.start)
                    .map(v => {
                        const val = this.getMappedValue(v);
                        // console.log(`${this.name}: ${v} => ${val}`);
                        return val;
                    })
            );
        }
    }

    private splitRangeIntoRanges(rangeStart: number, rangeEnd: number): { start: number, end: number }[] {
        const ranges: { start: number, end: number }[] = [];

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

            ranges.push({ start, end });
            rangeStart = end + 1;
        } while (rangeStart < rangeEnd)

        return ranges;
    }
}
