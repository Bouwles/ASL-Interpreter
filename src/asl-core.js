(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ASLCore = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SIGN_HINTS = {
    '0': 'all fingers form O shape',
    '1': 'index points straight up',
    '2': 'index and middle spread',
    '3': 'thumb, index, and middle up',
    '4': 'four fingers up, palm forward',
    '5': 'all five spread, palm forward',
    '6': 'thumb and pinky touch',
    '7': 'thumb and ring touch',
    '8': 'thumb and middle touch',
    '9': 'index and thumb loop',
    YES: 'closed fist, palm forward',
    NO: 'index and middle together',
    GOOD: 'open hand, palm down',
    SORRY: 'closed fist, palm toward you',
    'THANK YOU': 'open hand moving forward',
    PLEASE: 'open hand, palm toward body',
    HELLO: 'open hand, palm forward',
    HELP: 'thumb up',
    STOP: 'open hand, palm sideways',
    WANT: 'open hand, palm up',
    MORE: 'fingertips pinched together',
    EAT: 'fingertips pinched to thumb',
    THINK: 'index up, palm sideways',
    KNOW: 'index and middle up',
    LIKE: 'thumb and middle pinch',
    NEED: 'index pointing downward',
    YOU: 'index pointing forward',
    WATER: 'three fingers shaped like W',
    MOTHER: 'open hand, palm sideways',
    FRIEND: 'hooked index fingers',
    'I LOVE YOU': 'pinky, index, and thumb out',
  };

  var NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var RESPONSES = ['YES', 'NO', 'GOOD', 'SORRY', 'THANK YOU', 'PLEASE', 'HELLO'];
  var ACTIONS = ['HELP', 'STOP', 'WANT', 'MORE', 'EAT', 'THINK', 'KNOW', 'LIKE', 'NEED', 'YOU'];
  var PEOPLE = ['WATER', 'MOTHER', 'FRIEND', 'I LOVE YOU'];
  var SUPPORTED_SIGNS = NUMBERS.concat(RESPONSES, ACTIONS, PEOPLE);

  var PHRASE_PATTERNS = [
    { signs: ['I LOVE YOU', 'MOTHER'], sentence: 'I love you, mother.', intent: 'AFFECTION' },
    { signs: ['FRIEND', 'WANT', 'WATER'], sentence: 'My friend wants water.', intent: 'REQUEST_WATER' },
    { signs: ['MOTHER', 'NEED', 'HELP'], sentence: 'My mother needs help.', intent: 'REQUEST_HELP' },
    { signs: ['YOU', 'WANT', 'WATER'], sentence: 'Do you want water?', intent: 'QUESTION' },
    { signs: ['WANT', 'WATER', 'PLEASE'], sentence: 'I want water, please.', intent: 'REQUEST_WATER' },
    { signs: ['WANT', 'EAT', 'PLEASE'], sentence: 'I want to eat, please.', intent: 'REQUEST_FOOD' },
    { signs: ['NEED', 'MORE', 'WATER'], sentence: 'I need more water.', intent: 'REQUEST_WATER' },
    { signs: ['YOU', 'WANT', 'HELP'], sentence: 'Do you need help?', intent: 'QUESTION' },
    { signs: ['MOTHER', 'HELP'], sentence: 'My mother needs help.', intent: 'REQUEST_HELP' },
    { signs: ['PLEASE', 'HELP'], sentence: 'Please help me.', intent: 'REQUEST_HELP' },
    { signs: ['HELP', 'PLEASE'], sentence: 'Please help me.', intent: 'REQUEST_HELP' },
    { signs: ['NEED', 'HELP'], sentence: 'I need help.', intent: 'REQUEST_HELP' },
    { signs: ['WANT', 'HELP'], sentence: 'I want help.', intent: 'REQUEST_HELP' },
    { signs: ['YOU', 'HELP'], sentence: 'Can you help me?', intent: 'REQUEST_HELP' },
    { signs: ['NO', 'WANT'], sentence: 'I do not want that.', intent: 'NEGATION' },
    { signs: ['NO', 'STOP'], sentence: 'Please do not stop.', intent: 'NEGATION' },
    { signs: ['PLEASE', 'STOP'], sentence: 'Please stop.', intent: 'GENERAL' },
    { signs: ['WANT', 'WATER'], sentence: 'I want water.', intent: 'REQUEST_WATER' },
    { signs: ['NEED', 'WATER'], sentence: 'I need water.', intent: 'REQUEST_WATER' },
    { signs: ['MORE', 'WATER'], sentence: 'I want more water.', intent: 'REQUEST_WATER' },
    { signs: ['LIKE', 'WATER'], sentence: 'I like water.', intent: 'GENERAL' },
    { signs: ['WANT', 'EAT'], sentence: 'I want to eat.', intent: 'REQUEST_FOOD' },
    { signs: ['NEED', 'EAT'], sentence: 'I need to eat.', intent: 'REQUEST_FOOD' },
    { signs: ['MORE', 'EAT'], sentence: 'I want more food.', intent: 'REQUEST_FOOD' },
    { signs: ['WANT', 'MORE'], sentence: 'I want more.', intent: 'WANT' },
    { signs: ['NEED', 'MORE'], sentence: 'I need more.', intent: 'NEED' },
    { signs: ['YOU', 'WANT'], sentence: 'Do you want something?', intent: 'QUESTION' },
    { signs: ['YOU', 'KNOW'], sentence: 'Do you know?', intent: 'QUESTION' },
    { signs: ['YOU', 'LIKE'], sentence: 'Do you like it?', intent: 'QUESTION' },
    { signs: ['FRIEND', 'HELP'], sentence: 'My friend needs help.', intent: 'REQUEST_HELP' },
    { signs: ['MOTHER', 'WANT'], sentence: 'My mother wants something.', intent: 'WANT' },
    { signs: ['THINK', 'GOOD'], sentence: 'I think that is good.', intent: 'AFFIRMATION' },
    { signs: ['I LOVE YOU'], sentence: 'I love you.', intent: 'AFFECTION' },
    { signs: ['THANK YOU'], sentence: 'Thank you.', intent: 'GRATITUDE' },
    { signs: ['YES'], sentence: 'Yes.', intent: 'AFFIRMATION' },
    { signs: ['NO'], sentence: 'No.', intent: 'NEGATION' },
    { signs: ['SORRY'], sentence: "I'm sorry.", intent: 'APOLOGY' },
    { signs: ['HELLO'], sentence: 'Hello!', intent: 'GREETING' },
    { signs: ['HELP'], sentence: 'I need help.', intent: 'REQUEST_HELP' },
    { signs: ['GOOD'], sentence: 'Good.', intent: 'AFFIRMATION' },
    { signs: ['MORE'], sentence: 'I want more.', intent: 'WANT' },
    { signs: ['STOP'], sentence: 'Please stop.', intent: 'GENERAL' },
    { signs: ['EAT'], sentence: 'I want to eat.', intent: 'REQUEST_FOOD' },
    { signs: ['KNOW'], sentence: 'I know.', intent: 'GENERAL' },
    { signs: ['THINK'], sentence: 'I think so.', intent: 'GENERAL' },
    { signs: ['LIKE'], sentence: 'I like it.', intent: 'GENERAL' },
    { signs: ['NEED'], sentence: 'I need something.', intent: 'NEED' },
    { signs: ['WANT'], sentence: 'I want something.', intent: 'WANT' },
    { signs: ['WATER'], sentence: 'Water, please.', intent: 'REQUEST_WATER' },
    { signs: ['PLEASE'], sentence: 'Please.', intent: 'GENERAL' },
    { signs: ['MOTHER'], sentence: 'My mother.', intent: 'GENERAL' },
    { signs: ['FRIEND'], sentence: 'My friend.', intent: 'GENERAL' },
    { signs: ['YOU'], sentence: 'You.', intent: 'GENERAL' },
  ];

  var INTENT_WEIGHTS = {
    REQUEST_HELP: { HELP: 3, PLEASE: 1, NEED: 1.5, MOTHER: 0.5, FRIEND: 0.5, YOU: 0.5 },
    REQUEST_WATER: { WATER: 3, WANT: 1, MORE: 0.5, NEED: 1, PLEASE: 0.5 },
    REQUEST_FOOD: { EAT: 3, WANT: 1, MORE: 0.5, NEED: 1, PLEASE: 0.5 },
    AFFIRMATION: { YES: 3, GOOD: 2, LIKE: 1, KNOW: 0.5 },
    NEGATION: { NO: 3, STOP: 1 },
    APOLOGY: { SORRY: 3 },
    GRATITUDE: { 'THANK YOU': 3 },
    GREETING: { HELLO: 3 },
    AFFECTION: { 'I LOVE YOU': 4, LIKE: 1, FRIEND: 0.5 },
    NEED: { NEED: 3, WANT: 0.5 },
    WANT: { WANT: 3, MORE: 1, LIKE: 0.5 },
    QUESTION: { YOU: 2, WANT: 0.5, KNOW: 0.5, LIKE: 0.5 },
  };

  function arraysMatch(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function isSubsequence(pattern, signs) {
    var pi = 0;
    for (var si = 0; si < signs.length && pi < pattern.length; si += 1) {
      if (signs[si] === pattern[pi]) pi += 1;
    }
    return pi === pattern.length;
  }

  function scoreIntent(signs) {
    var scores = {};
    var best = 'GENERAL';
    var top = 0;
    var total = 0;

    Object.keys(INTENT_WEIGHTS).forEach(function (intent) {
      scores[intent] = 0;
    });

    signs.forEach(function (sign) {
      Object.keys(INTENT_WEIGHTS).forEach(function (intent) {
        if (INTENT_WEIGHTS[intent][sign]) scores[intent] += INTENT_WEIGHTS[intent][sign];
      });
    });

    Object.keys(scores).forEach(function (intent) {
      total += scores[intent];
      if (scores[intent] > top) {
        top = scores[intent];
        best = intent;
      }
    });

    return { intent: best, confidence: total > 0 ? Math.min(1, (top / total) * 1.8) : 0 };
  }

  function formatSentence(text) {
    text = String(text || '').trim().replace(/\s+/g, ' ').replace(/\s([?.!])/g, '$1');
    if (!text) return '';
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if (!/[.!?]$/.test(text)) text += '.';
    return text;
  }

  function generateByGrammar(signs) {
    var sc = scoreIntent(signs);
    var idx = {};
    signs.forEach(function (s) { idx[s] = true; });

    var hasYou = !!idx.YOU;
    var hasWant = !!idx.WANT;
    var hasNeed = !!idx.NEED;
    var hasMother = !!idx.MOTHER;
    var hasFriend = !!idx.FRIEND;
    var hasPlease = !!idx.PLEASE;
    var hasNo = !!idx.NO;
    var hasLike = !!idx.LIKE;
    var hasKnow = !!idx.KNOW;
    var hasThink = !!idx.THINK;

    var objects = signs.filter(function (s) {
      return ['WATER', 'EAT', 'HELP', 'MORE', 'STOP'].indexOf(s) !== -1;
    }).map(function (s) {
      return s === 'EAT' ? 'food' : s.toLowerCase();
    });

    var subject = hasYou ? 'You' : (hasMother ? 'My mother' : (hasFriend ? 'My friend' : 'I'));
    var isThird = subject === 'My mother' || subject === 'My friend';
    var isQuestion = hasYou && (hasWant || hasNeed || hasLike || hasKnow);
    var sentence = '';

    if (isQuestion) {
      var qv = hasWant ? 'want' : (hasNeed ? 'need' : (hasLike ? 'like' : (hasKnow ? 'know' : 'want')));
      sentence = 'Do you ' + qv + (objects.length ? ' ' + objects.join(' and ') : '') + '?';
    } else {
      var neg = hasNo ? ' do not' : '';
      var verb = hasWant ? 'want' : (hasNeed ? 'need' : (hasLike ? 'like' : (hasKnow ? 'know' : (hasThink ? 'think' : null))));
      if (verb) {
        sentence = subject + neg + ' ' + (isThird ? verb + 's' : verb) + (objects.length ? ' ' + objects.join(' and ') : '') + (hasPlease ? ', please' : '') + '.';
      } else if (objects.length) {
        sentence = subject + (isThird ? ' needs' : ' need') + ' ' + objects.join(' and ') + (hasPlease ? ', please' : '') + '.';
      } else {
        sentence = signs.map(function (s) { return s.toLowerCase(); }).join(' ') + '.';
      }
    }

    return { sentence: formatSentence(sentence), intent: sc.intent, confidence: sc.confidence * 0.55 };
  }

  function normalizeSigns(signs) {
    return signs.map(function (sign) {
      return String(sign).trim().toUpperCase();
    }).filter(Boolean);
  }

  function interpretSignsToSentence(signs, customPhrases) {
    var normalized = normalizeSigns(signs || []);
    var sorted;
    var i;

    if (!normalized.length) return null;

    customPhrases = Array.isArray(customPhrases) ? customPhrases : [];
    for (i = 0; i < customPhrases.length; i += 1) {
      if (arraysMatch(customPhrases[i].signs, normalized)) {
        return { sentence: customPhrases[i].sentence, intent: 'CUSTOM', confidence: 1 };
      }
    }

    sorted = PHRASE_PATTERNS.slice().sort(function (a, b) { return b.signs.length - a.signs.length; });
    for (i = 0; i < sorted.length; i += 1) {
      if (arraysMatch(sorted[i].signs, normalized)) {
        return { sentence: sorted[i].sentence, intent: sorted[i].intent, confidence: 0.95 };
      }
    }
    for (i = 0; i < sorted.length; i += 1) {
      if (sorted[i].signs.length >= 2 && isSubsequence(sorted[i].signs, normalized)) {
        return { sentence: sorted[i].sentence, intent: sorted[i].intent, confidence: 0.72 };
      }
    }
    return generateByGrammar(normalized);
  }

  function isSupportedSign(sign) {
    return SUPPORTED_SIGNS.indexOf(String(sign || '').trim().toUpperCase()) !== -1;
  }

  function normalizeCustomPhrase(signsRaw, sentenceRaw) {
    var signs = normalizeSigns(String(signsRaw || '').split(/\s*,\s*/));
    var sentence = formatSentence(sentenceRaw);

    if (!signs.length) throw new Error('Enter at least one sign.');
    if (!sentence) throw new Error('Enter an output sentence.');

    signs.forEach(function (sign) {
      if (!isSupportedSign(sign)) throw new Error('Unsupported sign: ' + sign);
    });

    return { signs: signs, sentence: sentence };
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[char];
    });
  }

  return {
    SIGN_HINTS: SIGN_HINTS,
    NUMBERS: NUMBERS,
    RESPONSES: RESPONSES,
    ACTIONS: ACTIONS,
    PEOPLE: PEOPLE,
    SUPPORTED_SIGNS: SUPPORTED_SIGNS,
    PHRASE_PATTERNS: PHRASE_PATTERNS,
    INTENT_WEIGHTS: INTENT_WEIGHTS,
    arraysMatch: arraysMatch,
    isSubsequence: isSubsequence,
    scoreIntent: scoreIntent,
    formatSentence: formatSentence,
    generateByGrammar: generateByGrammar,
    interpretSignsToSentence: interpretSignsToSentence,
    normalizeCustomPhrase: normalizeCustomPhrase,
    isSupportedSign: isSupportedSign,
    escapeHTML: escapeHTML,
  };
}));
