import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { defaultTabBinding } from "@codemirror/commands";
import { EditorView, keymap } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { lineNumbers } from "@codemirror/gutter";
import { StreamLanguage } from "@codemirror/stream-parser";
// import { javascript } from "@codemirror/lang-javascript";
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

export default class AlifCodemirrorEditor_V6 extends EditorView {
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
  addErrors(errors) {
    addErrors(errors, this);
  }
  clearErrors() {
    clearErrors(this);
  }
}
