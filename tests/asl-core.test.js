const test = require('node:test');
const assert = require('node:assert/strict');

const ASLCore = require('../src/asl-core.js');

test('formatSentence normalizes spacing and punctuation', () => {
  assert.equal(ASLCore.formatSentence('  do you want water ?  '), 'Do you want water?');
  assert.equal(ASLCore.formatSentence('thank you'), 'Thank you.');
});

test('interprets exact phrase patterns before grammar fallback', () => {
  const result = ASLCore.interpretSignsToSentence(['WANT', 'WATER', 'PLEASE']);

  assert.deepEqual(result, {
    sentence: 'I want water, please.',
    intent: 'REQUEST_WATER',
    confidence: 0.95,
  });
});

test('uses custom phrases ahead of built-in patterns', () => {
  const customPhrases = [
    { signs: ['WANT', 'WATER'], sentence: 'Custom water request.' },
  ];

  const result = ASLCore.interpretSignsToSentence(['WANT', 'WATER'], customPhrases);

  assert.deepEqual(result, {
    sentence: 'Custom water request.',
    intent: 'CUSTOM',
    confidence: 1,
  });
});

test('normalizes and validates custom phrase input', () => {
  const phrase = ASLCore.normalizeCustomPhrase(' want, water ', ' water please ');

  assert.deepEqual(phrase, {
    signs: ['WANT', 'WATER'],
    sentence: 'Water please.',
  });
});

test('rejects unsupported custom phrase signs', () => {
  assert.throws(
    () => ASLCore.normalizeCustomPhrase('WANT, BANANA', 'I want a banana'),
    /Unsupported sign: BANANA/,
  );
});
