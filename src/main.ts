// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "D1 project";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

const counterText = document.createElement("p");
counterText.textContent = "0 spores";

const growthText = document.createElement("p");
growthText.textContent = "Natural growth: 1 spore per second";

let spores = 0;
let growthPerSecond = 1;

const clickButton = document.createElement("button");
clickButton.textContent = "Click me";
clickButton.addEventListener("click", () => {
  spores += 1;
  counterText.textContent = `${spores} spores`;
});

// Drive growth from elapsed time so the rate is the same on a 60Hz and a
// 144Hz display, and stays smooth instead of jumping once per second.
let lastFrameTime = performance.now();
function tick(now: number) {
  const elapsedSeconds = (now - lastFrameTime) / 1000;
  lastFrameTime = now;
  spores += growthPerSecond * elapsedSeconds;
  counterText.textContent = `${Math.floor(spores)} spores`;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

app.append(heading, image, counterText, growthText, clickButton);
