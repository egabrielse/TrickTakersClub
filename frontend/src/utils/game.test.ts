import { expect, suite, test } from 'vitest';
import { createNewScoreboard, getTakerId, isTrickDone } from './game';
import { TEST_COMPLETE_TRICK, TEST_INCOMPLETE_TRICK } from '../constants/test';
import { CARD_RANK, CARD_SUIT } from '../constants/card';

suite('createNewScoreboard', () => {
    test('creates a scoreboard with no players', () => {
        const scoreboard = createNewScoreboard();
        expect(scoreboard.handsPlayed).toBe(0);
        expect(Object.keys(scoreboard.rows).length).toBe(0);
    });

    test('creates a scoreboard with players', () => {
        const scoreboard = createNewScoreboard(['a', 'b', 'c']);
        expect(scoreboard.handsPlayed).toBe(0);
        expect(Object.keys(scoreboard.rows).length).toBe(3);
        expect(scoreboard.rows['a']).toEqual({ score: 0, handsWon: 0 });
        expect(scoreboard.rows['b']).toEqual({ score: 0, handsWon: 0 });
        expect(scoreboard.rows['c']).toEqual({ score: 0, handsWon: 0 });
    });
});

suite('isTrickDone', () => {
    test('trick is done', () => {
        expect(isTrickDone(TEST_COMPLETE_TRICK)).toBe(true);
    });

    test('trick is not done', () => {
        expect(isTrickDone(TEST_INCOMPLETE_TRICK)).toBe(false);
    });
});

suite('getTakerId', () => {
    test('trick is not done', () => {
        expect(getTakerId(TEST_INCOMPLETE_TRICK)).toBe('');
    });

    test('best leading suit card wins', () => {
        expect(getTakerId({
            turnOrder: ['a', 'b', 'c', 'd', 'e'],
            cards: {
                'a': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.KING },
                'b': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.NINE },
                'c': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.TEN },
                'd': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.ACE },
                'e': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.EIGHT },
            }
        })).toBe('d');
    });

    test('cards must follow suit to win', () => {
        // Player 'a' leads with a heart, but not other players have hearts. Player 'a' wins.
        expect(getTakerId({
            turnOrder: ['a', 'b', 'c', 'd', 'e'],
            cards: {
                'a': { suit: CARD_SUIT.HEART, rank: CARD_RANK.SEVEN },
                'b': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.NINE },
                'c': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.TEN },
                'd': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.ACE },
                'e': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.EIGHT },
            }
        })).toBe('a');
    });

    test('trump card takes the trick', () => {
        expect(getTakerId({
            turnOrder: ['a', 'b', 'c', 'd', 'e'],
            cards: {
                'a': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.ACE },
                'b': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.NINE },
                'c': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.TEN },
                'd': { suit: CARD_SUIT.DIAMOND, rank: CARD_RANK.NINE },
                'e': { suit: CARD_SUIT.CLUB, rank: CARD_RANK.QUEEN },
            }
        })).toBe('e');
    });
});
