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

// Prices rise with every purchase: baseCost * costMultiplier ^ count.
// With a 1.5x multiplier, the 3rd compost costs ~112 spores and the 10th
// costs ~3844, so idle play alone can't race through the whole tree.
const compostOwned = { count: 0, baseCost: 50, costMultiplier: 1.5, growthPerSecond: 1 };
const rainToadsOwned = { count: 0, baseCost: 300, costMultiplier: 1.6, growthPerSecond: 5 };

type Upgrade = {
  count: number;
  baseCost: number;
  costMultiplier: number;
  growthPerSecond: number;
};

function costOf(upgrade: Upgrade) {
  return Math.round(upgrade.baseCost * upgrade.costMultiplier ** upgrade.count);
}

function sporeRate() {
  return 1 + compostOwned.growthPerSecond * compostOwned.count + rainToadsOwned.growthPerSecond * rainToadsOwned.count;
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

function createUpgradeButton(upgrade: Upgrade, label: string) {
  const button = document.createElement("button");
  const buy = () => {
    const price = costOf(upgrade);
    if (spores < price) return;
    spores -= price;
    upgrade.count += 1;
    button.textContent = `Buy ${label} (${costOf(upgrade)} spores) — ${upgrade.count} owned`;
    render();
  };
  button.textContent = `Buy ${label} (${costOf(upgrade)} spores) — ${upgrade.count} owned`;
  button.addEventListener("click", buy);
  return button;
}

const buyCompostButton = createUpgradeButton(compostOwned, "Compost");
const buyRainToadsButton = createUpgradeButton(rainToadsOwned, "Rain Toads");

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
  buyCompostButton.disabled = spores < costOf(compostOwned);
  buyRainToadsButton.disabled = spores < costOf(rainToadsOwned);
  render();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
