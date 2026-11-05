// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Mushroom Grove";

const subtitle = document.createElement("p");
subtitle.textContent = "Release spores. Tend the soil. Watch the grove spread.";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

const counterText = document.createElement("p");
const growthText = document.createElement("p");

let spores = 0;

// One data-driven model: every upgrade differs only by these fields, and a
// single createUpgradeButton implementation handles all of them. Adding a
// third upgrade becomes a data entry, not a code copy.
type Upgrade = {
  count: number;
  baseCost: number;
  costMultiplier: number;
  growthPerSecond: number;
  label: string;
  description: string;
};

const upgrades: Upgrade[] = [
  {
    count: 0,
    baseCost: 50,
    costMultiplier: 1.5,
    growthPerSecond: 1,
    label: "Compost",
    description: "Nutrient soil that feeds the mycelium. +1 spore/s each.",
  },
  {
    count: 0,
    baseCost: 300,
    costMultiplier: 1.6,
    growthPerSecond: 5,
    label: "Rain Toads",
    description:
      "Amphibians that summon drizzle, watering the grove. +5 spores/s each.",
  },
  {
    count: 0,
    baseCost: 1500,
    costMultiplier: 1.7,
    growthPerSecond: 20,
    label: "Mossy Log",
    description:
      "A fallen nurse log where new colonies take root. +20 spores/s each.",
  },
];

function costOf(upgrade: Upgrade) {
  return Math.round(upgrade.baseCost * upgrade.costMultiplier ** upgrade.count);
}

function sporeRate() {
  return upgrades.reduce((sum, u) => sum + u.growthPerSecond * u.count, 1);
}

function render() {
  counterText.textContent = `${Math.floor(spores)} spores`;
  growthText.textContent = `Growth: ${sporeRate()} spores per second`;
}

const clickButton = document.createElement("button");
clickButton.textContent = "Release spores";
clickButton.title = "Shake the mushroom cap to shake loose more spores.";
clickButton.addEventListener("click", () => {
  spores += 1;
  render();
});

function createUpgradeButton(upgrade: Upgrade) {
  const button = document.createElement("button");
  const updateText = () => {
    button.textContent = `Buy ${upgrade.label} (${costOf(upgrade)} spores) — ${upgrade.count} owned`;
  };
  button.title = upgrade.description;
  updateText();
  button.addEventListener("click", () => {
    const price = costOf(upgrade);
    if (spores < price) return;
    spores -= price;
    upgrade.count += 1;
    updateText();
    render();
  });
  return button;
}

const upgradeButtons = upgrades.map(createUpgradeButton);
app.append(
  heading,
  subtitle,
  image,
  counterText,
  growthText,
  clickButton,
  ...upgradeButtons,
);

let lastFrameTime = performance.now();
function tick(now: number) {
  const elapsedSeconds = (now - lastFrameTime) / 1000;
  lastFrameTime = now;
  spores += sporeRate() * elapsedSeconds;
  upgrades.forEach((upgrade, i) => {
    upgradeButtons[i].disabled = spores < costOf(upgrade);
  });
  render();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
