// Setting up SVG and display area.
const svgWidth = 960;
const svgHeight = 500;
const margin = { top:20, right:40, bottom:80, left:100 };
const width = svgWidth - (margin.left + margin.right);
const height = svgHeight - (margin.top + margin.bottom);

// Creating SVG in html.
const svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);
const chartGroup = svg
    .append('g')
    .attr('transfrom',`translate(${margin.left}, ${margin.top})`);

// Creates initial axis.
let chosenXAxis = 'smokes';

// Creates boundary for x axis based on chosen label.
function xScale(stateData, chosenXAxis) {
    const xLinearScale = d3
        .scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
                d3.max(stateData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);
    return xLinearScale;
};

function renderAxes(newXScale, xAxis) {
    const bottomAxis = d3
        .axisBottom(newXScale);
    xAxis
        .transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};

// Actually draws/redraws circles with some transition delay.
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup
        .transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]));
    return circlesGroup;
};

function updateToolTip(chosenXAxis, circlesGroup){ 
    let label;
    if (chosenXAxis === 'smokes') {
        label = 'Smokes';
    } else {
        label = 'Obesity';
    }

    const toolTip = d3
        .tip()
        .attr('class','tooltip')
        .offset([80,-60])
        .html(d => `${d.abbr}<br>${label} ${d[chosenXAxis]}`);

    circlesGroup.call(toolTip);
    circlesGroup
        .on('mouseover', function(data) {
            toolTip.show(data);
        })
        .on('mouseout', function(data) {
            toolTip.hide(data);
        });

    return circlesGroup;
};

// This part actually uses the data csv file.
d3.csv('assets/data/data.csv').then(stateData => {
    stateData.forEach(data => {
        // Retyping data.
        data.id = +data.id;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healtcareLow = +data.healtcareLow;
        data.healtcareHigh = +data.healtcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });
    
    let xLinearScale = xScale(stateData, chosenXAxis);

    const yLinearScale = d3
        .scaleLinear()
        .domain([0, d3.max(stateData, d => d.age) * 1.2])
        .range([height, 0]);

    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    let xAxis = chartGroup
        .append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup
        .append('g')
        .call(leftAxis);

    // Draws circles.
    let circlesGroup = chartGroup
        .selectAll('circle')
        .data(stateData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d.age))
        .attr('r', 20)
        .attr('fill', 'lightblue')
        .attr('opacity', 0.95)
        .attr('stroke', 'black');

    const labelsGroup = chartGroup
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height + 20})`);

    // Adds label for smoking.
    const smokesLabel = labelsGroup
        .append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'smokes')
        .classed('active', true)
        .text('Smokes %');

    // Adds label for obesity.
    const obesityLabel = labelsGroup
        .append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'obesity')
        .classed('inactive', true)
        .text('Obesity %');

    // SHOULD BE AGE TEXT.
    chartGroup
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '1em')
        .classed('axis-text', true)
        .text('Filler Text 3');

    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll('text')
        .on('click', function() {
            const value = d3
                .select(this)
                .attr('value');
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(stateData, chosenXAxis);
                xAxis = renderAxes(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === 'smokes') {
                    smokesLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    obesityLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else {
                    smokesLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    obesityLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
            }
        })


});