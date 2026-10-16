import { mkdir, copyFile, writeFile, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const out = `${root}dist/assets`;
await mkdir(`${out}/fonts`, { recursive: true });
const run = (args) => {
  const result = spawnSync(
    ffmpeg,
    ["-y", "-hide_banner", "-loglevel", "error", ...args],
    { stdio: "inherit" },
  );
  if (result.status !== 0) throw new Error("Asset conversion failed");
};
const input = `${root}../Assests/vid1.MP4`;
for (const [name, width] of [
  ["hero", 1440],
  ["hero-mobile", 480],
]) {
  // Use the clean 7–21 second passage; the film's opening and ending contain a baked-in title.
  run([
    "-ss",
    "7",
    "-i",
    input,
    "-t",
    "14",
    "-vf",
    `scale='min(${width},iw)':-2`,
    "-an",
    "-c:v",
    "libx264",
    "-crf",
    "27",
    "-preset",
    "medium",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    `${out}/${name}.mp4`,
  ]);
}
for (const [name, time, width] of [
  ["hero-poster", "9", 1440],
  ["gathering", "9", 800],
  ["movement", "13", 800],
  ["daylight", "17", 800],
  ["morning", "19", 800],
]) {
  run([
    "-ss",
    time,
    "-i",
    input,
    "-frames:v",
    "1",
    "-vf",
    `scale='min(${width},iw)':-2`,
    "-quality",
    "82",
    `${out}/${name}.webp`,
  ]);
}
const locationClip = `${root}../Assests/Barcelona! Thank you for the magic. The energy, the love, the movement - we felt it all! ⚡️Endle (online-video-cutter.com) (1).mp4`;
run([
  "-i",
  locationClip,
  "-vf",
  "scale=540:-2",
  "-an",
  "-c:v",
  "libx264",
  "-crf",
  "28",
  "-preset",
  "medium",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  `${out}/location-barcelona.mp4`,
]);
run([
  "-ss",
  "5",
  "-i",
  locationClip,
  "-frames:v",
  "1",
  "-vf",
  "scale=540:-2",
  "-quality",
  "82",
  `${out}/location-barcelona.webp`,
]);
const torontoName = (await readdir(`${root}../Assests`)).find(
  (name) => name.startsWith("4,000 Strong") && name.endsWith(".mp4"),
);
if (!torontoName) throw new Error("Toronto location clip missing");
const torontoClip = `${root}../Assests/${torontoName}`;
run([
  "-i",
  torontoClip,
  "-vf",
  "scale=540:-2",
  "-an",
  "-c:v",
  "libx264",
  "-crf",
  "28",
  "-preset",
  "medium",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  `${out}/location-toronto.mp4`,
]);
run([
  "-ss",
  "1",
  "-i",
  torontoClip,
  "-frames:v",
  "1",
  "-vf",
  "scale=540:-2",
  "-quality",
  "82",
  `${out}/location-toronto.webp`,
]);
for (const color of ["Black", "White"])
  await copyFile(
    `${root}../Assests/logos/CP_Logo_SVG_${color}.svg`,
    `${out}/logo-${color.toLowerCase()}.svg`,
  );
const downloads = [
  [
    "https://fonts.gstatic.com/s/chivomono/v11/mFThWbgRxKvF_Z5eQMO9qRMrJJrnKNtC3D7hr6fV.ttf",
    "fonts/chivo-mono-regular.ttf",
  ],
  [
    "https://fonts.gstatic.com/s/chivomono/v11/mFThWbgRxKvF_Z5eQMO9qRMrJJrnKNtC3D7Tr6fV.ttf",
    "fonts/chivo-mono-medium.ttf",
  ],
  [
    "https://raw.githubusercontent.com/google/fonts/main/ofl/chivomono/OFL.txt",
    "fonts/OFL.txt",
  ],
  [
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
    "world-110m.json",
  ],
];
for (const [url, path] of downloads) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not retrieve ${path}`);
  await writeFile(`${out}/${path}`, Buffer.from(await response.arrayBuffer()));
}
console.log(
  "Prepared video, poster, stills, logos, font and globe geography. Originals preserved.",
);
