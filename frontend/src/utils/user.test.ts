import { expect, test } from 'vitest';
import { getInitials } from './user';


test('getInitials', () => {
    expect(getInitials('John Doe')).toBe('JD');
    expect(getInitials('Mr John Doe')).toBe('MJD');
    expect(getInitials('john doe')).toBe('JD');
});