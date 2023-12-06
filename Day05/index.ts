import { inputData } from './data';

interface PlantingMap {
    start: number;
    end: number;
    adjustment: number;
}

class PlantingMaps {
    private maps: PlantingMap[] = [];
    private chainedMap: PlantingMaps = null;

    addMap(map: PlantingMap): void {
        this.maps.push(map);
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
}

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const { seeds, seedToSoil } = splitInput(inputData);

    return Math.min(
        ...seeds.map(s => seedToSoil.getChainedValue(s))
    );
}

function puzzleB() {
    const { seeds: specialSeedList, seedToSoil } = splitInput(inputData);
    let min = Number.MAX_SAFE_INTEGER;

    do {
        const seedStart = specialSeedList.shift(),
            seedRange = specialSeedList.shift();

        for (let i = 0; i < seedRange; i++) {
            min = Math.min(seedToSoil.getChainedValue(seedStart + i), min);
        }
    } while (specialSeedList.length);

    return min;
}

function splitInput(data: string): { seeds: number[], seedToSoil }  {
    const lines = data.split('\n');

    // Seeds
    const seeds = lines.shift().split(': ')[1].split(' ').map(Number);
    lines.shift(); // empty line

    // seed-to-soil
    lines.shift(); // header line
    const seedToSoil = buildMaps(lines);
    lines.shift(); // empty line

    // soil-to-fertilizer
    lines.shift(); // header line
    const soilToFertilizer = buildMaps(lines);
    seedToSoil.setChainedMap(soilToFertilizer);
    lines.shift(); // empty line

    // fertilizer-to-water
    lines.shift(); // header line
    const fertilizerToWater = buildMaps(lines);
    soilToFertilizer.setChainedMap(fertilizerToWater);
    lines.shift(); // empty line

    // water-to-light
    lines.shift(); // header line
    const waterToLight = buildMaps(lines);
    fertilizerToWater.setChainedMap(waterToLight);
    lines.shift(); // empty line

    // light-to-temperature
    lines.shift(); // header line
    const lightToTemperature = buildMaps(lines);
    waterToLight.setChainedMap(lightToTemperature);
    lines.shift(); // empty line

    // temperature-to-humidity
    lines.shift(); // header line
    const temperatureToHumidity = buildMaps(lines);
    lightToTemperature.setChainedMap(temperatureToHumidity);
    lines.shift(); // empty line

    // humidity-to-location
    lines.shift(); // header line
    const humidityToLocation = buildMaps(lines);
    temperatureToHumidity.setChainedMap(humidityToLocation);
    lines.shift(); // empty line

    return {
        seeds,
        seedToSoil
    };
}

function buildMaps(lines: string[]): PlantingMaps {
    const maps = new PlantingMaps
    do {
        const line = lines.shift(),
            [destinationStart, sourceStart, rangeSize] = line.split(' ').map(Number),
            map = { start: sourceStart, end: sourceStart + rangeSize - 1, adjustment: destinationStart - sourceStart };
        maps.addMap(map);
    } while (lines[0] !== '');

    return maps;
}