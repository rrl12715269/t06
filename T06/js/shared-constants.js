const margin = { top: 40, right:30, bottom: 50, left:70};
const width = 800;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

let innerCharts;

const tooltipWidth = 65;
const tooltipHeight = 32;

const barColor = "#606464";
const bodyBackgroundColor = "fffaf0";

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();
const yScakeS =d3.scaleLinear();
const xScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();
