# 🗺️ CSV Map Layer Exporter

## Overview
**Interactive Map Layer Exporter** is a React-powered feature that enables users to interact with a map, select a specific layer, and export its data in CSV format. This tool streamlines the extraction and analysis of geospatial information, making it more accessible for researchers, analysts, and developers.

## 🚀 Features

### 🔍 Layer Selection
- Users can select a layer from a dropdown menu populated with available layers from the map.

### 📤 Data Export
- Once a layer is selected, users can click a button to export its data to a CSV file for further analysis.

### ⚙️ Dynamic Query Handling
- The widget intercepts and processes map queries, allowing users to filter data based on specific criteria before exporting.

## 🎯 Use Cases
- **Geospatial Data Analysis**: Easily extract and analyze layers from maps.
- **Urban Planning & Research**: Export specific map layers for infrastructure planning.
- **Environmental Studies**: Retrieve and analyze spatial data for ecological research.
- **Data Visualization**: Convert geospatial data into CSV for further visualization in tools like Excel or Tableau.

## 🛠️ Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/map-layer-exporter.git
   ```
2. Navigate to the project directory:
   ```sh
   cd map-layer-exporter
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm start
   ```

## 🏗️ How It Works
1. Load the map component in your ArcGIS Experience Builder application.
2. Select a layer from the dropdown menu.
3. Click the **Export CSV** button.
4. The widget processes map queries and filters data.
5. A CSV file with the selected layer’s data is generated and downloaded.

## 🛠️ Technologies Used
- **React / TypeScript**: Frontend framework
- **ArcGIS Experience Builder**: For map rendering

