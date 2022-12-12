"use strict";
const letters = document.querySelectorAll(".scoreboard-letter");
const body = document.querySelector(".body");
const restartBtn = document.querySelector(".restart-btn");

const WORDS_VALIDATOR_URL = "https://words.dev-apis.com/validate-word";
const WORDS_URL = "https://words.dev-apis.com/word-of-the-day?random=1";

const WORD_SIZE = 5;

class GameMetods {
  constructor() {
    this.currWord = "";
    this.secretWord = "";
    this.index = 0;
    this.currIdx = 0;
    this.valid = false;
  }

  addLetter(event) {
    const { currWord, index, currIdx, isLetter, isValidWord } = game;
    const letter = event.key;
    if (isLetter(letter) && currWord.length < WORD_SIZE) {
      game.currWord += letter;
      letters[game.index++].innerText = letter;
    }
    if (letter === "Backspace" && index > currIdx) {
      letters[--game.index].innerText = "";
      game.currWord = currWord.substring(0, currWord.length - 1);
      
    }
    if (
      currWord.length === WORD_SIZE &&
      letter === "Enter" &&
      index - currIdx === WORD_SIZE
    ) {
      isValidWord(currWord);
    }
    game.valid = false;
  }

  async isValidWord(currWord) {
    const promis = await fetch(WORDS_VALIDATOR_URL, {
      method: "POST",
      body: JSON.stringify({ word: currWord }),
    });
    const { validWord } = await promis.json();
    game.valid = validWord;
    game.paintingLetters();
  }

  async getSekretWord() {
    const promis = await fetch(WORDS_URL);
    const { word } = await promis.json();
    game.secretWord = word;
  }

  paintingLetters() {
    const { secretWord, numOfLetter, index, valid, currWord, currIdx } = this;
    const currSize = currIdx + WORD_SIZE;
    if (!valid) {
      for (let i = currIdx; i < currSize; i++) {
        letters[i].style.borderColor = "#FF0000";
        letters[i].style.transition = "0.3s";
      }
      setTimeout(() => {
        for (let j = currIdx; j < currSize; j++) {
          letters[j].style.borderColor = "#333";
        }
      }, 300);
    } else if (currWord.length === WORD_SIZE) {
      let idx = 0;

      const arrCurrWord = currWord.split("");
      const arrSecretWord = secretWord.split("");

      for (let i = currIdx; i < currSize; i++) {
        const letterStyle = letters[i].style;
        const currWordLetter = currWord[idx];
        const secretWordLetter = secretWord[idx++];

        const numOfLetCurrWord = numOfLetter(arrCurrWord, currWordLetter);
        const numOfLetSecretWord = numOfLetter(arrSecretWord, currWordLetter);

        const chopIndex = arrCurrWord.indexOf(currWordLetter);

        letterStyle.transition = "0.1s";

        if (currWordLetter === secretWordLetter) {
          letterStyle.backgroundColor = "green";
          if (numOfLetCurrWord > numOfLetSecretWord) {
            arrCurrWord.splice(chopIndex, 1);
          }
        } else if (
          !numOfLetSecretWord ||
          numOfLetCurrWord > numOfLetSecretWord
        ) {
          if (numOfLetCurrWord > numOfLetSecretWord) {
            arrCurrWord.splice(chopIndex, 1);
          }
          letterStyle.backgroundColor = "#C0C0C0";
        } else if (numOfLetSecretWord) {
          letterStyle.backgroundColor = "#ffff00";
        }
      }
      if (currWord === secretWord) console.log("You winner!!");
      this.currWord = "";
      this.currIdx = index;
    }
  }

  isLetter(letter) {
    if ((letter >= "a" && letter <= "z") || (letter >= "A" && letter <= "Z")) {
      if (letter.length === 1) return true;
    }
    return false;
  }

  numOfLetter(word, letter) {
    let count = 0;
    for (const ell of word) {
      if (ell === letter) count++;
    }
    return count;
  }
  restart() {
    let { getSekretWord, currWord, index, currIdx, valid } = game;
    getSekretWord();
    currWord = "";
    index = 0;
    currIdx = 0;
    valid = false;
    for (const letter of letters) {
      letter.innerText = "";
      letter.style.backgroundColor = "";
    }
  }
}

const game = new GameMetods();

{
  if (!game.secretWord.length) game.getSekretWord();
}

restartBtn.addEventListener("click", game.restart);
body.addEventListener("keydown", game.addLetter);
