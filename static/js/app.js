// Get the URL endpoint
const website = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and populate the dropdown
d3.json(website).then(function(data) {
  console.log(data);

  // Get the dropdown element
  let dropdown = d3.select("#selDataset");

  // Populate the dropdown with test subject IDs
  data.samples.forEach(function(sample) {
    dropdown.append("option").text(sample.id).property("value", sample.id);
  });

  // Display the default plot and metadata
  function init() {
    let defaultId = data.samples[0].id;
    createBarChart(defaultId);
    createBubbleChart(defaultId);
    updateMetadata(defaultId);
    updateGaugeChart(defaultId);
  }

  // Function to update the bar chart
  function createBarChart(sampleId) {
    let sample = data.samples.find(sample => sample.id === sampleId);

    let plotData = [{
      x: sample.sample_values.slice(0, 10).reverse(),
      y: sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: sample.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    let layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" },
      height: 500
    };

    Plotly.newPlot("bar", plotData, layout);
  }

  // Function to update the bubble chart
  function createBubbleChart(sampleId) {
    let sample = data.samples.find(sample => sample.id === sampleId);

    let plotData = [{
      x: sample.otu_ids,
      y: sample.sample_values,
      mode: 'markers',
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids,
        colorscale: "Earth"
      },
      text: sample.otu_labels,
    }];

    let layout = {
      title: "OTU ID vs Sample Values",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      height: 500
    };

    Plotly.newPlot("bubble", plotData, layout);
  }

  // Function to update the metadata
  function updateMetadata(sampleId) {
    let metadataDiv = d3.select("#sample-metadata");
    let sample = data.metadata.find(sample => sample.id === parseInt(sampleId));

    metadataDiv.html("");

    Object.entries(sample).forEach(([key, value]) => {
      metadataDiv.append("p").text(`${key}: ${value}`);
    });
  }

// Function to update the gauge chart
function updateGaugeChart(sampleId) {
  let sample = data.metadata.find(sample => sample.id === parseInt(sampleId));

  let plotData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: sample.wfreq,
      title: { text: "Belly Button Washing Frequency<br><sub>Scrubs per Week</sub>" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        bar: { color: "red" },
        steps: [
          { range: [0, 1], color: "rgba(0, 128, 0, 0.2)" },
          { range: [1, 2], color: "rgba(0, 128, 0, 0.4)" },
          { range: [2, 3], color: "rgba(0, 128, 0, 0.6)" },
          { range: [3, 4], color: "rgba(0, 128, 0, 0.8)" },
          { range: [4, 5], color: "rgba(0, 128, 0, 1)" },
          { range: [5, 6], color: "rgba(0, 255, 0, 1)" },
          { range: [6, 7], color: "rgba(0, 200, 0, 1)" },
          { range: [7, 8], color: "rgba(0, 150, 0, 1)" },
          { range: [8, 9], color: "rgba(0, 100, 0, 1)" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: sample.wfreq
        }
      }
    }
  ];

  let layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

  Plotly.newPlot("gauge", plotData, layout);
}


  // Function to handle the dropdown change event
  function optionChanged(selectedId) {
    createBarChart(selectedId);
    createBubbleChart(selectedId);
    updateMetadata(selectedId);
    updateGaugeChart(selectedId);
  }

  // Bind the change event to the dropdown
  dropdown.on("change", function() {
    let selectedId = dropdown.property("value");
    optionChanged(selectedId);
  });

  // Call the init function to display the default plot and metadata
  init();
});
