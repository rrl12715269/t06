function drawHistogram(data) {
  const values = data.filter(function(d) {
    return Number.isFinite(d.energyConsumption);
  });
  const container = d3.select("#histograms");
  const duration = 450;
  const svg = container.selectAll("svg")
    .data([null])
    .join("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Histogram of television energy consumption");
  const chart = svg.selectAll(".histogram-chart")
    .data([null])
    .join("g")
    .attr("class", "histogram-chart")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const title = svg.selectAll(".histogram-title")
    .data([null])
    .join("text")
    .attr("class", "histogram-title")
    .attr("x", width / 2)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .attr("font-size", 18)
    .attr("font-weight", "600")
    .text("TV Energy Consumption");

  if (values.length === 0) {
    chart.selectAll("rect")
      .transition()
      .duration(duration)
      .attr("y", innerHeight)
      .attr("height", 0)
      .remove();

    chart.selectAll(".empty-message")
      .data([null])
      .join("text")
      .attr("class", "empty-message")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight / 2)
      .attr("text-anchor", "middle")
      .text("No energy consumption data available");
    return;
  }
  chart.selectAll(".empty-message").remove();

  const extent = d3.extent(values, function(d) {
    return d.energyConsumption;
  });
  const domain = extent[0] === extent[1]
    ? [extent[0] - 1, extent[1] + 1]
    : extent;

  xScale
    .domain(domain)
    .range([0, innerWidth]);

  const bins = d3.bin()
    .value(function(d) {
      return d.energyConsumption;
    })
    .domain(xScale.domain())
    .thresholds(xScale.ticks(20))(values);

  yScale
    .domain([0, d3.max(bins, function(bin) {
      return bin.length;
    }) || 1])
    .nice()
    .range([innerHeight, 0]);

  const bars = chart.selectAll("rect")
    .data(bins, function(bin, index) {
      return index;
    });

  bars.exit()
    .transition()
    .duration(duration)
    .attr("y", innerHeight)
    .attr("height", 0)
    .remove();

  bars.enter()
    .append("rect")
    .attr("y", innerHeight)
    .attr("height", 0)
    .attr("fill", barColor)
    .merge(bars)
    .transition()
    .duration(duration)
    .attr("x", function(bin) {
      return xScale(bin.x0) + 1;
    })
    .attr("y", function(bin) {
      return yScale(bin.length);
    })
    .attr("width", function(bin) {
      return Math.max(0, xScale(bin.x1) - xScale(bin.x0) - 1);
    })
    .attr("height", function(bin) {
      return innerHeight - yScale(bin.length);
    })
    .attr("fill", barColor);

  chart.selectAll(".x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .transition()
    .duration(duration)
    .call(d3.axisBottom(xScale));

  chart.selectAll(".y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .transition()
    .duration(duration)
    .call(d3.axisLeft(yScale).ticks(6).tickFormat(d3.format("d")));

  chart.selectAll(".x-axis-label")
    .data([null])
    .join("text")
    .attr("class", "axis-label")
    .classed("x-axis-label", true)
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.bottom - 8)
    .attr("text-anchor", "middle")
    .text("Labeled Energy Consumption (kWh/year)");

  chart.selectAll(".y-axis-label")
    .data([null])
    .join("text")
    .attr("class", "axis-label")
    .classed("y-axis-label", true)
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .text("Frequency");
}