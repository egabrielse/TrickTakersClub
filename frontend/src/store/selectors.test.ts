import { expect, suite, test } from "vitest"
import { callableAces, cardsInHandCounts, isHost, isPartner, isPicker, isPresent, isUpNext, seatingStartingWithUser, tallyCompletedTricks } from "./selectors";
import { CARD_RANK, CARD_SUIT } from "../constants/card";
import { Trick } from "../types/game";
import { HAND_PHASE } from "../constants/game";

test('isPicker', () => {
    expect(isPicker('1', '1')).toBe(true);
    expect(isPicker('1', '2')).toBe(false);
});

suite('isPartner', () => {
    test('partner ids do not match', () => {
        expect(isPartner('1', '2', null, [])).toBe(false);
    });

    test('partner id matches', () => {
        expect(isPartner('1', '1', null, [])).toBe(true);
    });

    test('called card held', () => {
        const calledCard = { suit: CARD_SUIT.CLUB, rank: CARD_RANK.ACE };
        const hand = [
            { suit: CARD_SUIT.HEART, rank: CARD_RANK.KING },
            { suit: CARD_SUIT.CLUB, rank: CARD_RANK.ACE },
            { suit: CARD_SUIT.SPADE, rank: CARD_RANK.QUEEN },
        ]
        expect(isPartner('1', '', calledCard, hand)).toBe(true);
    });
});

test('isUpNext', () => {
    expect(isUpNext('1', '1')).toBe(true);
    expect(isUpNext('1', '2')).toBe(false);
});

test('isHost', () => {
    expect(isHost('1', '1')).toBe(true);
    expect(isHost('1', '2')).toBe(false);
});

test('isPresent', () => {
    const presence = ['1', '2', '3', '4'];
    expect(isPresent(presence, '1')).toBe(true);
    expect(isPresent(presence, '5')).toBe(false);
});

suite('callableAces', () => {
    test('must hold matching fail-suit in hand', () => {
        const hand = [
            { suit: CARD_SUIT.HEART, rank: CARD_RANK.KING },
        ];
        const bury = [
            // fail suit for club is in the bury (cannot call clubs as a result)
            { suit: CARD_SUIT.CLUB, rank: CARD_RANK.EIGHT },
        ];
        const result = callableAces(hand, bury);
        expect(result).toEqual({
            [CARD_SUIT.CLUB]: false,
            [CARD_SUIT.HEART]: true,
            [CARD_SUIT.SPADE]: false,
        });
    });

    test('cannot call a held ace', () => {
        const hand = [
            // Cannot call an ace that is held
            { suit: CARD_SUIT.HEART, rank: CARD_RANK.ACE },
            // Should be able to call spades (not held, not in bury, and has a matching fail suit)
            { suit: CARD_SUIT.SPADE, rank: CARD_RANK.KING },
        ];
        const bury = [
            // Cannot call an ace that is buried
            { suit: CARD_SUIT.CLUB, rank: CARD_RANK.ACE },
        ];
        const result = callableAces(hand, bury);
        expect(result).toEqual({
            [CARD_SUIT.CLUB]: false,
            [CARD_SUIT.HEART]: false,
            [CARD_SUIT.SPADE]: true,
        });
    });

    test('trump with matching suit does not count', () => {
        const hand = [
            { suit: CARD_SUIT.HEART, rank: CARD_RANK.QUEEN },
            { suit: CARD_SUIT.SPADE, rank: CARD_RANK.JACK },
        ];
        const bury = [
            { suit: CARD_SUIT.CLUB, rank: CARD_RANK.JACK },
        ];
        const result = callableAces(hand, bury);
        expect(result).toEqual({
            [CARD_SUIT.CLUB]: false,
            [CARD_SUIT.HEART]: false,
            [CARD_SUIT.SPADE]: false,
        });
    });
});

suite('seatingStartingWithUser', () => {
    test('returns correct order', () => {
        const seating = ['1', '2', '3', '4', '5'];
        const uid = '3';
        const result = seatingStartingWithUser(seating, uid);
        expect(result).toEqual(['3', '4', '5', '1', '2']);
    });

    test('uid not in player order', () => {
        const seating = ['1', '2', '3', '4', '5'];
        const uid = '6';
        const result = seatingStartingWithUser(seating, uid);
        expect(result).toEqual(['1', '2', '3', '4', '5']);
    });
});

