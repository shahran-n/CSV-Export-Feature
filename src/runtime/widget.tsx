import React, { useEffect, useState } from 'react';
import { Button } from 'jimu-ui';
import { MapViewManager, JimuMapView, JimuMapViewComponent } from 'jimu-arcgis';
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import esri = __esri

const Widget = (props) => {
  // Start: Establishes a connnection to the map to be able to access the layers and its data
  // Establishing state and variables
  const viewManager = MapViewManager.getInstance();
  const mapView = viewManager.getJimuMapViewById(viewManager.getAllJimuMapViewIds()[0])
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(mapView); // State for JimuMapView
  const [mapReady, setMapReady] = useState(false); // State to track map readiness

  const [inputName, setinputName] = useState(''); // State to track user input
  const [layers, setLayers] = useState([]); //State to store Layer options

  // Effect to handle input change

  const handleInputChange = (event) => {
    setinputName(String(event.target.value));
  };

  // Effect to handle map view initialization
  useEffect(() => {
    console.log('jimuMapView changed:', jimuMapView);
    if (jimuMapView) {
      reactiveUtils
        .whenOnce(() => jimuMapView.view.ready) // Wait for map view to be ready
        .then(() => {
          setMapReady(true); // Once ready, set mapReady state to true
        })
        .catch((error) => {
          console.error('Error initializing map:', error);
        });
    } else {
      console.error('Unable to retrieve Jimu Map View');
    }
  }, [jimuMapView]);

  useEffect(() => {
    if (jimuMapView && mapReady) {
      const jlv = jimuMapView.getAllJimuLayerViews();
      const jlvArray = jlv.map(layerView => ({ title: layerView.layer.title }));
      setLayers(jlvArray);
    }
  }, [jimuMapView, mapReady]);

  // Handler for changing active view
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv); // Update JimuMapView state with the new active view
    }
  };

  // End: Additional part in render (return) component below

  // Styling for the text input
  const insideCard = {
    display: 'flex',
  };

  // Styling for the export button
  const buttonStyle = {
    marginLeft: '20px',
    fontSize: '12px',
    padding: '1px 8px',
  };

  let textValue = inputName; // Variable for text value
  console.log(textValue)
  let [queryWord, setqueryWord] = useState(''); // Global Variable for Query

  // Fucntion to intercept Query Request

  function interceptRequest() {
    const handleRequest = async (request) => {
      try {
        const response = await originalFetch(request.url, request.options); // Use originalFetch instead of fetch
      } catch (error) {
        console.error('Request failed:', error);
      }
    };

    // Replace or override the fetch function to intercept requests
    const originalFetch = window.fetch;

    window.fetch = function (url, options) {
      const request = { url, options };
      const linkString = String(request.url);

      const urlParams = new URLSearchParams(new URL(linkString).search);
      const whereQuery = urlParams.get('where');

      queryWord = decodeURIComponent(whereQuery);
      queryWord = queryWord.replace(/[()]/g, '');
      setqueryWord(queryWord)


      // Call your handleRequest function asynchronously
      handleRequest(request);

      // Proceed with the original fetch request
      return queryWord, originalFetch.apply(this, arguments);
    };
  };

  // Example usage:
  setTimeout(interceptRequest, 5000)
  console.log(queryWord)

  // Function to export CSV data
  function customExportCSV() {
    const jlv = jimuMapView.getAllJimuLayerViews(); // Get all layer views
    const layerCount = jlv.length;
    let count = 0;
    for (let i = 0; i < layerCount; i++) {
      if (textValue !== jlv[i].layer.title) {
        count += 1;
      } else {
        break;
      }
    }

    const layerId = jlv[count].layer.id; // Get the ID of the layer to export
    const featureLayer = jimuMapView.view.map.findLayerById(layerId) as esri.FeatureLayer; // Find the feature layer by ID
    let query = featureLayer.createQuery();
    query.where = queryWord
    console.log('Result: ', query.where)
    let csv = '';
    let headers = '';

    // Query features and construct CSV
    featureLayer.queryFeatures(query).then((featureSet) => {
      headers = Object.keys(featureSet.features[0].attributes).join(',');
      console.log(headers)

      for (let i = 0; i < featureSet.features.length; i++) {
        const data = Object.values(featureSet.features[i].attributes).join(',');
        csv += data + '\n';
      }

      csv = headers + '\n' + csv;

      downloadCSV(csv); // Call function to download CSV
    });
  }

  // Function to download CSV file
  function downloadCSV(csv) {
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement("a");
    downloadLink.download = 'search_results.csv';
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  // Rendering component
  return (
    <div className="widget-demo jimu-widget m-2">
      {
        props.useMapWidgetIds &&
        props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent
            useMapWidgetId={props.useMapWidgetIds?.[0]}
            onActiveViewChange={activeViewChangeHandler}
          />
        )
      }
      {mapReady ? 'Map ready' : 'Map not ready'}
      <script src="script.js"></script>
      <div style={insideCard}>
        <form id="myForm">
          <select id="selectLayer" value={inputName} onChange={handleInputChange}>
            <option>Choose a Layer</option>
              {layers.map((layer, index) => (
                <option key={index} value={layer.title}>
                  {layer.title}
                </option>
              ))}
            </select>
        </form>
        <Button style={buttonStyle} onClick={customExportCSV}>Download Data</Button>
      </div>
    </div>
  );
};
export default Widget;
