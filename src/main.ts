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

let spores = 0;

const clickButton = document.createElement("button");
clickButton.textContent = "Click me";
clickButton.addEventListener("click", () => {
  spores += 1;
  counterText.textContent = `${spores} spores`;
});

app.append(heading, image, counterText, clickButton);
