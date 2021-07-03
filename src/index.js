import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { defaultTabBinding } from "@codemirror/commands";
import { EditorView, keymap } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { lineNumbers } from "@codemirror/gutter";
import { StreamLanguage } from "@codemirror/stream-parser";
import { javascript } from "@codemirror/lang-javascript";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import alifSimpleModeStates from "./alif-simple-mode-states";

import "./styles.css";

const arNums = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
function toArNum(num) {
  return num.toString().replace(/\d/g, (match) => {
    return arNums[parseInt(match)];
  });
}

class AlifCodemirrorEditor_V6 extends EditorView {
  constructor(options) {
    let { parent, value } = options;

    super({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          oneDark,
          keymap.of([defaultTabBinding]),
          lineNumbers({ formatNumber: (lineNo) => toArNum(lineNo) }),
          // javascript(),
          StreamLanguage.define(simpleMode(alifSimpleModeStates)),
        ],
      }),
      parent,
    });
  }

  setCode(code) {
    const length = this.state.doc.length;
    const transaction = this.state.update({
      changes: { from: 0, to: length - 1, insert: code },
    });
    this.dispatch(transaction);
  }
}

const parent = document.querySelector(".main-editor-container");
const editor = new AlifCodemirrorEditor_V6({ parent });

export function ضع_الكود(codeBase64) {
  const code = atob(codeBase64);
  editor.setCode(code);
}

