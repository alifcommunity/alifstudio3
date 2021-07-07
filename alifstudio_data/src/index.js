import AlifEditor from "./alif-editor.js";

const parent = document.querySelector(".main-editor-container"); // get by ID is faster?
const editor = new AlifEditor({ parent, onChange: onAlifCodeChange });

function onAlifCodeChange(update) {
  // CodeMirror OnChange
  // This function is like OnKeyUp
  // We don't need to know the exact change
  // We need just to send an event to WebUI
  if (typeof alif_code_OnChange === "function")
    // [CodeMirror] -> [Index.html] -> [WebUI] -> [App]
    // All WebUI handler's should be on index.html for easy future migration.
    // All calls to WebUI handler's should be on a different thread because WebUI may stack or long time execution
    // This is not the best way to run on another thread, we need workers.. maybe later.
    setTimeout(alif_code_OnChange, 0);
}

export function اضف_كود_64(codeBase64) {
  // Incoming code (UTF8 Base64) from WebUI
  let code = decodeURIComponent(escape(window.atob(codeBase64.trim())));
  code = code.replace(/\r/g, ""); // Remove all 0x0D [\r]
  editor.setCode(code.trim());
}

export function اضف_كود(code) {
  // Incoming code (UTF8) from WebUI
  code = code.replace(/\r/g, ""); // Remove all 0x0D [\r]
  editor.setCode(code.trim());
}

export function قراءة_كود() {
  // Send actual code to WebUI
  let code = editor.getCode();
  code = code.replace(/\r/g, ""); // Remove all 0x0D [\r]
  return code;
}

export function خطأ(lineNumber, errorDescription) {
  // Show an error in Codemirror
  editor.addErrors([{ line: lineNumber, msg: errorDescription }], editor);
}

export function نظف_من_الأخطاء() {
  // remove all error set by خطأ function
  editor.clearErrors(editor);
}
