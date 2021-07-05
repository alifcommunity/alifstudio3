import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { defaultTabBinding } from "@codemirror/commands";
import { EditorView, keymap } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { lineNumbers } from "@codemirror/gutter";
import { StreamLanguage } from "@codemirror/stream-parser";
import { javascript } from "@codemirror/lang-javascript";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import { addErrors, clearErrors, errorFieldExtension } from "./error-extension";
import alifSimpleModeStates from "./alif-simple-mode-states";

import "./styles.css";

const arNums = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
function toArNum(num) {
  return num.toString().replace(/\d/g, (match) => {
    return arNums[parseInt(match)];
  });
}

class AlifCodemirrorEditor_V6 extends EditorView {
  /**
   * Construct a new alif editor, options interface is `{
   *   parent: DOMElement;
   *   value?: string;
   *   onChange: (code) => void
   * }`
   * @param {object} options
   */
  constructor(options) {
    let { parent, value, onChange } = options;

    if (!parent) throw new Error("parent should be provided through `options`");

    const extensions = [
      basicSetup,
      oneDark,
      keymap.of([defaultTabBinding]),
      lineNumbers({ formatNumber: (lineNo) => toArNum(lineNo) }),
      StreamLanguage.define(simpleMode(alifSimpleModeStates)),
      errorFieldExtension,
    ];

    // TODO: create a system to handle events, to add them and to turn them off
    const onChangeExtension =
      onChange &&
      EditorView.updateListener.of(
        (update) => update.docChanged && onChange(update)
      );

    super({
      state: EditorState.create({
        doc: value,
        extensions: [...extensions, onChangeExtension],
      }),
      parent,
    });

    this.options = options;
    this.events = { onChange };
    this.extensions = extensions;
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
const editor = new AlifCodemirrorEditor_V6({
  parent,
  onChange: onAlifCodeChange,
});

function onAlifCodeChange(update) {
  const code = update.state.doc.toString();
  console.log("تم التغيير");
  console.log(code);
  // CodeMirror OnChange
  webui_event && webui_event("تم التغيير");
}

export function اضف_كود_64(codeBase64) {
  // Base64 to UTF8
  let code = decodeURIComponent(escape(window.atob(codeBase64.trim())));
  code = code.replace(/\r/g, ""); // Remove all 0x0D [\r]
  editor.setCode(code.trim());
}

export function اضف_كود(code) {
  // UTF8
  code = code.replace(/\r/g, ""); // Remove all 0x0D [\r]
  editor.setCode(code.trim());
}

export function قراءة_كود() {
  // Read
  let code = editor.getCode();
  code = code.replace(/\r/g, ""); // Remove all 0x0D [\r]
  return code;
}

export function خطأ(lineNumber, errorDescription) {
  // Show an error in Codemirror
  // Link: https://codemirror.net/6/docs/migration/
  // Section: Marked Text
  addErrors([{ line: lineNumber, msg: errorDescription }], editor);
}

export function نظف_من_الأخطاء() {
  // remove all error set by خطأ function
  clearErrors(editor);
}


