// Stamp $EXT_VERSION into src/manifest.json before the build. build.mjs copies
// src/manifest.json into dist/ at build time, so the stamp must land first.
// CI's release-extension.yml sets EXT_VERSION; local dev leaves it unset, so
// this is a no-op there.
import fs from "node:fs";

const v = process.env.EXT_VERSION;
if (v) {
    const p = "src/manifest.json";
    const m = JSON.parse(fs.readFileSync(p, "utf8"));
    m.version = v;
    fs.writeFileSync(p, JSON.stringify(m, null, 2) + "\n");
    console.log(`stamped manifest version ${v}`);
}
