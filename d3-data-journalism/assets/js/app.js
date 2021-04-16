// Initial parameters and definitions.
const svgH = 960;
const svgW = 500;
const margin = { top:20, right:40, bottom:80, left:100 };
const chartH = svgH - (margin.top + margin.bottom);
const chartW = svgW - (margin.left + margin.right);
let xVariable = 'smokes';
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

// Import data.
d3.csv('assets/data/data.csv').then(stateData => {

    // Retyping the data to be used.
    stateData.forEach(data => {
        data.smokes = +data.smokes;
        data.income = +data.income;
    });

    // Creating x scale and x axis on the chart.
    const xScale = d3
        .scaleLinear()
        .range([0, chartW])
        .domain([0, (d3.max(stateData, d => d.smokes)) * 1.2]);

    const xAxis = d3
        .axisBottom(xScale);

    chartGroup
        .append('g')
        .attr('transform', `translate(0, ${chartH})`)
        .call(xAxis);

    // Creaeting y scale and y axis on the chart.
    const yScale = d3
    .scaleLinear()
    .range([chartH, 0])
    .domain([0, (d3.max(stateData, d => d.income)) * 1.2]);

    const yAxis = d3
        .axisLeft(yScale);

    chartGroup
        .append('g')
        .call(yAxis);

    // Making the circles.
    const circlesGroup = chartGroup
        .selectAll('circle')
        .data(stateData)
        .join('circle')
        .attr('cx', d => xScale(d.smokes))
        .attr('cy', d => yScale(d.income))
        .attr('r', '15')
        .attr('fill', 'cornflowerblue')
        .attr('opacity', 0.95)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

    // Labels for circles.
    stateData.forEach(d => {
        chartGroup
            .append('text')
            .attr('x', (xScale(d.smokes)) - (12))
            .attr('y', (yScale(d.income)) + (3))
            .attr('font-size', '15px')
            .text(d.abbr);
    }); 

    // Labels for axes.
    let yLabel = chartGroup
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - (margin.left + 40))
        .attr('y', 0 - (chartH / 2))
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text(`${yVariable}`);

    let xLabel = chartGroup
        .append('text')
        .attr('transform', `translate(${chartW / 2}, ${chartH + margin.top + 30})`)
        .attr('class', 'axisText')
        .text(`${xVariable} %`);

}).catch(error => console.log(error));




