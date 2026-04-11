import * as esbuild from "esbuild";
import { cpSync, mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });

for (const file of [
  "manifest.json",
  "icon16.png",
  "icon48.png",
  "icon128.png",
]) {
  cpSync(`src/${file}`, `dist/${file}`);
}

await esbuild.build({
  entryPoints: ["src/content.ts"],
  bundle: true,
  outfile: "dist/content.js",
  format: "iife",
  target: ["es2020"],
});

console.log("Build complete");
