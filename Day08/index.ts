import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const [directions, map] = splitInput(inputData);

    let curNode = 'AAA',
        steps = 0,
        pos = 0;
    do {
        const dir = directions[pos],
            options = map.get(curNode);
        curNode = dir === 'L'
            ? options[0]
            : options[1];

        steps++;
        pos = pos === directions.length - 1
            ? 0
            : pos + 1;
    } while (curNode !== 'ZZZ');

    return steps;
}

function puzzleB() {
    const [directions, map] = splitInput(inputData);

    const zNodeKeys = Array.from(map.keys()).filter(k => k[2] === 'Z'),
        aNodeKeys = Array.from(map.keys()).filter(k => k[2] === 'A'),
        memo = new Map<string, string[]>();

    aNodeKeys.forEach(k => memo.set(k, []));

    Array.from(map.entries())
        .forEach(([key, dests]) => {
            dests.forEach(dest => {
                const arr = memo.get(dest) ?? [];
                arr.push(key);
                memo.set(dest, arr);
            });
        });

    const countToZNode = new Map<string, number>(),
        nodesToVisit = zNodeKeys;
    zNodeKeys.forEach(k => countToZNode.set(k, 0));
    do {
        const node = nodesToVisit.shift(),
            curSteps = countToZNode.get(node),
            waysToGetHere = memo.get(node);
        waysToGetHere.forEach(n => {
            if (!countToZNode.has(n)) {
                countToZNode.set(n, curSteps + 1);
                nodesToVisit.push(n);
            }
        });
    } while (nodesToVisit.length);

    // All of the distances from A to Z just happen to be prime. Also, the length of directions just happens to be prime. Multiply all of these to get a *very* large number.
    return aNodeKeys.map(k => BigInt(countToZNode.get(k)))
        .reduce((acc, val) => acc * val, BigInt(1))
        * BigInt(directions.length);
}

function splitInput(data: string): [string, Map<string, [string, string]>] {
    const lines = data.split('\n'),
        directions = lines.shift();
    lines.shift(); // empty line;

    const map = new Map<string, [string, string]>();
    lines.forEach(line => {
        line = line.replace(/[()]/g, '');
        const [name, dirs] = line.split(' = ');
        map.set(name, dirs.split(', ') as [string, string]);
    });

    return [directions, map];
}
