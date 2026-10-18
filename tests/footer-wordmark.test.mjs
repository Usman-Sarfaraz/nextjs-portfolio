import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../components/contact/footer-wordmark.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});

for (const reducedMotion of [false, true]) {
  test(`footer name is visible before animation runs (reduced motion: ${reducedMotion})`, () => {
    const compiledModule = { exports: {} };
    const load = (id) => {
      if (id === "@/lib/motion") return { useReducedMotion: () => reducedMotion };
      if (id.endsWith(".css")) return { default: new Proxy({}, { get: (_, key) => String(key) }) };
      return require(id);
    };
    new Function("require", "module", "exports", outputText)(load, compiledModule, compiledModule.exports);
    const html = renderToStaticMarkup(createElement(compiledModule.exports.FooterWordmark));
    assert.match(html, /aria-label="Usman Sarfraz — back to home"/);
    assert.equal(html.replace(/<[^>]+>/g, ""), "usmansarfraz.");
    assert.doesNotMatch(html, /translateY\([^)]*%\)|opacity:0/, "the name must remain visible before the scroll reveal runs");
  });
}
