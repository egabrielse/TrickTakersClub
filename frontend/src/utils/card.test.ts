import { expect, suite, test } from 'vitest';
import { compareCards, countCardPoints, getCardBack, getCardFace, hasCard, isTrumpCard, sortCards } from './card';
import { TEST_CARDS, TEST_FAIL_CARDS, TEST_TRUMP_CARDS } from '../constants/test';
import { CARD_RANK, CARD_SUIT } from '../constants/card';


test('getCardFace', () => {
    const card = { rank: CARD_RANK.ACE, suit: CARD_SUIT.CLUB };
    expect(getCardFace(card)).toBe('/cards/ace-club.svg');
});

test('getCardBack', () => {
    expect(getCardBack()).toBe('/cards/back-1.svg');
});

suite('isTrumpCard', () => {
    test('returns true for trump cards', () => {
        for (const card of TEST_TRUMP_CARDS) {
            expect(isTrumpCard(card)).toBe(true);
        }
    });

    test('returns false for non-trump cards', () => {
        for (const card of TEST_FAIL_CARDS) {
            expect(isTrumpCard(card)).toBe(false);
        }
    });
});

suite('countCardPoints', () => {
    test('returns 0 for empty hand', () => {
        expect(countCardPoints([])).toBe(0);
    });

    test('pointless hand', () => {
        expect(countCardPoints([
            { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.SPADE },
            { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.CLUB },
            { rank: CARD_RANK.NINE, suit: CARD_SUIT.DIAMOND },
            { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.HEART },
            { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.SPADE },
            { rank: CARD_RANK.NINE, suit: CARD_SUIT.DIAMOND },
        ])).toBe(0);
    });

    test('jacks are worth 2 points', () => {
        expect(countCardPoints([{ rank: CARD_RANK.JACK, suit: CARD_SUIT.CLUB }])).toBe(2);
    });

    test('queens are worth 3 points', () => {
        expect(countCardPoints([{ rank: CARD_RANK.QUEEN, suit: CARD_SUIT.CLUB }])).toBe(3);
    });

    test('kings are worth 4 points', () => {
        expect(countCardPoints([{ rank: CARD_RANK.KING, suit: CARD_SUIT.CLUB }])).toBe(4);
    });

    test('tens are worth 10 points', () => {
        expect(countCardPoints([{ rank: CARD_RANK.TEN, suit: CARD_SUIT.CLUB }])).toBe(10);
    });

    test('aces are worth 11 points', () => {
        expect(countCardPoints([{ rank: CARD_RANK.ACE, suit: CARD_SUIT.CLUB }])).toBe(11);
    });

    test('multiple cards 1', () => {
        expect(countCardPoints([
            { rank: CARD_RANK.JACK, suit: CARD_SUIT.CLUB }, // 2
            { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.DIAMOND }, // 0
            { rank: CARD_RANK.KING, suit: CARD_SUIT.HEART }, // 4
            { rank: CARD_RANK.TEN, suit: CARD_SUIT.SPADE }, // 10
            { rank: CARD_RANK.NINE, suit: CARD_SUIT.CLUB }, // 0
            { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.DIAMOND }, // 3
        ])).toBe(19);
    });

    test('multiple cards 2', () => {
        expect(countCardPoints([
            { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.DIAMOND }, // 0
            { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.DIAMOND }, // 3
            { rank: CARD_RANK.ACE, suit: CARD_SUIT.SPADE }, // 11
            { rank: CARD_RANK.NINE, suit: CARD_SUIT.CLUB }, // 0
            { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.HEART }, // 3
            { rank: CARD_RANK.JACK, suit: CARD_SUIT.CLUB }, // 2
        ])).toBe(19);
    });
});

suite('sortCards', () => {

    test('sorts cards by rank', () => {
        const randomlySorted = TEST_CARDS.slice().sort(() => Math.random() - 0.5);
        expect(randomlySorted.sort(sortCards)).toEqual(TEST_CARDS);
    });

    test('repeated cards', () => {
        const cards = [
            { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.CLUB },
            { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.DIAMOND },
            { rank: CARD_RANK.ACE, suit: CARD_SUIT.SPADE },
            { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.CLUB },
            { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.DIAMOND },
        ];

        expect(cards.sort(sortCards)).toEqual([
            { rank: CARD_RANK.ACE, suit: CARD_SUIT.SPADE },
            { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.CLUB },
            { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.CLUB },
            { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.DIAMOND },
            { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.DIAMOND },
        ]);
    });
});

suite('hasCard', () => {
    const hand = [
        { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.DIAMOND },
        { rank: CARD_RANK.TEN, suit: CARD_SUIT.HEART },
        { rank: CARD_RANK.JACK, suit: CARD_SUIT.SPADE },
        { rank: CARD_RANK.ACE, suit: CARD_SUIT.CLUB },
        { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.DIAMOND },
        { rank: CARD_RANK.KING, suit: CARD_SUIT.HEART },
        { rank: CARD_RANK.NINE, suit: CARD_SUIT.SPADE },
    ];

    test('hand does not contain card', () => {
        const card = { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.CLUB };
        expect(hasCard(hand, card)).toBe(false);
    });

    test('hand contains card', () => {
        const card = { rank: CARD_RANK.ACE, suit: CARD_SUIT.CLUB };
        expect(hasCard(hand, card)).toBe(true);
    });
});

suite('compareCards', () => {
    test('same suit', () => {
        const a = { rank: CARD_RANK.TEN, suit: CARD_SUIT.CLUB };
        const b = { rank: CARD_RANK.KING, suit: CARD_SUIT.CLUB };
        expect(compareCards(a, b, CARD_SUIT.CLUB)).toBeGreaterThan(0);
        expect(compareCards(b, a, CARD_SUIT.CLUB)).toBeLessThan(0);
    });

    test('different fail suits, one is leading', () => {
        const a = { rank: CARD_RANK.ACE, suit: CARD_SUIT.HEART };
        const b = { rank: CARD_RANK.KING, suit: CARD_SUIT.CLUB };
        expect(compareCards(a, b, CARD_SUIT.HEART)).toBeGreaterThan(0);
        expect(compareCards(b, a, CARD_SUIT.HEART)).toBeLessThan(0);
    });

    test('trump vs trump', () => {
        const a = { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.CLUB };
        const b = { rank: CARD_RANK.TEN, suit: CARD_SUIT.DIAMOND };
        expect(compareCards(a, b, CARD_SUIT.CLUB)).toBeGreaterThan(0);
        expect(compareCards(b, a, CARD_SUIT.CLUB)).toBeLessThan(0);
    });

    test('trump beats leading fail suit', () => {
        const a = { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.CLUB };
        const b = { rank: CARD_RANK.TEN, suit: CARD_SUIT.HEART };
        expect(compareCards(a, b, CARD_SUIT.HEART)).toBeGreaterThan(0);
        expect(compareCards(b, a, CARD_SUIT.HEART)).toBeLessThan(0);
    });
});