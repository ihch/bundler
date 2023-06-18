import { expect, test } from 'vitest';
import { getBasePath, getFileName } from './path.js';

test('getBasePath', () => {
    expect(getBasePath('main.js')).toBe('.');
});

test('getFileName', () => {
    expect(getFileName('.')).toBe('index.js');
    expect(getFileName('main')).toBe('main.js');
    expect(getFileName('main.js')).toBe('main.js');
});
