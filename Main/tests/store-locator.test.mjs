import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { build } from "esbuild";

const bundle = await build({entryPoints: ["src/store-locator.js"], bundle: true,
  platform: "node", format: "esm", write: false});
const { distanceKm, rankStores } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`);
const stores = JSON.parse(await readFile("src/stores.json", "utf8"));

test("great-circle distances agree with an independent equatorial reference", () => {
  assert.equal(distanceKm([0, 0], [0, 0]), 0);
  assert.ok(Math.abs(distanceKm([0, 0], [1, 0]) - 111.195) < .01);
  assert.ok(Math.abs(distanceKm([-79.4, 43.6], [-79.7, 44.3]) - distanceKm([-79.7, 44.3], [-79.4, 43.6])) < .0001);
});
test("nearest ranking is numeric, preserves source order and puts ungeocoded stores last", () => {
  const input = [{id:"far",coordinates:[2,0]}, {id:"near",coordinates:[.1,0]}, {id:"unknown"}];
  assert.deepEqual(rankStores(input,[0,0]).map(s=>s.id),["near","far","unknown"]);
  assert.deepEqual(input.map(s=>s.id),["far","near","unknown"]);
  assert.equal(input[0].distance, undefined);
});
test("the supplied Annex address ranks itself first, with Barrie farther away", () => {
  const annex = stores.find(s=>s.id === "summerhill-annex");
  const ranked = rankStores(stores, annex.coordinates);
  assert.equal(ranked[0].id, annex.id);
  assert.equal(ranked[0].distance, 0);
  assert.ok(ranked.find(s=>s.id === "pure-athletic").distance > 70);
});
test("all supplied locations have unique IDs, address-level coordinates and distinct delivery states", () => {
  assert.equal(stores.length,22);
  assert.equal(new Set(stores.map(s=>s.id)).size,22);
  assert.equal(stores.filter(s=>s.status==="rollout").length,10);
  assert.equal(stores.filter(s=>s.status==="reported").length,2);
  assert.equal(stores.filter(s=>["confirmed","active"].includes(s.status)).length,10);
  for (const s of stores) {
    assert.equal(s.coordinatePrecision,"address");
    assert.ok(s.coordinates[0]>-81 && s.coordinates[0]<-78 && s.coordinates[1]>43 && s.coordinates[1]<45);
  }
});
