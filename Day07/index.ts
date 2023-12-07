import { inputData } from './data';

enum Hands {
    FIVE_OF_A_KIND = 1,
    FOUR_OF_A_KIND = 2,
    FULL_HOUSE = 3,
    THREE_OF_A_KIND = 4,
    TWO_PAIR = 5,
    ONE_PAIR = 6,
    HIGH_CARD = 7
};

console.log(`Puzzle A answer: ${puzzleA()}`);
console.log(`Puzzle B answer: ${puzzleB()}`);

function puzzleA() {
    const hands = splitInput(inputData)
        .sort((a, b) => sortHands(a[0], b[0]));

    return hands.reduce((acc, [_, bid], idx) => {
        return acc + bid * (hands.length - idx);
    }, 0);
}

function puzzleB() {
    const hands = splitInput(inputData)
        .sort((a, b) => sortHands(a[0], b[0], true));

    return hands.reduce((acc, [_, bid], idx) => {
        return acc + bid * (hands.length - idx);
    }, 0);
}

function splitInput(data: string, removeSpaces = false): [string, number][] {
    return data.split('\n')
        .map(line => line.split(' '))
        .map(([hand, bid]) => [hand, Number(bid)]);
}

function sortHands(a: string, b: string, countJokersAsWild = false): number {
    const sortedA = a.split('').sort().join(''),
        sortedB = b.split('').sort().join('');

    const aHandType = getHandType(sortedA, countJokersAsWild),
        bHandType = getHandType(sortedB, countJokersAsWild);
    
    return aHandType === bHandType
        ? compareSimilarHands(a, b, countJokersAsWild)
        : Math.sign(aHandType - bHandType);
}

function getHandType(hand: string, countJokersAsWild = false): Hands {
    const numJokers = hand.replace(/[^J]/g, '').length;

    switch (true) { // Absolutely this is an abuse of the switch statement
        case /(.)\1{4}/.test(hand):
            // Five of a kind
            return Hands.FIVE_OF_A_KIND;
        case /(.)\1{3}/.test(hand):
            // Four of a kind
            return countJokersAsWild && numJokers > 0
                ? Hands.FIVE_OF_A_KIND
                : Hands.FOUR_OF_A_KIND;
        case /(.)\1{2}(.)\2{1}/.test(hand) || /(.)\1{1}(.)\2{2}/.test(hand):
            // Full house (3 plus pair, or pair plus 3)
            return countJokersAsWild && numJokers > 0
                ? Hands.FIVE_OF_A_KIND // Either we have a pair and 3 jokers or three of a kind and 2 jokers - either way, it's five of a kind
                : Hands.FULL_HOUSE;
        case /(.)\1{2}/.test(hand):
            // Three of a kind, no pairs
            return countJokersAsWild && numJokers > 0
                ? Hands.FOUR_OF_A_KIND // Either three of a kind and 1 joker, or 3 jokers and no pairs - either way, it's four of a kind
                : Hands.THREE_OF_A_KIND;
        case /(.)\1{1}.?(.)\2{1}/.test(hand):
            // Two pairs
            if (countJokersAsWild && numJokers > 0) {
                return numJokers === 2
                    ? Hands.FOUR_OF_A_KIND // One pair plus 2 jokers
                    : Hands.FULL_HOUSE // Two pairs plus 1 joker
            } else {
                return Hands.TWO_PAIR
            }
        case /(.)\1{1}/.test(hand):
            // One pair
            return countJokersAsWild && numJokers > 0
                ? Hands.THREE_OF_A_KIND // Either one pair and 1 joker or 2 jokers and no other pairs - either way, it's three of a kind
                : Hands.ONE_PAIR;
        default:
            // High card - no pairs
            return countJokersAsWild && numJokers > 0
                ? Hands.ONE_PAIR // 1 joker, no other pairs - it's one pair
                : Hands.HIGH_CARD;
    }
}

function compareSimilarHands(a: string, b: string, countJokersAsWild = false): number {
    return compareCards(a[0], b[0], countJokersAsWild) ||
        compareCards(a[1], b[1], countJokersAsWild) ||
        compareCards(a[2], b[2], countJokersAsWild) ||
        compareCards(a[3], b[3], countJokersAsWild) ||
        compareCards(a[4], b[4], countJokersAsWild);
}

function compareCards(a: string, b: string, countJokersAsWild = false): number {
    const values = {
        A: 1,
        K: 2,
        Q: 3,
        J: 4,
        T: 5,
        '9': 6,
        '8': 7,
        '7': 8,
        '6': 9,
        '5': 10,
        '4': 11,
        '3': 12,
        '2': 13
    };

    if (countJokersAsWild) {
        values['J'] = Number.MAX_SAFE_INTEGER; // Wild cards have the lowest possible value
    }

    return Math.sign(values[a] - values[b]);
}
