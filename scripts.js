//Register PIXI with GSAP
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const width = 960;
const height = 600;

const data = [10, 20, 50, 23, 65, 23, 12];

const elements = [];

const app = new PIXI.Application({ antialias: true, backgroundColor: 0xffffff });

const cartesianContainer = new PIXI.Container();
cartesianContainer.width = width;
cartesianContainer.height = height;
cartesianContainer.x = 0;
cartesianContainer.y = 0;
cartesianContainer.scale.y = -1;
cartesianContainer.position.y = height;

app.stage.addChild(cartesianContainer);
document.body.appendChild(app.view);

let colour = (function () {
  let scale = d3.scaleOrdinal(d3.schemeCategory20);
  return (num) => parseInt(scale(num).slice(1), 16);
})();

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, height]);

const xScale = d3.scaleBand()
  .domain(data)
  .paddingInner(.1)
  .paddingOuter(.1)
  .range([0, width]);

data.forEach((d) => {
  const gfx = new PIXI.Sprite(PIXI.Texture.WHITE);
  gfx.x = xScale(d);
  gfx.y = 0;
  gfx.width = xScale.bandwidth();
  gfx.height = 0;
  gfx.tint = colour(d);
  cartesianContainer.addChild(gfx);
  elements.push(gfx);
});

elements.forEach((element, i) => {
  gsap.to(element, { pixi: { height: yScale(data[i]) }, duration: 2.0 });
});
