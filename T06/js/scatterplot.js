function drawScatterplot(data) {
  const values = data.filter(function(d) {
    return Number.isFinite(d.star) && Number.isFinite(d.energyConsumption);
  });
  const container = d3.select("#scatterplot");

  container.selectAll("*").remove();

  const svg = container.append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Scatterplot of star rating and labeled energy consumption");
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const tooltip = container.append("div")
    .attr("class", "chart-tooltip")
    .attr("role", "status")
    .attr("aria-live", "polite")
    .style("opacity", 0);

  if (values.length === 0) {
    chart.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight / 2)
      .attr("text-anchor", "middle")
      .text("No scatterplot data available");
    return;
  }

  const technologyColors = {
    LED: "#123b66",
    LCD: "#245c36",
    OLED: "#c45a14"
  };
  const pointCounts = new Map();

  values.forEach(function(d) {
    const key = `${String(d.screenTech).toUpperCase()}|${d.star}|${d.energyConsumption}`;
    pointCounts.set(key, (pointCounts.get(key) || 0) + 1);
  });

  const maxFrequency = d3.max(pointCounts.values());
  const lightnessVariation = d3.scaleSqrt()
    .domain([1, maxFrequency])
    .range([0.025, -0.025]);

  const x = d3.scaleLinear()
    .domain(d3.extent(values, function(d) {
      return d.star;
    }))
    .nice()
    .range([0, innerWidth]);
  const y = d3.scaleLinear()
    .domain([0, d3.max(values, function(d) {
      return d.energyConsumption;
    })])
    .nice()
    .range([innerHeight, 0]);

  chart.selectAll("circle")
    .data(values)
    .join("circle")
    .attr("cx", function(d) {
      return x(d.star);
    })
    .attr("cy", function(d) {
      return y(d.energyConsumption);
    })
    .attr("r", 4)
    .attr("fill", function(d) {
      const technology = String(d.screenTech).toUpperCase();
      const key = `${technology}|${d.star}|${d.energyConsumption}`;
      const color = d3.hsl(technologyColors[technology] || "#606464");
      color.l = Math.max(0, Math.min(1,
        color.l + lightnessVariation(pointCounts.get(key))
      ));
      return color.toString();
    })
    .attr("data-frequency", function(d) {
      const key = `${String(d.screenTech).toUpperCase()}|${d.star}|${d.energyConsumption}`;
      return pointCounts.get(key);
    })
    .attr("fill-opacity", 0.75)
    .attr("stroke", "#fffaf2")
    .attr("stroke-width", 0.75)
    .on("mouseenter", function(event, d) {
      const [pointerX, pointerY] = d3.pointer(event, container.node());

      tooltip
        .style("left", `${pointerX + 12}px`)
        .style("top", `${pointerY + 12}px`)
        .style("opacity", 1)
        .text(d.screenSize);
    })
    .on("mousemove", function(event) {
      const [pointerX, pointerY] = d3.pointer(event, container.node());
      tooltip
        .style("left", `${pointerX + 12}px`)
        .style("top", `${pointerY + 12}px`);
    })
    .on("mouseleave", function() {
      tooltip.style("opacity", 0);
    });

  chart.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));
  chart.append("g")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .attr("font-size", 18)
    .attr("font-weight", "600")
    .text("Star Rating vs. Energy Consumption");

  chart.append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.bottom - 8)
    .attr("text-anchor", "middle")
    .text("Star Rating");
  chart.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .text("Labeled Energy Consumption (kWh/year)");

  const legend = svg.append("g")
    .attr("class", "scatterplot-legend")
    .attr("transform", `translate(${width - margin.right - 175},${margin.top})`);

  Object.entries(technologyColors).forEach(function(entry, index) {
    const technology = entry[0];
    const color = entry[1];
    const item = legend.append("g")
      .attr("transform", `translate(0,${index * 20})`);

    item.append("circle")
      .attr("r", 5)
      .attr("fill", color);
    item.append("text")
      .attr("x", 10)
      .attr("y", 4)
      .text(technology);
  });

  legend.append("text")
    .attr("x", 0)
    .attr("y", 68)
    .text("Darker = higher frequency");
}