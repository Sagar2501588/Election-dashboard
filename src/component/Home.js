import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Home.css";
import CandidateDetails from "./candidatedetails";
import ResultPanel from "../component/ResultPanel";



mapboxgl.accessToken = "pk.eyJ1Ijoicm95YWtzaGF5IiwiYSI6ImNtaG4xajNkbTBoejQya3NqdTJvcnNxdGYifQ.E28RXpfwqtYaSvlLN_E00A";

const Home = () => {
    const [map, setMap] = useState(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [year, setYear] = useState("2016");


    useEffect(() => {
        const m = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [88.36907907211028, 22.564532281665844],
            zoom: 11.8,
        });

        m.addControl(new mapboxgl.NavigationControl());
        setMap(m);

//         m.on("load", () => {
//             fetch(process.env.PUBLIC_URL + `/data/wb-${year}.geojson`)
//                 .then((res) => res.json())
//                 .then((data) => {
//                     setGeojsonData(data);

//                     m.addSource(`wb-${year}`, {
//                         type: "geojson",
//                         data,
//                     });

//                     // Base polygons
//                     m.addLayer({
//                         id: "wb-layer",
//                         type: "fill",
//                         source: `wb-${year}`,
//                         paint: {
//                             "fill-color": "#ff6600",
//                             "fill-opacity": 0.4,
//                         },
//                     });

//                     // Base outline
//                     m.addLayer({
//                         id: "wb-outline",
//                         type: "line",
//                         source: `wb-${year}`,
//                         paint: {
//                             "line-color": "#cc3300",
//                             "line-width": 1,
//                         },
//                     });

//                     // Highlight polygon
//                     m.addLayer({
//                         id: "selected-ac",
//                         type: "fill",
//                         source: `wb-${year}`,
//                         paint: {
//                             "fill-color": "#00eaff",
//                             "fill-opacity": 0.75,
//                         },
//                         filter: ["==", "AC_NAME", ""],
//                     });

//                     // Highlight outline
//                     m.addLayer({
//                         id: "selected-outline",
//                         type: "line",
//                         source: `wb-${year}`,
//                         paint: {
//                             "line-color": "#ffffff",
//                             "line-width": 2,
//                         },
//                         filter: ["==", "AC_NAME", ""],
//                     });
//                 });

//                         m.on("click", "wb-layer", (e) => {
//     if (!e.features || !e.features.length) return;

//     const feature = e.features[0];
//     handleSelect(feature);
// });

// m.on("mouseenter", "wb-layer", () => {
//     m.getCanvas().style.cursor = "pointer";
// });

// m.on("mouseleave", "wb-layer", () => {
//     m.getCanvas().style.cursor = "";
// });

//         });



m.on("load", () => {
  fetch(process.env.PUBLIC_URL + `/data/wb-${year}.geojson`)
    .then((res) => res.json())
    .then((data) => {
      setGeojsonData(data);

      m.addSource(`wb-${year}`, {
        type: "geojson",
        data,
      });

      m.addLayer({
        id: "wb-layer",
        type: "fill",
        source: `wb-${year}`,
        paint: {
          "fill-color": "#ff6600",
          "fill-opacity": 0.4,
        },
      });

      m.addLayer({
        id: "wb-outline",
        type: "line",
        source: `wb-${year}`,
        paint: {
          "line-color": "#cc3300",
          "line-width": 1,
        },
      });

      m.addLayer({
        id: "selected-ac",
        type: "fill",
        source: `wb-${year}`,
        paint: {
          "fill-color": "#00eaff",
          "fill-opacity": 0.75,
        },
        filter: ["==", "AC_NAME", ""],
      });

      m.addLayer({
        id: "selected-outline",
        type: "line",
        source: `wb-${year}`,
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
        },
        filter: ["==", "AC_NAME", ""],
      });

      // ✅ CORRECT PLACE (AFTER layers added)
      m.on("click", "wb-layer", (e) => {
        if (!e.features || !e.features.length) return;

        const feature = e.features[0];
        handleSelect(feature);
      });

      m.on("mouseenter", "wb-layer", () => {
        m.getCanvas().style.cursor = "pointer";
      });

      m.on("mouseleave", "wb-layer", () => {
        m.getCanvas().style.cursor = "";
      });

    });
});
        return () => m.remove();
    }, [year]);

    // 🔍 SEARCH HANDLER
    const handleSearch = (text) => {
        if (!geojsonData || !map) return;

        const value = text.trim().toLowerCase();

        if (!value) {
            setSuggestions([]);

            // Restore full map
            map.setPaintProperty("wb-layer", "fill-opacity", 0.4);
            map.setPaintProperty("wb-outline", "line-opacity", 1);

            map.setFilter("selected-ac", ["==", "AC_NAME", ""]);
            map.setFilter("selected-outline", ["==", "AC_NAME", ""]);
            return;
        }

        const matches = geojsonData.features.filter((f) => {
            const name = f.properties.AC_NAME || "";
            return name.toLowerCase().includes(value);
        });

        setSuggestions(matches.slice(0, 8));
    };

    // ⭐ SELECT → FIT + HIGHLIGHT + POPUP
    // const handleSelect = (feature) => {
    //     setSuggestions([]);

    //     const coords = feature.geometry.coordinates;
    //     const bounds = new mapboxgl.LngLatBounds();

    //     // Handle MultiPolygon + Polygon
    //     const polygons = Array.isArray(coords[0][0][0]) ? coords : [coords];

    //     polygons.forEach((poly) => {
    //         poly[0].forEach((c) => bounds.extend(c));
    //     });

    //     const center = bounds.getCenter();

    //     // Hide all others
    //     map.setPaintProperty("wb-layer", "fill-opacity", 0);
    //     map.setPaintProperty("wb-outline", "line-opacity", 0);

    //     // Show selected only
    //     map.setFilter("selected-ac", [
    //         "==",
    //         "AC_NAME",
    //         feature.properties.AC_NAME,
    //     ]);
    //     map.setFilter("selected-outline", [
    //         "==",
    //         "AC_NAME",
    //         feature.properties.AC_NAME,
    //     ]);

    //     // Perfect zoom → not too close
    //     map.fitBounds(bounds, {
    //         padding: 80,
    //         maxZoom: 12,
    //         duration: 1000,
    //     });

    //     // Popup
    //     new mapboxgl.Popup()
    //         .setLngLat(center)
    //         .setHTML(`
    //     <h3>${feature.properties.AC_NAME}</h3>
    //     <p><b>AC No:</b> ${feature.properties.AC_NO}</p>
    //     <p><b>District:</b> ${feature.properties.DIST_NAME}</p>
    //   `)
    //         .addTo(map);

    //     setSelectedFeature(feature);

    // };

    const handleSelect = (feature) => {
    if (!map) return;   // 🔥 FIX

    setSuggestions([]);

    const coords = feature.geometry.coordinates;
    const bounds = new mapboxgl.LngLatBounds();

    const polygons = Array.isArray(coords[0][0][0]) ? coords : [coords];

    polygons.forEach((poly) => {
        poly[0].forEach((c) => bounds.extend(c));
    });

    const center = bounds.getCenter();

    map.setPaintProperty("wb-layer", "fill-opacity", 0);
    map.setPaintProperty("wb-outline", "line-opacity", 0);

    map.setFilter("selected-ac", [
        "==",
        "AC_NAME",
        feature.properties.AC_NAME,
    ]);

    map.setFilter("selected-outline", [
        "==",
        "AC_NAME",
        feature.properties.AC_NAME,
    ]);

    map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 12,
        duration: 1000,
    });

    new mapboxgl.Popup()
        .setLngLat(center)
        .setHTML(`
            <h3>${feature.properties.AC_NAME}</h3>
            <p><b>AC No:</b> ${feature.properties.AC_NO}</p>
            <p><b>District:</b> ${feature.properties.DIST_NAME}</p>
        `)
        .addTo(map);

    setSelectedFeature(feature);
};

    return (
        <div className="dashboard">
            <div className="navbar">WestBengal Election Insight Dashboard</div>

            <div className="main-layout">
                {/* MAP */}
                <div className="map-container">
                    <div id="map"></div>
                </div>

                {/* RIGHT PANELS */}
                <div className="right-panels">
                    {/* FILTER */}
                    <div className="panel" id="filterBox">
                        <h3>Search Your Assembly Constituency</h3>
                        <input
                            type="text"
                            placeholder="Search AC..."
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={(e) => handleSearch(e.target.value)}
                        />

                        {suggestions.length > 0 && (
                            <div className="suggestion-box">
                                {suggestions.map((s, i) => (
                                    <div
                                        key={i}
                                        className="suggestion-item"
                                        onClick={() => handleSelect(s)}
                                    >
                                        {s.properties.AC_NAME}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 🔽 YEAR SELECTOR */}
                    <select
                        className="year-select"
                        value={year}
                        onChange={(e) => {
                            setYear(e.target.value);
                            setSelectedFeature(null);
                            setSuggestions([]);
                        }}
                    >
                        <option value="2016">2016 Election</option>
                        <option value="2021">2021 Election</option>
                        <option value="2026">2026 (Upcoming)</option>
                    </select>

                    {/* CANDIDATE DETAILS */}
                    <CandidateDetails selectedFeature={selectedFeature} />
                    <ResultPanel selectedFeature={selectedFeature} />
                </div>
            </div>
        </div>
    );
};

export default Home;
