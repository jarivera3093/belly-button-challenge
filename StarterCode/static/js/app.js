const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//get json data and log it
d3.json(url).then(function(data) {
    console.log(data);
});
//create init function that will populate the dropdown, bar chart and bubble chart
function init(){
    //create dropdown list variable
    let dropDown = d3.select("#selDataset");
    //get the data with D3
    d3.json(url).then((data) => {
        //get sample ids 
    let sample_ids = data.names;
    console.log(sample_ids);
        for (id of sample_ids) {
            dropDown.append("option").attr("value", id).text(id);
        };
        //store the first sample
    let first_entry = sample_ids[0];
    console.log(first_entry);

    //have the init() function with the first entry
    makeBar(first_entry);
    makeBubble(first_entry);
    makeDemographics(first_entry);
    });
};
    //create a function to populate the horizontal bar chart
function makeBar(sample){
    //get sample data with d3
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //apply filter
        let results = sample_data.filter(id => id.id == sample);
        //store the first entry
        let first_result = results[0];
        console.log(first_result);
        //store first 10 results to display
        let sample_values = first_result.sample_values.slice(0,10);
        let otu_ids = first_result.otu_ids.slice(0,10);
        let otu_labels = first_result.otu_labels.slice(0,10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //create the trace for bar chart
        let bar_trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(item => `OTU ${item}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = {title: "Top Ten OTUs"};
        Plotly.newPlot("bar", [bar_trace], layout);
    });
};
    //create function to populate bubble chart
function makeBubble(sample){
        //get sample data with d3
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //apply filter
        let results = sample_data.filter(id => id.id == sample);
        //store the first entry
        let first_result = results[0];
        console.log(first_result);
        //store first 10 results to display
        let sample_values = first_result.sample_values;
        let otu_ids = first_result.otu_ids;
        let otu_labels = first_result.otu_labels;
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };
         let layout = {
            title: "Bacteria Count for Each Sample ID",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'}
         };
         Plotly.newPlot("bubble", [bubble_trace], layout);
    });
};


//create demographic info function
function makeDemographics(sample){
    //get sample data with d3
    d3.json(url).then((data) => {
    let demographic_info = data.metadata;
    //apply filter
    let results = demographic_info.filter(id => id.id == sample);
    //store the first entry
    let first_result = results[0];
    console.log(first_result);
    //set text to blank string
    d3.select('#sample-metadata').text('');

    Object.entries(first_result).forEach(([key, value]) => {
        console.log(key, value);

        d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
    });

    });
};

//define the function when dropdown detects change
function optionChanged(value) {
    //value for debug
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

init();