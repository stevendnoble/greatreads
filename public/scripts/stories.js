var partsOfSpeech = {
  CD: {
    definition: 'Counting number',
    examples: 'one,two'
  },
  IN: {
    definition: 'Preposition',
    examples: 'of,in,by'
  },
  JJ: {
    definition: 'Adjective',
    examples: 'big'
  },
  JJR: {
    definition: 'Adjective with -er',
    examples: 'bigger'
  },
  JJS: {
    definition: 'Adjective with -est',
    examples: 'biggest'
  },
  NN: {
    definition: 'Noun',
    examples: 'dog'
  },
  NNP: {
    definition: 'Proper noun',
    examples: 'Edinburgh'
  },
  NNPS: {
    definition: 'Proper noun (plural)',
    examples: 'Smiths'
  },
  NNS: {
    definition: 'Plural noun',
    examples: 'dogs'
  },
  PP$: {
    definition: 'Possessive pronoun',
    examples: "my,one's"
  },
  PRP: {
    definition: 'Pronoun',
    examples: 'I, you, she'
  },
  RB: {
    definition: 'Adverb',
    examples: 'quickly'
  },
  RBR: {
    definition: 'Adverb with -er',
    examples: 'faster'
  },
  RBS: {
    definition: 'Adverb with -est',
    examples: 'fastest'
  },
  UH: {
    definition: 'Interjection',
    examples: 'oh, oops'
  },
  VB: {
    definition: 'Verb',
    examples: 'eat'
  },
  VBD: {
    definition: 'Past tense verb',
    examples: 'ate'
  },
  VBG: {
    definition: 'Verb with -ing',
    examples: 'eating'
  },
  VBP: {
    definition: 'Verb',
    examples: 'eat'
  },
  VBZ: {
    definition: 'Verb ending in -s',
    examples: 'eats'
  }
};

function buildStory (passage, replacements) {
  var printPassage = passage.split(' ');
  var readPassage = passage.split(' ');
  replacements.forEach(function (word) {
    printPassage[word.wordIndex] = '<span class="replacement">&nbsp;&nbsp;'+word.newWord+'&nbsp;&nbsp;</span>';
    readPassage[word.wordIndex] = word.newWord;
  });
  printPassage = printPassage.join(' ');
  readPassage = readPassage.join(' ');
  return { print: printPassage, read: readPassage };
}

function buildScrambledStory (passage, words) {
  var insertion; 
  passage = passage.split(' ');
  words.forEach(function (word) {
    insertion = "<span ng-if=\"userWords."+word.scrambledWord+"!=='"+word.word+"'\" class=\"unscrambleReplacement\">";
    insertion += word.scrambledWord+" ";
    insertion += "<input type=\"text\" class=\"unscrambledWord\" ng-model=\"userWords."+word.scrambledWord+"\" placeholder=\""+word.scrambledWord+"\"></span>";
    insertion += "<span ng-if=\"userWords."+word.scrambledWord+"==='"+word.word+"'\" class=\"corrected\"><strong>"+word.word+"</strong></span>";
    passage[word.wordIndex] = insertion;
  });
  passage = passage.join(' ');
  return passage;
}

function buildStoryWithMisspellings (passage, words) {
  var insertion; 
  passage = passage.split(' ');
  words.forEach(function (word) {
    passage[word.wordIndex] = word.misspelledWord;
  });
  passage = passage.join(' ');
  return passage;
}