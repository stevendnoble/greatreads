wordFunctions = {
  shuffle: function (array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },
  scramble: function (word) {
    var scrambledWord = word.split('');
    scrambledWord = wordFunctions.shuffle(scrambledWord);
    scrambledWord = scrambledWord.join('');
    return scrambledWord;
  },
  misspell: function (word) {
    var option = word.length % 3;
    // Get random letter, not the last letter of the word
    var randLetter;
    do {
      randLetter = Math.floor(Math.random() * (word.length-1));
    } while (word[randLetter] === word[randLetter+1]);
    word = word.split('');
    if (option === 1) {
      // switch two letters
      var temp = word[randLetter];
      word[randLetter] = word[randLetter + 1];
      word[randLetter+1] = temp;
    } else if (option === 2) {
      // change a letter to a different letter
      var letterMap = {
        a: 'ai',
        b: 'bb',
        c: 'k',
        d: 's',
        e: 'i',
        f: 'th',
        g: 'gg',
        h: 'g',
        i: 'e',
        j: 'g',
        k: 'c',
        l: 'll',
        m: 'n',
        n: 'm',
        o: 'u',
        p: 'pp',
        q: 'c',
        r: 't',
        s: 'c',
        t: 'tt',
        u: 'o',
        v: 'w',
        w: 'v',
        x: 'z',
        y: 'ie',
        z: 's'
      };
      word[randLetter] = letterMap[word[randLetter]];
    } else {
      // eliminate a letter
      word.splice(randLetter, 1);
    }
    return word.join('');
  },
  ACCEPTABLE_POS: ['CD', 'IN', 'JJ', 'JJR', 'JJS', 'NN', 'NNP', 'NNPS', 'NNS', 'PP$', 'PRP', 'RB', 'RBR', 'RBS', 'UH', 'VB', 'VBD', 'VBG', 'VBP', 'VBZ']
};

module.exports = wordFunctions;
