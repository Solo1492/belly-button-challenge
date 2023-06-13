// Use D3 to read the JSON file
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  // Extract the necessary arrays from the data object
  var samples = data.samples;
  var names = data.names;
  var metadata = data.metadata;

  // Populate the dropdown menu with the test subject IDs
  var dropdown = d3.select("#selDataset");
  names.forEach(function(name) {
    dropdown.append("option").text(name).property("value", name);
  });

  // Function to handle dropdown selection change
  function optionChanged(selectedID) {
    // Filter the samples data for the selected ID
    var selectedSample = samples.find(function(sample) {
      return sample.id === selectedID;
    });

    // Get the top 10 OTUs
    var top10SampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    var top10OTUIds = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var top10OTULabels = selectedSample.otu_labels.slice(0, 10).reverse();

    // Create the horizontal bar chart
    var trace = {
      type: "bar",
      orientation: "h",
      x: top10SampleValues,
      y: top10OTUIds,
      text: top10OTULabels,
      hovertemplate: "%{text}<extra></extra>",
    };

    var data = [trace];

    var layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" },
    };

    Plotly.newPlot("bar", data, layout);

    // Filter the samples data for the selected ID (for the bubble chart)
    var selectedSampleBubble = samples.find(function(sample) {
      return sample.id === selectedID;
    });

    // Extract the necessary arrays from the selected sample (for the bubble chart)
    var otuIdsBubble = selectedSampleBubble.otu_ids;
    var sampleValuesBubble = selectedSampleBubble.sample_values;
    var otuLabelsBubble = selectedSampleBubble.otu_labels;

    // Create the bubble chart
    var traceBubble = {
      x: otuIdsBubble,
      y: sampleValuesBubble,
      mode: "markers",
      marker: {
        size: sampleValuesBubble,
        color: otuIdsBubble,
        colorscale: "Earth"
      },
      text: otuLabelsBubble,
      hovertemplate: "OTU ID: %{x}<br>Sample Value: %{y}<br>OTU Label: %{text}<extra></extra>"
    };

    var dataBubble = [traceBubble];

    var layoutBubble = {
      title: "Samples",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", dataBubble, layoutBubble);

    // Display the metadata for the selected ID
    var selectedMetadata = metadata.find(function(item) {
      return item.id === parseInt(selectedID);
    });

    // Clear the previous metadata
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");

    // Append each key-value pair from the metadata to the panel
    Object.entries(selectedMetadata).forEach(function([key, value]) {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  }

  // Call the optionChanged function to initialize the charts and metadata with the first ID
  optionChanged(names[0]);

  // Event listener for dropdown selection change
  d3.select("#selDataset").on("change", function() {
    var selectedID = d3.select(this).property("value");
    optionChanged(selectedID);
  });
});
