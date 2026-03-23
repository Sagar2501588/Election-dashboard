// import React, { useEffect, useState } from "react";
// import "./Home.css";

// const ResultPanel = ({ selectedFeature }) => {
//   const [liveResults, setLiveResults] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchLiveResults = async () => {
//     try {
//       const res = await fetch(
//         "https://results.eci.gov.in/ResultAcGenNov2025/election-json-S04-live.json"
//       );
//       const data = await res.json();

//       setLiveResults(data?.AC || []); // Many ECI APIs store AC results under "AC"
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching live results:", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLiveResults();

//     const interval = setInterval(fetchLiveResults, 30000); // Auto-refresh every 30 sec
//     return () => clearInterval(interval);
//   }, []);

//   if (!selectedFeature) {
//     return (
//       <div className="panel details-panel-3">
//         <h3>RESULT</h3>
//         <p>Select an AC to view results.</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="panel details-panel-3">
//         <h3>RESULT</h3>
//         <p>Loading live results...</p>
//       </div>
//     );
//   }

//   const acName = selectedFeature.properties.AC_NAME;

//   // Match result with AC name
//   const acResult = liveResults?.find((item) => item.AC_NAME === acName);

//   return (
//     <div className="panel details-panel-3">
//       <h3>{acName} — Live Result</h3>

//       {!acResult ? (
//         <p>No result available for this AC yet.</p>
//       ) : (
//         <div className="result-box">
//           <p><b>Leading Candidate:</b> {acResult.LEAD_CANDIDATE || "—"}</p>
//           <p><b>Leading Party:</b> {acResult.LEAD_PARTY || "—"}</p>
//           <p><b>Trailing Candidate:</b> {acResult.TRAIL_CANDIDATE || "—"}</p>
//           <p><b>Trailing Party:</b> {acResult.TRAIL_PARTY || "—"}</p>
//           <p><b>Margin:</b> {acResult.MARGIN || "—"}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResultPanel;


import React from "react";
import "./Home.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const ResultPanel = ({ selectedFeature }) => {

  if (!selectedFeature) {
    return (
      <div className="panel details-panel-3">
        <h3>RESULT</h3>
        <p>Select an AC to view results.</p>
      </div>
    );
  }

  const p = selectedFeature.properties;

  const data = [
    { name: "AITC", value: p.Aitc_perce || 0 },
    { name: "LEFT+INC", value: p.Left_INC_p || 0 },
    { name: "BJP", value: p.BJP_percen || 0 }
  ];

  const COLORS = ["#2ecc71", "#e74c3c", "#ff8a00"];

  return (
    <div className="panel details-panel-3">

      <h3>{p.Constituen || p.AC_NAME} — Vote Share</h3>

      {/* 🔥 MAIN LAYOUT */}
      <div style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        justifyContent: "space-between"
      }}>

        {/* 📊 PIE CHART */}
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* 📋 PARTY TABLE */}
        <table style={{
          width: "100%",
          maxWidth: "260px",
          borderCollapse: "collapse",
          fontSize: "20px",
          color: "white"
        }}>

          <thead>
            <tr>
              <th style={{ padding: "6px" }}>Party</th>
              <th>Votes</th>
              <th>%</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#2ecc71" }}>■ AITC</td>
              <td>{p.AITC_Vote}</td>
              <td>{p.Aitc_perce}%</td>
            </tr>

            <tr>
              <td style={{ color: "#e74c3c" }}>■ LEFT+INC</td>
              <td>{p.Left_INC_V}</td>
              <td>{p.Left_INC_p}%</td>
            </tr>

            <tr>
              <td style={{ color: "#ff8a00" }}>■ BJP</td>
              <td>{p.BJP_Vote}</td>
              <td>{p.BJP_percen}%</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* 📊 EXTRA INFO */}
      <div style={{
        marginTop: "10px",
        borderTop: "1px solid #444",
        paddingTop: "8px",
        textAlign: "center"
      }}>
        <b>Total Electors: {p.TOTAL_ELEC}</b>
      </div>

    </div>
  );
};

export default ResultPanel;