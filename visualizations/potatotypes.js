function drawPotatoTypes(svg, dimensions) {
  const { width, height } = dimensions;
  const chartWidth = 800;
  const chartHeight = 500;
  const offsetX = (width - chartWidth) / 2;
  const offsetY = (height - chartHeight) / 2;

  d3.csv("data/potatotypes2023.csv").then((rawData) => {
    const parsedData = rawData.map((row) => potatoTypesPreprocessor(row));

    console.log(parsedData);
    console.log(d3.max(parsedData, (d) => d.value));

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.value)])
      .range([chartHeight, 0]);

    const xScale = d3
      .scaleBand()
      .domain(parsedData.map((d) => d.name))
      .range([0, chartWidth]);

    const extraPad = 40;
    svg
      .append("rect")
      .attr("fill", "none")
      .attr("height", chartHeight + 2 * extraPad)
      .attr("width", chartWidth + 3 * extraPad)
      .attr(
        "transform",
        `translate(${offsetX - 2 * extraPad}, ${offsetY - extraPad})`
      );

    const chart = svg
      .append("g")
      .attr("transform", `translate(${offsetX}, ${offsetY})`);

    chart
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`) // Position at the bottom
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "16px");

    chart.append("g").call(d3.axisLeft(yScale));

    const imageAspectRatio = 629 / 1391;

    chart
      .selectAll(".bar")
      .data(parsedData)
      .enter()
      .append("image")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(d.value))
      .attr("width", chartWidth / 4)
      .attr("height", (d) => chartHeight - yScale(d.value))
      .attr("href", "images/tallest-sprout.png")
      .attr("preserveAspectRatio", (d) => {
        const height = chartHeight - yScale(d.value);
        const calculatedHeight = chartWidth / 4 / imageAspectRatio;
        return height > calculatedHeight ? "none" : "xMidYMid meet";
      });

    chart
      .selectAll(".label")
      .data(parsedData)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", chartHeight + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "black");

    svg
      .append("image")
      .attr("x", 0)
      .attr("y", height / 9)
      .attr("width", width * 1.2)
      .attr("height", height)
      .attr("href", "images/field.png")
      .lower();

    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "lightblue")
      .lower();

    // svg
    //   .append("image")
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("href", "images/farm-sky-background.jpg")
    //   .lower();
  });
}