import { inputData } from './data';
import { PlantingMaps } from './plantingMaps';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const { seeds, seedToSoil } = splitInput(inputData);

    return Math.min(
        ...seeds.map(s => seedToSoil.getFullyMappedValue(s))
    );
}

function puzzleB() {
    const { seeds, seedToSoil } = splitInput(inputData),
        seedRanges: [number, number][] = [];

    while (seeds.length) {
        const seedStart = seeds.shift(),
            seedEnd = seedStart + seeds.shift() - 1;
        seedRanges.push([seedStart, seedEnd]);
    }

    console.log(`seed ranges: ${seedRanges.flat().join(',')}`);
    return seedToSoil.getMinValueForRanges(seedRanges);
}

function splitInput(data: string): { seeds: number[], seedToSoil }  {
    const lines = data.split('\n');

    // Seeds
    const seeds = lines.shift().split(': ')[1].split(' ').map(Number);
    lines.shift(); // empty line

    // seed-to-soil
    lines.shift(); // header line
    const seedToSoil = buildMaps(lines, 'seed to soil');
    lines.shift(); // empty line

    // soil-to-fertilizer
    lines.shift(); // header line
    const soilToFertilizer = buildMaps(lines, 'soil to fertilizer');
    seedToSoil.setNextMap(soilToFertilizer);
    lines.shift(); // empty line

    // fertilizer-to-water
    lines.shift(); // header line
    const fertilizerToWater = buildMaps(lines, 'fertilizer to water');
    soilToFertilizer.setNextMap(fertilizerToWater);
    lines.shift(); // empty line

    // water-to-light
    lines.shift(); // header line
    const waterToLight = buildMaps(lines, 'water to light');
    fertilizerToWater.setNextMap(waterToLight);
    lines.shift(); // empty line

    // light-to-temperature
    lines.shift(); // header line
    const lightToTemperature = buildMaps(lines, 'light to temp');
    waterToLight.setNextMap(lightToTemperature);
    lines.shift(); // empty line

    // temperature-to-humidity
    lines.shift(); // header line
    const temperatureToHumidity = buildMaps(lines, 'temp to humidity');
    lightToTemperature.setNextMap(temperatureToHumidity);
    lines.shift(); // empty line

    // humidity-to-location
    lines.shift(); // header line
    const humidityToLocation = buildMaps(lines, 'humidity to location');
    temperatureToHumidity.setNextMap(humidityToLocation);
    lines.shift(); // empty line

    return {
        seeds,
        seedToSoil
    };
}

function buildMaps(lines: string[], name: string): PlantingMaps {
    const maps = new PlantingMaps(name);
    do {
        const line = lines.shift(),
            [destinationStart, sourceStart, rangeSize] = line.split(' ').map(Number),
            map = { start: sourceStart, end: sourceStart + rangeSize - 1, adjustment: destinationStart - sourceStart };
        maps.addMap(map);
    } while (lines[0] !== '');

    return maps;
}
