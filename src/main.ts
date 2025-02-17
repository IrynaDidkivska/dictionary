import { Definitions, ItemMeanings, Sound } from "./interface";
import "../public/styles.css";

const form = document.querySelector("form")!;
const input: HTMLInputElement | null = document.querySelector(".word-field");
const submitBtn = document.querySelector(".submit-btn");
const soundBtn = document.querySelector(".sound");
const containerWord: HTMLHeadingElement | null =
  document.querySelector(".result-text");
const containerResult: HTMLDivElement | null =
  document.querySelector(".result-word");

const btnSound = <HTMLButtonElement>document.querySelector(".sound");

const state = {
  word: "",
  meanings: [],
  phonetics: [],
};

function handlerSubmit(e: Event) {
  e.preventDefault();

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${state.word}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      state.meanings = data[0].meanings;
      state.phonetics = data[0].phonetics;
      renderWord();
      showResult();
      if (state.phonetics.length === 0) {
        soundBtn?.classList.add("disabled");
        soundBtn?.setAttribute("disabled", "true");
      } else {
        soundBtn?.classList.remove("disabled");
        soundBtn?.removeAttribute("disabled");
      }
    });
}

function showResult() {
  if (containerResult) {
    containerResult.innerHTML = "";
    state.meanings.forEach((item: ItemMeanings) => {
      containerResult.innerHTML += `<div > <h3>${item.partOfSpeech}</h3>
      <ul>
            ${getDefinition(item.definitions)}
      </ul></div>`;
    });
  }
}

function getDefinition(definitions: Definitions[]) {
  return definitions
    .map((itemDefinition: Definitions) => {
      return `<li>${itemDefinition.definition}</li>`;
    })
    .join("");
}

function renderWord() {
  if (containerWord) {
    containerWord.innerHTML = state.word;
  }
}

function handlerKeyUp(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  state.word = value;
}

function handlerSound() {
  if (state.phonetics.length > 0) {
    const sound: Sound = state.phonetics.find((s: Sound) => s.audio != "")!;
    new Audio(sound.audio).play();
  }
}

form?.addEventListener("submit", handlerSubmit);
input?.addEventListener("keyup", handlerKeyUp);
input?.addEventListener("input", () => {
  if (input.value.trim() !== "") {
    if (submitBtn) {
      submitBtn.classList.remove("disabled");
      submitBtn.removeAttribute("disabled");
    }
    if (soundBtn) {
      soundBtn.classList.remove("disabled");
      soundBtn.removeAttribute("disabled");
    }
  } else {
    if (submitBtn) {
      submitBtn.classList.add("disabled");
      submitBtn.setAttribute("disabled", "true");
    }
    if (soundBtn) {
      soundBtn.classList.add("disabled");
      soundBtn.setAttribute("disabled", "true");
    }
  }
});
btnSound.addEventListener("click", handlerSound);
