// TODO: Update for getLayoutMap

import { Maybe } from "./types";

// @see https://developer.mozilla.org/en-US/docs/Web/API/Keyboard/getLayoutMap
export const KeyCode = {
  Escape: "Escape",
  BackQuote: "BackQuote",
  Digit1: "Digit1",
  Digit2: "Digit2",
  Digit3: "Digit3",
  Digit4: "Digit4",
  Digit5: "Digit5",
  Digit6: "Digit6",
  Digit7: "Digit7",
  Digit8: "Digit8",
  Digit9: "Digit9",
  Digit0: "Digit0",
  Minus: "Minus",
  Equal: "Equal",
  ShiftLeft: "ShiftLeft",
  ShiftRight: "ShiftRight",
  Tab: "Tab",
  Backspace: "Backspace",
  BracketLeft: "BracketLeft",
  BracketRight: "BracketRight",
  Backslash: "Backslash",
  ControlRight: "ControlRight",
  ControlLeft: "ControlLeft",
  Semicolon: "Semicolon",
  Quote: "Quote",
  Comma: "Comma",
  Period: "Period",
  Slash: "Slash",
  Enter: "Enter",
  AltLeft: "AltLeft",
  AltRight: "AltRight",
  MetaLeft: "MetaLeft",
  MetaRight: "MetaRight",
  ArrowLeft: "ArrowLeft",
  ArrowDown: "ArrowDown",
  ArrowUp: "ArrowUp",
  ArrowRight: "ArrowRight",
  Q: "KeyQ",
  W: "KeyW",
  E: "KeyE",
  R: "KeyR",
  T: "KeyT",
  U: "KeyU",
  I: "KeyI",
  O: "KeyO",
  P: "KeyP",
  A: "KeyA",
  S: "KeyS",
  D: "KeyD",
  F: "KeyF",
  G: "KeyG",
  H: "KeyH",
  J: "KeyJ",
  K: "KeyK",
  L: "KeyL",
  Z: "KeyZ",
  X: "KeyX",
  C: "KeyC",
  V: "KeyV",
  B: "KeyB",
  N: "KeyN",
  M: "KeyM",
} as const;

export function numFromDigitKey(key: KeyCode): Maybe<number> {
  switch (key) {
    case KeyCode.Digit0:
      return 0;
    case KeyCode.Digit1:
      return 1;
    case KeyCode.Digit2:
      return 2;
    case KeyCode.Digit3:
      return 3;
    case KeyCode.Digit4:
      return 4;
    case KeyCode.Digit5:
      return 5;
    case KeyCode.Digit6:
      return 6;
    case KeyCode.Digit7:
      return 7;
    case KeyCode.Digit8:
      return 8;
    case KeyCode.Digit9:
      return 9;
  }
}

export type KeyCode = (typeof KeyCode)[keyof typeof KeyCode];
