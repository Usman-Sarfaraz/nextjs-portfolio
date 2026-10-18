import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/metadata.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});

for (const siteUrl of [undefined, 'https://portfolio.example']) {
  test(`share metadata includes a full-size image (configured URL: ${Boolean(siteUrl)})`, () => {
    const compiled = { exports: {} };
    new Function('require', 'module', 'exports', 'process', outputText)(
      () => ({ profile: { name: 'Usman Sarfraz' } }), compiled, compiled.exports,
      { env: { NEXT_PUBLIC_SITE_URL: siteUrl } },
    );
    const { baseMetadata, createMetadata } = compiled.exports;
    const page = createMetadata({ path: '/' });
    assert.equal(page.openGraph.images[0].width, 1200);
    assert.equal(page.openGraph.images[0].height, 630);
    assert.equal(page.twitter.card, 'summary_large_image');
    assert.equal(page.twitter.images[0].url, page.openGraph.images[0].url);
    assert.equal(baseMetadata.icons.icon[0].sizes, '64x64');
    assert.equal(baseMetadata.metadataBase.origin, siteUrl || 'https://usmansarfraz.dev');
    assert.equal(page.alternates.canonical, '/');
  });
}

test('share image and favicon have the declared dimensions', () => {
  const png = readFileSync(new URL('../public/images/og-portfolio.png', import.meta.url));
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  const ico = readFileSync(new URL('../app/favicon.ico', import.meta.url));
  assert.equal(ico[6], 64);
  assert.equal(ico[7], 64);
});
