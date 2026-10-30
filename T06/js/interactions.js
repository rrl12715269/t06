function populateFilters(data) {
  const technologyFilters = ["All", "LED", "LCD", "OLED"];
  const sizeFilters = [
    { label: "All Sizes", value: null },
    { label: '24"', value: 24 },
    { label: '32"', value: 32 },
    { label: '55"', value: 55 },
    { label: '65"', value: 65 },
    { label: '98"', value: 98 }
  ];
  const technologyContainer = d3.select("#filters-screen");
  const sizeContainer = d3.select("#filters-size");
  const scatterplotContainer = d3.select("#scatterplot");
  let activeTechnology = "All";
  let activeSize = null;

  function renderFilteredData() {
    const filteredData = data.filter(function(d) {
      const matchesTechnology = activeTechnology === "All"
        || String(d.screenTech).toUpperCase() === activeTechnology;
      const matchesSize = activeSize === null || d.screenSize === activeSize;
      return matchesTechnology && matchesSize;
    });

    drawHistogram(filteredData);
    drawScatterplot(filteredData);
  }

  function createFilterButtons(container, heading, options, getLabel, isActive, onClick) {
    container.selectAll("*").remove();
    container.append("h2")
      .attr("class", "filters-heading")
      .text(heading);

    return container.selectAll("button")
      .data(options)
      .join("button")
      .attr("type", "button")
      .attr("class", function(option) {
        return isActive(option) ? "filter-button is-active" : "filter-button";
      })
      .attr("aria-pressed", function(option) {
        return isActive(option) ? "true" : "false";
      })
      .text(getLabel)
      .on("click", function(event, option) {
        onClick(option);
      });
  }

  let technologyButtons = createFilterButtons(
    technologyContainer,
    "Filter by screen technology",
    technologyFilters,
    function(filter) {
      return filter;
    },
    function(filter) {
      return filter === activeTechnology;
    },
    function(filter) {
      activeTechnology = filter;
      technologyButtons
        .classed("is-active", function(buttonFilter) {
          return buttonFilter === activeTechnology;
        })
        .attr("aria-pressed", function(buttonFilter) {
          return buttonFilter === activeTechnology ? "true" : "false";
        });
      renderFilteredData();
    }
  );

  let sizeButtons = createFilterButtons(
    sizeContainer,
    "Filter by screen size",
    sizeFilters,
    function(filter) {
      return filter.label;
    },
    function(filter) {
      return filter.value === activeSize;
    },
    function(filter) {
      activeSize = filter.value;
      sizeButtons
        .classed("is-active", function(buttonFilter) {
          return buttonFilter.value === activeSize;
        })
        .attr("aria-pressed", function(buttonFilter) {
          return buttonFilter.value === activeSize ? "true" : "false";
        });
      renderFilteredData();
    }
  );
}