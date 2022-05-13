//Register PIXI with GSAP
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const data = [10, 20, 50, 23, 65, 30, 60, 99];
const VERTICAL_PADDING = 50;
const HORIZONTAL_PADDING = 50;
const TICK_SIZE = 10;

const elements = [];

let width = window.innerWidth * window.devicePixelRatio;
let height = window.innerHeight * window.devicePixelRatio;

const app = new PIXI.Application({
  antialias: true,
  backgroundColor: 0x252525,
  width,
  height
});

const cartesianContainer = new PIXI.Container();
cartesianContainer.width = width;
cartesianContainer.height = height;
cartesianContainer.x = 0;
cartesianContainer.y = 0;
cartesianContainer.scale.y = -1;
cartesianContainer.position.y = height;

window.addEventListener("resize", () => {
  width = window.innerWidth * window.devicePixelRatio;
  height = window.innerHeight * window.devicePixelRatio;
  cartesianContainer.width = width;
  cartesianContainer.height = height;
});


app.stage.addChild(cartesianContainer);
document.body.appendChild(app.view);

let colour = (function () {
  let scale = d3.scaleOrdinal(d3.schemeCategory20);
  return (num) => parseInt(scale(num).slice(1), 16);
})();

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, height - (VERTICAL_PADDING * 2)]);

const xScale = d3.scaleBand()
  .domain(data)
  .paddingInner(.1)
  .paddingOuter(.1)
  .range([0, width - (HORIZONTAL_PADDING * 2)]);

data.forEach((d, i) => {
  const gfx = new PIXI.Sprite(PIXI.Texture.WHITE);
  gfx.x = xScale(d) + HORIZONTAL_PADDING;
  gfx.y = VERTICAL_PADDING;
  gfx.width = xScale.bandwidth();
  gfx.height = 0;
  gfx.tint = colour(d);
  cartesianContainer.addChild(gfx);
  elements.push(gfx);

  const label = new PIXI.Text(`datapoint-${i}`, { fontFamily: 'Arial', fontSize: 16, fill: 0xffffff, align: 'right' });
  label.x = xScale(d) + HORIZONTAL_PADDING + (xScale.bandwidth() / 2) - (label.width / 2);
  label.y = VERTICAL_PADDING;
  label.scale.y = -1;
  cartesianContainer.addChild(label);
});

const horizontalAxis = new PIXI.Sprite(PIXI.Texture.WHITE);

horizontalAxis.x = HORIZONTAL_PADDING;
horizontalAxis.y = VERTICAL_PADDING;
horizontalAxis.width = width - (HORIZONTAL_PADDING * 2);
horizontalAxis.height = 1;
cartesianContainer.addChild(horizontalAxis);

const verticalAxis = new PIXI.Sprite(PIXI.Texture.WHITE);

verticalAxis.x = HORIZONTAL_PADDING;
verticalAxis.y = VERTICAL_PADDING;
verticalAxis.width = 1;
verticalAxis.height = height - (VERTICAL_PADDING * 2);
cartesianContainer.addChild(verticalAxis);

yScale.ticks(10).forEach((d) => {
  const gfx = new PIXI.Sprite(PIXI.Texture.WHITE);
  gfx.x = HORIZONTAL_PADDING - TICK_SIZE;
  gfx.y = VERTICAL_PADDING + yScale(d);
  gfx.width = TICK_SIZE;
  gfx.height = 1;
  cartesianContainer.addChild(gfx);

  const label = new PIXI.Text(`${d}`, { fontFamily: 'Arial', fontSize: 16, fill: 0xffffff, align: 'right' });
  label.x = HORIZONTAL_PADDING - TICK_SIZE - 24;
  label.y = VERTICAL_PADDING + yScale(d) + 12;
  label.scale.y = -1;
  cartesianContainer.addChild(label);
});

elements.forEach((element, i) => {
  gsap.to(element, { pixi: { height: yScale(data[i]) }, duration: 3.0, ease: "expo.out", delay: 0.5 });
});
