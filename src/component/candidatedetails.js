import React from "react";
import "./Home.css";

/* ---------------------------------------------------
   PARTY → SYMBOL PNG MAPPING (WB focused)
--------------------------------------------------- */
const partySymbols = {
  "AITC": process.env.PUBLIC_URL + "/party-symbols/AITC.png",
  "BJP": process.env.PUBLIC_URL + "/party-symbols/BJP.png",
  "INC": process.env.PUBLIC_URL + "/party-symbols/INC.png",
  "CPM": process.env.PUBLIC_URL + "/party-symbols/CPM.png",
  "CPI(M)": process.env.PUBLIC_URL + "/party-symbols/CPM.png"
};

const CandidateDetails = ({ selectedFeature }) => {

  // No AC selected
  if (!selectedFeature) {
    return (
      <div className="panel details-panel-2">
        <h3>Candidate Details</h3>
        <p>Select an AC to view details.</p>
      </div>
    );
  }

  const p = selectedFeature.properties;

  // 🔹 Party symbols
  const aitcSymbol = partySymbols["AITC"];
  const bjpSymbol = partySymbols["BJP"];

  // Left+INC dynamic (based on your data Field8)
  const leftParty = p.Field8 || "INC";
  const leftSymbol = partySymbols[leftParty] || partySymbols["INC"];

  return (
    <div className="panel details-panel-2 candidate-table-panel">

      {/* AC Title */}
      <h3 className="table-title">
        {p.Constituen || p.AC_NAME} — Candidate Details
      </h3>

      {/* Candidate Table */}
      <table className="candidate-table">

        {/* HEADER */}
        <thead>
          <tr>
            <th className="aitc-header">AITC</th>
            <th className="left-header">LEFT + INC</th>
            <th className="bjp-header">BJP</th>
          </tr>
        </thead>

        <tbody>

          {/* Candidate Name Row */}
          <tr>
            <td>{p.AITC || "—"}</td>
            <td>{p.Left_INC || "—"}</td>
            <td>{p.BJP || "—"}</td>
          </tr>

          {/* Party Row */}
          <tr>
            <td>AITC</td>
            <td>{leftParty}</td>
            <td>BJP</td>
          </tr>

          {/* SYMBOL ROW */}
          <tr>
            <td>
              {aitcSymbol ? (
                <img src={aitcSymbol} alt="AITC" className="party-symbol" />
              ) : "—"}
            </td>

            <td>
              {leftSymbol ? (
                <img src={leftSymbol} alt={leftParty} className="party-symbol" />
              ) : "—"}
            </td>

            <td>
              {bjpSymbol ? (
                <img src={bjpSymbol} alt="BJP" className="party-symbol" />
              ) : "—"}
            </td>
          </tr>

        </tbody>

      </table>



    </div>
  );
};

export default CandidateDetails;