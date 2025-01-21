// Load the SRTM 90m Digital Elevation Model.
var srtm = ee.Image('CGIAR/SRTM90_V4');

// Define the country boundary using an ISO-3166-1 code for Tajikistan.
var country = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Tajikistan'));

// Clip the DEM to the boundary of Tajikistan.
var clippedDEM = srtm.clipToCollection(country);

// Set visualization parameters.
var visParams = {
  min: 200,  // Adjust this value based on the elevation range you expect in Tajikistan
  max: 4500, // Adjust this value based on the elevation range you expect in Tajikistan
  palette: ['00ffff', '0000ff', '00ff00', 'ffff00', 'ff0000', 'ffffff']
};

// Add the clipped DEM to the map.
Map.centerObject(country, 6);
Map.addLayer(clippedDEM, visParams, 'SRTM 90m DEM of Tajikistan');

// Export the image, specifying scale and region.
Export.image.toDrive({
  image: clippedDEM,
  description: 'Tajikistan_DEM_90m',
  scale: 90,
  region: country.geometry(),
  fileFormat: 'GeoTIFF'
});
