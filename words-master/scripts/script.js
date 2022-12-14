"use strict";
const letters = document.querySelectorAll(".scoreboard-letter");
const body = document.querySelector(".body");
const restartBtn = document.querySelector(".restart-btn");

const WORDS_VALIDATOR_URL = "https://words.dev-apis.com/validate-word";
const WORDS_URL = "https://words.dev-apis.com/word-of-the-day?random=1";

const WORD_SIZE = 5;

function memoize(callback) {
  const cache = new Map();
  return async (word) => {
    const value = cache.get(word);
    if (cache.has(word)) return value;
    const res = await callback(word);
    cache.set(word, res);
    return res;
  };
}

async function isValidWord(currWord) {
  const promis = await fetch(WORDS_VALIDATOR_URL, {
    method: "POST",
    body: JSON.stringify({ word: currWord }),
  });
  const { validWord } = await promis.json();
  return validWord;
}

async function getSekretWord() {
  const promis = await fetch(WORDS_URL);
  const { word } = await promis.json();
  return word;
}

class WordsMaster {
  constructor() {
    this.currWord = "";
    this.secretWord = "";
    this.index = 0;
    this.currIdx = 0;
  }

  isValid = memoize(isValidWord);

  async addLetter(event) {
    const letter = event.key;
    if (this.isLetter(letter) && this.currWord.length < WORD_SIZE) {
      this.currWord += letter;
      letters[this.index++].innerText = letter;
    }
    if (letter === "Backspace" && this.index > this.currIdx) {
      letters[--this.index].innerText = "";
      this.currWord = this.currWord.substring(0, this.currWord.length - 1);
    }
    if (
      this.currWord.length === WORD_SIZE &&
      letter === "Enter" &&
      this.index - this.currIdx === WORD_SIZE
    ) {
      const validWord = await this.isValid(this.currWord);
      this.painting(validWord);
    }
    return;
  }

  painting(validWord) {
    const currSize = this.currIdx + WORD_SIZE;

    if (!validWord) this.paintingBorder(currSize);
    else if (this.currWord.length === WORD_SIZE) {
      this.paintingLetter(currSize);
      this.currWord = "";
      this.currIdx = this.index;
    }
    if (this.currWord === this.secretWord) console.log("You winner!!");
    return;
  }
  paintingLetter(currSize) {
    let idx = 0;
    const arrCurrWord = this.currWord.split("");
    const arrSecretWord = this.secretWord.split("");

    for (let i = this.currIdx; i < currSize; i++) {
      const letterStyle = letters[i].style;
      const currWordLetter = this.currWord[idx];
      const secretWordLetter = this.secretWord[idx++];
      const chopIndex = arrCurrWord.indexOf(currWordLetter);
      const numOfLetCurrWord = this.numOfLetter(arrCurrWord, currWordLetter);
      const numOfLetSecretWord = this.numOfLetter(
        arrSecretWord,
        currWordLetter
      );
      letterStyle.transition = "";

      if (currWordLetter === secretWordLetter) {
        letterStyle.backgroundColor = "green";
      } else if (!numOfLetSecretWord || numOfLetCurrWord > numOfLetSecretWord) {
        letterStyle.backgroundColor = "#C0C0C0";
      } else if (numOfLetSecretWord) {
        letterStyle.backgroundColor = "#ffff00";
      }
      if (numOfLetCurrWord > numOfLetSecretWord) {
        arrCurrWord.splice(chopIndex, 1);
      }
    }
    return;
  }

  paintingBorder(currSize) {
    for (let i = this.currIdx; i < currSize; i++) {
      letters[i].style.borderColor = "#FF0000";
      letters[i].style.transition = "0.3s";
    }
    setTimeout(() => {
      for (let j = this.currIdx; j < currSize; j++) {
        letters[j].style.borderColor = "#333";
      }
    }, 300);
    return;
  }

  isLetter(letter) {
    if (
      (letter >= "a" && letter <= "z") ||
      (letter >= "A" && letter <= "Z" && letter.length === 1)
    ) {
      return true;
    }
    return false;
  }

  numOfLetter(word, letter) {
    return word.reduce((acc, ell) => {
      if (ell === letter) return acc + 1;
      return acc;
    }, 0);
  }

  async restart() {
    this.currWord = "";
    this.secretWord = await getSekretWord();
    this.index = 0;
    this.currIdx = 0;
    for (const letter of letters) {
      letter.innerText = "";
      letter.style.backgroundColor = "";
    }
    console.log(this.secretWord);
    return;
  }
}

const game = new WordsMaster();

(async () => {
  if (!game.secretWord.length) {
    game.secretWord = await getSekretWord();
    console.log(game.secretWord);
  }
  return;
})();

restartBtn.addEventListener("click", () => game.restart());
body.addEventListener("keydown", (event) => game.addLetter(event));
