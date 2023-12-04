import { inputData } from './data';

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const cards = splitInput(inputData);

    return cards.reduce((acc, { winners, numbers }) => {
        const matches = numbers.filter(x => winners.has(x)).length;

        return matches > 0
            ? acc + 2 ** (matches - 1)
            : acc;
    }, 0);
}

function puzzleB() {
    const cards = splitInput(inputData),
        cardCopies = new Map<number, number>();

    cards.forEach(({ winners, numbers }, idx) => {
        const copiesOfThisCard = (cardCopies.get(idx) ?? 0) + 1,
            matches = numbers.filter(x => winners.has(x)).length,
            firstCopiedRow = idx + 1;

        for (let i = firstCopiedRow; i < firstCopiedRow + matches && i < cards.length; i++) {
            const copiesOfCardX = (cardCopies.get(i) ?? 0) + copiesOfThisCard;
            cardCopies.set(i, copiesOfCardX);
        }
    });

    // Count up all the copies we created, then add the number of original cards
    return Array.from(cardCopies.values())
        .reduce((acc, val) => acc + val, 0)
        + cards.length;
}

function splitInput(data: string): { winners: Set<number>, numbers: number[] }[] {
    return data.split('\n')
        .map(line => {
          const [winStr, numStr] = line.split(': ')[1].split(' | '),
            winners = new Set(winStr.split(' ').filter(x => x !== '').map(Number)),
            numbers = numStr.split(' ').filter(x => x !== '').map(Number);

            return { winners, numbers };
        });
}