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
          StreamLanguage.define(simpleMode(alifSimpleModeStates)),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              // KeyUp
              if (typeof alif_code_OnChange === "function")
                setTimeout(alif_code_OnChange, 0);
            } else {
              // Mouse Click
              // ...
            }
          }),
        ],
      }),
      parent,
    });
  }

  setCode(code) {
    const transaction = this.state.update({
      changes: {
        from: 0,
        to: this.state.doc.length,
        insert: code,
      },
    });
    this.dispatch(transaction);
  }

  getCode() {
    return this.state.doc.toString();
  }
}

const parent = document.querySelector(".main-editor-container"); // get by ID is faster?
const editor = new AlifCodemirrorEditor_V6({ parent });

export function أضف_كود_64(codeBase64) {
  // Base64 to UTF8
  let code = decodeURIComponent(escape(window.atob(codeBase64.trim())));
  code = code.replace(/\r/g, ""); // Remove all 0x0D [\r]
  editor.setCode(code.trim());
}

export function أضف_كود(code) {
  // UTF8
  code = code.replace(/\r/g, ""); // Remove all 0x0D [\r]
  editor.setCode(code.trim());
}

export function قرأة_كود() {
  // Read
  let code = editor.getCode();
  code = code.replace(/\r/g, ""); // Remove all 0x0D [\r]
  return code;
}

export function خطأ(line_number, error_description) {
  // Show an error in Codemirror
  // Link: https://codemirror.net/6/docs/migration/
  // Section: Marked Text
}
