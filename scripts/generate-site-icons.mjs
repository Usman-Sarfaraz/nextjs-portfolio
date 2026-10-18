import { readFile, writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og.js";
import React from "react";

const portrait = `data:image/png;base64,${(await readFile(new URL("../public/images/portfolio_portrait.png", import.meta.url))).toString("base64")}`;
const el = React.createElement;
async function icon(size) {
  const response = new ImageResponse(
    el(
      "div",
      {
        style: {
          display: "flex",
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
          background: "#ffffff",
        },
      },
      el("img", {
        src: portrait,
        width: size * 2.5,
        height: size * 2.5,
        style: { position: "absolute", left: -size * 0.71, top: -size * 0.22 },
        alt: "",
      })
    ),
    { width: size, height: size }
  );
  return Buffer.from(await response.arrayBuffer());
}
for (const [size, path] of [
  [64, "../app/icon.png"],
  [180, "../app/apple-icon.png"],
  [192, "../public/icon-192.png"],
  [512, "../public/icon-512.png"],
]) {
  await writeFile(new URL(path, import.meta.url), await icon(size));
}
const png = await icon(64);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 64;
header[7] = 64;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(
  new URL("../app/favicon.ico", import.meta.url),
  Buffer.concat([header, png])
);
const font = await readFile(
  new URL("../public/fonts/outfit-regular.ttf", import.meta.url)
);
const green = "#123b2f",
  mint = "#a6f1d2",
  white = "#f5f5f0";
const box = (style, ...children) =>
  el("div", { style: { display: "flex", ...style } }, ...children);
const txt = (text, style = {}) => box(style, text);
const photo = (style) =>
  el("img", {
    src: portrait,
    width: 540,
    height: 540,
    style: { objectFit: "contain", ...style },
  });
const base = {
  width: 1200,
  height: 630,
  position: "relative",
  overflow: "hidden",
  fontFamily: "Outfit",
  background: green,
  color: white,
};
const artwork = box(
  base,
  box(
    { position: "absolute", left: 64, top: 56, alignItems: "center", gap: 14 },
    box({ width: 10, height: 10, borderRadius: 5, background: mint }),
    txt("DESIGN MINDSET. DEVELOPER’S PRECISION.", {
      fontSize: 18,
      letterSpacing: 2,
      color: mint,
    })
  ),
  box(
    { position: "absolute", left: 64, top: 151, flexDirection: "column" },
    txt("Usman", { fontSize: 104, lineHeight: 1.02, letterSpacing: -5 }),
    txt("Sarfraz.", {
      fontSize: 104,
      lineHeight: 1.02,
      letterSpacing: -5,
      color: mint,
    }),
    txt("Frontend Developer & UI Engineer", { fontSize: 27, marginTop: 28 })
  ),
  box({
    position: "absolute",
    right: 62,
    bottom: 77,
    width: 350,
    height: 350,
    borderRadius: 175,
    background: "#20513f",
  }),
  photo({ position: "absolute", right: 0, bottom: 100 }),
  box(
    {
      position: "absolute",
      left: 64,
      right: 64,
      bottom: 39,
      borderTop: "1px solid #456357",
      paddingTop: 20,
      justifyContent: "space-between",
    },
    txt("usmansarfraz.dev", { fontSize: 20, color: mint }),
    txt("SELECTED WORK & EXPERIENCE", { fontSize: 15, letterSpacing: 2 })
  )
);

const og = new ImageResponse(artwork, {
  width: 1200,
  height: 630,
  fonts: [{ name: "Outfit", data: font, weight: 400, style: "normal" }],
});
await writeFile(
  new URL("../public/images/og-portfolio.png", import.meta.url),
  Buffer.from(await og.arrayBuffer())
);
