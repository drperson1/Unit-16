// @TODO: YOUR CODE HERE!
// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 50, right: 50, bottom: 50, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
// d3.csv("assets/data/data.csv", function(error, healthData) {
   //if (error) throw error;

d3.csv("assets/data/data.csv").then(function(healthData) {

  //console.log(healthData);
  //console.log([healthData]);

  // Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    });

  // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([15, d3.max(healthData, d => d.obesity)])
      .range([height, 0]);

    // let poverty = healthData.map((x) => x.poverty)
    // let obesity = healthData.map((x) => x.obesity)
    
    // var xLinearScale = d3.scaleLinear()
    //   .domain(0, d3.max(poverty))
    //   .range(0,width)

    // var yLinearScale = d3.scaleLinear()
    //   .domain(0, d3.max(obesity))
    //   .range(height, 0);

    // Create axes functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles for scatter plot
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", "0.5");

    // Add State abbreviations to circles
    var circlesGroup = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", "white")
    .text(d => (d.abbr));
   
     //Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
      });

    //Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);


     //Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top -10})`)
    .attr("class", "axisText")
    .text("Poverty (%)");

  });