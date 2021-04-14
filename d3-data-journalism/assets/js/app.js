d3.csv('assets/data/data.csv').then(stateData => {

    // Retyping data and creating object for used data.
    smokerData = [];
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
    
        // Creating object for used data.
        smokerData.push({
            'state': data.abbr,
            'age': data.age,
            'smokes': data.smokes
            // 'smokesLow': data.smokesLow,
            // 'smokesHigh': data.smokesHigh
        });
    });
    console.log(smokerData);

}).catch(error => console.log(error));