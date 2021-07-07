/**
 * All the logic is that we need a StateField extension
 * to be attached to the EditorState when creatting the
 * EditorView in ./index.js. This StateField extension
 * will handle some StateEffects, we can send these
 * effect through the transaction.
 */

import { StateField, StateEffect } from "@codemirror/state";
import { EditorView, Decoration } from "@codemirror/view";

// Effects can be attached to transactions to communicate with the extension
export const addErrorEffect = StateEffect.define();
export const filterErrorsEffect = StateEffect.define();

// This value must be added to the set of extensions to enable this
export const errorFieldExtension = StateField.define({
  // Start with an empty set of decorations
  create() {
    return Decoration.none;
  },

  /**
   * This is called whenever the editor updates—it computes the new set
   * @param {RangeSet} value https://codemirror.net/6/docs/ref/#rangeset.RangeSet
   * @param {Transaction} tr https://codemirror.net/6/docs/ref/#state.Transaction
   */
  update(value, tr) {
    // Move the decorations to account for document changes
    value = value.map(tr.changes);
    // If this transaction adds or removes decorations, apply those changes
    for (let effect of tr.effects) {
      if (effect.is(addErrorEffect))
        value = value.update({ add: effect.value, sort: true });
      else if (effect.is(filterErrorsEffect))
        value = value.update({ filter: effect.value });
    }
    return value;
  },
  // Indicate that this field provides a set of decorations
  provide: (f) => EditorView.decorations.from(f),
});

/**
 * Add errors to the ciew
 * @param {Array<{ line: number, msg: string }>} errors
 */
export function addErrors(errors, view) {
  const errorDocorations = errors.map((err) => {
    const strikeMark = Decoration.mark({
      // these values used in ./style.css
      class: "alif-code-error",
      attributes: { "data-error-message": err.msg },
    });
    const line = view.state.doc.lineAt(err.line);
    return strikeMark.range(line.from, line.to);
  });

  view.dispatch({ effects: addErrorEffect.of(errorDocorations) });
}

/**
 * clear all error set by `addErrors` function
 * @param {EditorView} view the editor view to disptach the transaction
 */
export function clearErrors(view) {
  view.dispatch({
    effects: filterErrorsEffect.of(() => false),
  });
}
