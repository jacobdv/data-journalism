/* 
Set up for the chart size and SVG creation.
*/
// Initial parameters and definitions.
const svgH = 500;
const svgW = 960;
const margin = { top:20, right:40, bottom:80, left:100 };
const chartH = svgH - (margin.top + margin.bottom);
const chartW = svgW - (margin.left + margin.right);
let xVariable = 'age';
let yVariable = 'income';
// Add SVG element to scatter div.
const svg = d3
    .select('#scatter')
    .append('svg')
    .attr('height', svgH)
    .attr('width', svgW);
// Add chart group to the SVG.
const chartGroup = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


//////////////////////////////////////////////////


/*
Functions for drawing the chart and updating it.
*/
// Sets up x axis.
function setupX(stateData, xVariable) {
    const xScale = d3
        .scaleLinear()
        .range([0, chartW])
        .domain([0, (d3.max(stateData, d => d[xVariable])) * 1.2]);
    return xScale;
};
// Sets up y axis.
function setupY(stateData, yVariable) {
    const yScale = d3
        .scaleLinear()
        .range([chartH, 0])
        .domain([0, (d3.max(stateData, d => d[yVariable])) * 1.2]);
    return yScale;
};
// Draws circles.
function createCircles(circlesGroup, xVariable) {
    circlesGroup
        .transition()
        .duration(1000)
        .attr('cx', d => newSetupX(d[xVariable]))
        .attr('cy', d => newSetupY(d[yVariable]));
    return circlesGroup;
};
// Draws x axis.
function createX(newSetupX, xAxis) {
    const bottomAxis = d3  
        .axisBottom(newSetupX);
    xAxis
        .transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};
// Draws y axis.
function createY(newSetupY, yAxis) {
    const leftAxis = d3
        .axisLeft(newSetupY);
    yAxis
        .transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};

//////////////////////////////////////////////////


/*
Set up based on initial variables.
*/
// Import data.
d3.csv('assets/data/data.csv').then(stateData => {

    // Retyping the data to be used.
    stateData.forEach(data => {
        data.smokes = +data.smokes;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.age = +data.age;
    });

    // Function calls.
    // Creating x scale and x axis on the chart.
    let xScale = setupX(stateData, xVariable);
    const xAxis = d3
        .axisBottom(xScale);
    chartGroup
        .append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${chartH})`)
        .call(xAxis);

    // Creaeting y scale and y axis on the chart.
    let yScale = setupY(stateData, yVariable);
    const yAxis = d3
        .axisLeft(yScale);
    chartGroup
        .append('g')
        .classed('y-axis', true)
        .call(yAxis);

    // Making the circles.
    const circlesGroup = chartGroup
        .selectAll('circle')
        .data(stateData)
        .join('circle')
        .attr('cx', d => xScale(d[xVariable]))
        .attr('cy', d => yScale(d[yVariable]))
        .attr('r', '15')
        .attr('fill', 'cornflowerblue')
        .attr('opacity', 0.95)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

    // Axes labels
    // X Axis
    const xGroup = chartGroup
        .append('g')
        .attr("transform", `translate(${chartW / 2}, ${chartH + 20})`);
    const xAgeLabel = xGroup 
        .append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'age')
        .classed('active', true)
        .text('Average Age');
    const xIncomeLabel = xGroup 
        .append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'income')
        .classed('inactive', true)
        .text('Median Income');
    
    // Y Axis
    const yGroup = chartGroup
        .append('g')
        .attr('transform', 'rotate(-90)')
        .attr('x', (chartH / 2))
        .attr('y', 0 - ((chartW / 2) + 50))
        .attr('dy', '1em')
        .attr('class', 'axisText');
    const yAgeLabel = xGroup 
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', (chartH / 2))
        .attr('y', 0 - ((chartW / 2) + 50))
        .attr('value', 'age')
        .classed('inactive', true)
        .text('Average Age');
    const yIncomeLabel = xGroup 
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', (chartH / 2))
        .attr('y', 0 - ((chartW / 2) + 70))
        .attr('value', 'income')
        .classed('active', true)
        .text('Median Income');


//////////////////////////////////////////////////


/*
Set up for updating variables on click.
*/

    

    // Labels for circles.
    // stateData.forEach(d => {
    //     chartGroup
    //         .append('text')
    //         .attr('x', (xScale(d[xVariable])) - (12))
    //         .attr('y', (yScale(d[yVariable])) + (3))
    //         .attr('font-size', '15px')
    //         .text(d.abbr);
    // }); 

    // Event listener for label selection changes.


    // Listener for y variable selection changes.
    // yLabel
    //     .selectAll('text')
    //     .on('click', function() {
    //         const ySelection = d3
    //             .select(this)
    //             .attr('value');
            
    //         // Sets the y variable to the selected value.    
    //         if (ySelection !== yVariable) {
    //             yVariable = ySelection;
    //         } 
    //     })


}).catch(error => console.log(error));




