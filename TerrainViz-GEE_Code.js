
// Load the SRTM DEM data
var dem = ee.Image('USGS/SRTMGL1_003');

// Compute the hillshade
var azimuth = 315; // Direction of the light source
var elevation = 45; // Elevation of the light source
var hillshade = ee.Terrain.hillshade(dem, azimuth, elevation);

// Clip the DEM and hillshade to the AOI
var clippedDEM = dem.clip(aoi);
var clippedHillshade = hillshade.clip(aoi);

// Visualization parameters for DEM
var demVisParams = {
  min: 0,
  max: 3000,
  palette: ['0000FF', '00FFFF', '00FF00', 'FFFF00', 'FF0000', 'FFFFFF']
};

// Visualization parameters for hillshade
var hillshadeVisParams = {
  min: 0,
  max: 255,
  palette: ['black', 'white']
};

// Add DEM layer to the map
Map.centerObject(aoi, 8);
Map.addLayer(clippedDEM, demVisParams, 'DEM');

// Add hillshade layer to the map
Map.addLayer(clippedHillshade, hillshadeVisParams, 'Hillshade', false);

// [Your existing code for loading data and setting up visualizations]

// Function to generate contours
function generateContours(elevationImage, interval) {
  var contour = ee.Algorithms.Terrain(elevationImage).select('elevation');
  var step = contour.divide(interval).floor().multiply(interval);
  return step;
}

// Set the contour interval in meters
var contourInterval = 100; // Adjust this value as needed

// Generate contours
var contours = generateContours(dem, contourInterval);

// Visualization parameters for contours
var contourVisParams = {
  min: 0,
  max: 3000,
  palette: ['blue', 'green', 'red'],
  lineWidth: 1
};

// Add contour layer to the map
Map.addLayer(contours.clip(aoi), contourVisParams, 'Contours');



// Set up the legend for DEM
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

var legendTitle = ui.Label({
  value: 'Elevation (m)',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});

legend.add(legendTitle);

// Color palette and corresponding elevation ranges for the DEM
var palette = ['0000FF', '00FFFF', '00FF00', 'FFFF00', 'FF0000', 'FFFFFF'];
var labels = ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500+'];

palette.forEach(function(color, index) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: '#' + color,
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });

  var description = ui.Label({
    value: labels[index],
    style: {margin: '0 0 4px 6px'}
  });

  legend.add(ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  }));
});

Map.add(legend);

// [Your existing code for loading data, setting up visualizations, and generating contours]

// Set up the legend for contours
var contourLegend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px'
  }
});

var contourLegendTitle = ui.Label({
  value: 'Contour Intervals (meters)',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});


// Export the clipped DEM
Export.image.toDrive({
  image: clippedDEM,
  description: 'DEM_Export',
  scale: 30, // Adjust the scale as needed
  region: aoi.geometry(),
  maxPixels: 1e10
});

// Export the clipped hillshade
Export.image.toDrive({
  image: clippedHillshade,
  description: 'Hillshade_Export',
  scale: 30, // Adjust the scale as needed
  region: aoi.geometry(),
  maxPixels: 1e10
});
