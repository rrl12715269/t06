function convertRow(row) {
  return {
    brand: row.brand,
    model: row.model,
    screenSize: +row.screenSize,
    screenTech: row.screenTech,
    energyConsumption: +row.energyConsumption,
    star: +row.star
  };
}

d3.csv("data/Ex6_TVdata.csv", convertRow)
  .then(function(data) {
    if (typeof populateFilters === "function") {
      populateFilters(data);
    } else {
      console.warn("populateFilters is not defined; continuing without filters.");
    }

    drawHistogram(data);
    drawScatterplot(data);
  })
  .catch(function(error) {
    console.error("Failed to load or process TV data:", error);
  });