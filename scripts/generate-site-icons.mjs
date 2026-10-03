import { readFile, writeFile } from 'node:fs/promises';
import { ImageResponse } from 'next/og.js';
import React from 'react';

const portrait = `data:image/png;base64,${(await readFile(new URL('../public/images/portfolio_portrait.png', import.meta.url))).toString('base64')}`;
const el = React.createElement;
async function icon(size) {
  const response = new ImageResponse(
    el('div', { style: { display: 'flex', width: size, height: size, borderRadius: '50%', overflow: 'hidden', position: 'relative', background: '#ffffff' } },
      el('img', { src: portrait, width: size * 2.5, height: size * 2.5, style: { position: 'absolute', left: -size * 0.71, top: -size * 0.22 }, alt: '' })),
    { width: size, height: size });
  return Buffer.from(await response.arrayBuffer());
}
for (const [size, path] of [[64, '../app/icon.png'], [180, '../app/apple-icon.png'], [192, '../public/icon-192.png'], [512, '../public/icon-512.png']]) {
  await writeFile(new URL(path, import.meta.url), await icon(size));
}
const png = await icon(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header[6] = 32; header[7] = 32;
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
await writeFile(new URL('../app/favicon.ico', import.meta.url), Buffer.concat([header, png]));
const og = new ImageResponse(
  el('div', { style: { display: 'flex', width: '100%', height: '100%', background: '#e3e8e5', padding: '70px', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'sans-serif' } },
    el('div', { style: { display: 'flex', flexDirection: 'column', width: '730px' } },
      el('div', { style: { color: '#065f46', fontSize: 28, marginBottom: 24 } }, 'PORTFOLIO · 3+ YEARS OF EXPERIENCE'),
      el('div', { style: { fontSize: 72, fontWeight: 700, color: '#162022', marginBottom: 24 } }, 'Usman Sarfraz'),
      el('div', { style: { fontSize: 38, color: '#162022', marginBottom: 28 } }, 'Frontend Developer & UI Engineer'),
      el('div', { style: { fontSize: 27, color: '#465450' } }, 'React · Next.js · Vue · Nuxt')),
    el('img', { src: portrait, width: 400, height: 400, style: { objectFit: 'contain' }, alt: '' })),
  { width: 1200, height: 630 });
await writeFile(new URL('../public/images/og-portfolio.png', import.meta.url), Buffer.from(await og.arrayBuffer()));