suite('tallyCompletedTricks', () => {
    test('returns correct tally', () => {
        const seating = ['1', '2', '3'];
        const completedTricks: Trick[] = [
            {
                turnOrder: ['1', '2', '3'],
                cards: {
                    // Taker is 3, points are 21
                    '1': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.NINE },
                    '2': { suit: CARD_SUIT.DIAMOND, rank: CARD_RANK.TEN },
                    '3': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.ACE },
                },
            },
            {
                turnOrder: ['2', '3', '2'],
                cards: {
                    // Taker is 3, points are 5
                    '2': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.JACK },
                    '3': { suit: CARD_SUIT.DIAMOND, rank: CARD_RANK.QUEEN },
                    '1': { suit: CARD_SUIT.DIAMOND, rank: CARD_RANK.EIGHT },
                },
            },
            {
                turnOrder: ['3', '1', '2'],
                cards: {
                    // Taker is 2, points are 25
                    '3': { suit: CARD_SUIT.HEART, rank: CARD_RANK.KING },
                    '1': { suit: CARD_SUIT.HEART, rank: CARD_RANK.TEN },
                    '2': { suit: CARD_SUIT.HEART, rank: CARD_RANK.ACE },
                },
            },
        ];
        const result = tallyCompletedTricks(seating, completedTricks);
        expect(result).toEqual({
            1: [0, 0],
            2: [2, 46],
            3: [1, 5],
        });
    });

    test('ignores unfinished tricks', () => {
        const seating = ['1', '2', '3'];
        const completedTricks: Trick[] = [
            {
                turnOrder: ['1', '2', '3'],
                cards: {
                    // Taker is 3, points are 21
                    '1': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.NINE },
                    '2': { suit: CARD_SUIT.DIAMOND, rank: CARD_RANK.TEN },
                    '3': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.ACE },
                },
            },
            {
                turnOrder: ['2', '3', '2'],
                cards: {
                    // Second trick is not finished, so it should not be tallied
                    '2': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.JACK },
                    '3': { suit: CARD_SUIT.DIAMOND, rank: CARD_RANK.QUEEN },
                },
            },
        ];
        const result = tallyCompletedTricks(seating, completedTricks);
        expect(result).toEqual({
            1: [0, 0],
            2: [1, 21],
            3: [0, 0],
        });
    });
});

suite('cardsInHandCounts', () => {
    const seating = ['1', '2', '3'];
    test('all players start with 6 cards', () => {
        const currentTrick = { turnOrder: ['1', '2', '3'], cards: {} };
        expect(cardsInHandCounts(seating, 0, currentTrick, HAND_PHASE.PICK, "")).toEqual({
            '1': 6,
            '2': 6,
            '3': 6,
        });
    });

    test('picker has 8 cards during bury phase', () => {
        const currentTrick = { turnOrder: ['1', '2', '3'], cards: {} };
        // During bury phase, picker has 2 extra cards (the picked blind) in their hand.
        expect(cardsInHandCounts(seating, 0, currentTrick, HAND_PHASE.BURY, "2")).toEqual({
            '1': 6,
            '2': 8,
            '3': 6,
        });
        // Bury phase is over --> back to 6 cards.
        expect(cardsInHandCounts(seating, 0, currentTrick, HAND_PHASE.PLAY, "2")).toEqual({
            '1': 6,
            '2': 6,
            '3': 6,
        });
    });

    test('subtract cards played in completed tricks', () => {
        const currentTrick = { turnOrder: ['1', '2', '3'], cards: {} };
        expect(cardsInHandCounts(seating, 1, currentTrick, HAND_PHASE.PLAY, "")).toEqual({
            '1': 5,
            '2': 5,
            '3': 5,
        });

        expect(cardsInHandCounts(seating, 2, currentTrick, HAND_PHASE.PLAY, "")).toEqual({
            '1': 4,
            '2': 4,
            '3': 4,
        });

        expect(cardsInHandCounts(seating, 4, currentTrick, HAND_PHASE.PLAY, "")).toEqual({
            '1': 2,
            '2': 2,
            '3': 2,
        });
    });

    test('subtract for cards played in current trick', () => {
        const currentTrick = {
            turnOrder: ['1', '2', '3'], cards: {
                '1': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.NINE },
                '2': { suit: CARD_SUIT.DIAMOND, rank: CARD_RANK.TEN },
            }
        };
        expect(cardsInHandCounts(seating, 1, currentTrick, HAND_PHASE.PLAY, "")).toEqual({
            '1': 4,
            '2': 4,
            '3': 5,
        });
    });
});