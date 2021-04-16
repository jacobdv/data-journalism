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
function createCircles(circlesGroup, xVariable, yVariable) {
    circlesGroup
        .transition()
        .duration(1000)
        .attr('cx', d => setupX(d[xVariable]))
        .attr('cy', d => setupY(d[yVariable]));
    return circlesGroup;
};
// Draws x axis.
function createX(xScale, xAxis) {
    const bottomAxis = d3  
        .axisBottom(xScale);
    xAxis
        .transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};
// Draws y axis.
function createY(yScale, yAxis) {
    const leftAxis = d3
        .axisLeft(yScale);
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
    const bottomAxis = d3
        .axisBottom(xScale);
    let xAxis = chartGroup
        .append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${chartH})`)
        .call(bottomAxis);

    // Creaeting y scale and y axis on the chart.
    let yScale = setupY(stateData, yVariable);
    const leftAxis = d3
        .axisLeft(yScale);
    let yAxis = chartGroup
        .append('g')
        .classed('y-axis', true)
        .call(leftAxis);

    // Making the circles.
    let circlesGroup = chartGroup
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
        .attr("transform", `translate(${chartW / 2}, ${chartH + 20})`)
        .attr('x', (chartH / 2))
        .attr('y', 0 - ((chartW / 2) + 50))
        .attr('dy', '1em')
        .attr('class', 'axisText');
    const yAgeLabel = yGroup 
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', (chartH / 2))
        .attr('y', 0 - ((chartW / 2) + 50))
        .attr('value', 'age')
        .classed('inactive', true)
        .text('Average Age');
    const yIncomeLabel = yGroup 
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
    xGroup
        .selectAll('text')
        .on('click', function() {
            const xSelection = d3
                .select(this)
                .attr('value');
            if (xSelection !== xVariable) {
                xVariable = xSelection;
                xScale = setupX(stateData, xVariable);
                xAxis = createX(xScale, xAxis);
                circlesGroup = createCircles(circlesGroup, xScale, xVariable);
                if (xVariable === 'age') {
                    xAgeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    xIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else if (xVariable === 'income') {
                    xAgeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xIncomeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
            }
        })

    yGroup
        .selectAll('text')
        .on('click', function() {
            const ySelection = d3
                .select(this)
                .attr('value');
            if (ySelection !== yVariable) {
                yVariable = ySelection;
                yScale = setupY(stateData, yVariable);
                yAxis = createY(yScale, yAxis);
                circlesGroup = createCircles(circlesGroup, yScale, yVariable);
                if (yVariable === 'age') {
                    yAgeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    yIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else if (yVariable === 'income') {
                    yAgeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    yIncomeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
            }
        })

    // Labels for circles.
    // stateData.forEach(d => {
    //     chartGroup
    //         .append('text')
    //         .attr('x', (xScale(d[xVariable])) - (12))
    //         .attr('y', (yScale(d[yVariable])) + (3))
    //         .attr('font-size', '15px')
    //         .text(d.abbr);
    // }); 

}).catch(error => console.log(error));




