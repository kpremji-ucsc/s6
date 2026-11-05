// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Mushroom Grove";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

const counterText = document.createElement("p");
const growthText = document.createElement("p");

let spores = 0;

// Each upgrade adds its own production; owning several stacks linearly.
const compostOwned = { count: 0, growthPerSecond: 1, cost: 50 };
const rainToadsOwned = { count: 0, growthPerSecond: 5, cost: 300 };

function sporeRate() {
  return (
    1 +
    compostOwned.count * compostOwned.growthPerSecond +
    rainToadsOwned.count * rainToadsOwned.growthPerSecond
  );
}

function render() {
  counterText.textContent = `${Math.floor(spores)} spores`;
  growthText.textContent = `Growth: ${sporeRate()} spores per second`;
}

const clickButton = document.createElement("button");
clickButton.textContent = "Release spores";
clickButton.addEventListener("click", () => {
  spores += 1;
  render();
});

const buyCompostButton = document.createElement("button");
buyCompostButton.textContent = "Buy Compost (50 spores) — 0 owned";
buyCompostButton.disabled = true;
buyCompostButton.addEventListener("click", () => {
  if (spores < compostOwned.cost) return;
  spores -= compostOwned.cost;
  compostOwned.count += 1;
  render();
});

const buyRainToadsButton = document.createElement("button");
buyRainToadsButton.textContent = "Buy Rain Toads (300 spores) — 0 owned";
buyRainToadsButton.disabled = true;
buyRainToadsButton.addEventListener("click", () => {
  if (spores < rainToadsOwned.cost) return;
  spores -= rainToadsOwned.cost;
  rainToadsOwned.count += 1;
  render();
});

app.append(
  heading,
  image,
  counterText,
  growthText,
  clickButton,
  buyCompostButton,
  buyRainToadsButton,
);

let lastFrameTime = performance.now();
function tick(now: number) {
  const elapsedSeconds = (now - lastFrameTime) / 1000;
  lastFrameTime = now;
  spores += sporeRate() * elapsedSeconds;
  buyCompostButton.disabled = spores < compostOwned.cost;
  buyRainToadsButton.disabled = spores < rainToadsOwned.cost;
  render();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
