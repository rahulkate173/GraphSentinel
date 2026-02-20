import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
import apiClient from "../services/api.js";
import "./Graph.scss";

const NetworkGraph = () => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const transactionsRef = useRef([]);

  const [backendData, setBackendData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [fraudRings, setFraudRings] = useState([]);
  const [suspiciousAccounts, setSuspiciousAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------- DATA FETCHING (backend /api/v1/anomalies/results) --------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await apiClient.getResults();
        if (cancelled) return;
        if (data) {
          setBackendData(data);
          setFraudRings(data.fraud_rings || []);
          setSuspiciousAccounts(data.suspicious_accounts || []);
        } else {
          setBackendData({
            suspicious_accounts: [],
            fraud_rings: [],
            summary: { total_accounts_analyzed: 0, suspicious_accounts_flagged: 0, fraud_rings_detected: 0, processing_time_seconds: 0 },
          });
          setFraudRings([]);
          setSuspiciousAccounts([]);
        }
      } catch (err) {
        if (!cancelled) {
          setBackendData({
            suspicious_accounts: [],
            fraud_rings: [],
            summary: { total_accounts_analyzed: 0, suspicious_accounts_flagged: 0, fraud_rings_detected: 0, processing_time_seconds: 0 },
          });
          setFraudRings([]);
          setSuspiciousAccounts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // -------- GRAPH BUILDING --------
  useEffect(() => {
    if (!backendData) return;

    const { suspicious_accounts = [], fraud_rings = [], transactions: backendTransactions = [] } = backendData;

    // Use backend transactions (from CSV) when available; else generate from rings
    const generatedTransactions = [];
    (fraud_rings || []).forEach((ring, rIdx) => {
      const members = ring.member_accounts || [];
      members.forEach((from, i) => {
        const to = members[(i + 1) % members.length];
        generatedTransactions.push({
          transaction_id: `RT-${rIdx}-${i}`,
          sender_id: from,
          receiver_id: to,
          amount: (Math.random() * 5000 + 500).toFixed(2),
          timestamp: new Date().toISOString().slice(0, 19).replace("T", " ")
        });
      });
    });

    const mergedTransactions = backendTransactions.length > 0 ? backendTransactions : generatedTransactions;
    setTransactions(mergedTransactions);
    transactionsRef.current = mergedTransactions;

    const allRingMembers = new Set((fraud_rings || []).flatMap(r => r.member_accounts || []));
    const suspiciousMap = Object.fromEntries((suspicious_accounts || []).map(acc => [acc.account_id, acc]));
    const accountSet = new Set([
      ...(suspicious_accounts || []).map(a => a.account_id),
      ...allRingMembers,
      ...mergedTransactions.flatMap(tx => [tx.sender_id, tx.receiver_id]),
    ]);

    // 1. GENERATE NODES WITH NEON GROUPS
    const nodes = Array.from(accountSet).map(accountId => {
      const suspicious = suspiciousMap[accountId];
      const isInRing = allRingMembers.has(accountId);
      const score = suspicious ? suspicious.suspicion_score : 0;

      let group = "green"; // Default safe
      if (isInRing || score > 90) group = "red";
      else if (score >= 50) group = "orange";

      return {
        id: accountId,
        label: accountId,
        group: group, // Matches our neon configuration
        shape: group === "red" ? "hexagon" : "dot",
        size: group === "red" ? 40 : undefined
      };
    });

    setAllAccounts(nodes.map(n => ({ account_id: n.id })));

    // 2. GENERATE EDGES
    const edges = [];
    const edgeSet = new Set();
    mergedTransactions.forEach(tx => {
      const edgeKey = `${tx.sender_id}-${tx.receiver_id}`;
      if (!edgeSet.has(edgeKey) && accountSet.has(tx.sender_id) && accountSet.has(tx.receiver_id)) {
        edgeSet.add(edgeKey);
        const isFraudEdge = allRingMembers.has(tx.sender_id) && allRingMembers.has(tx.receiver_id);
        edges.push({
          from: tx.sender_id,
          to: tx.receiver_id,
          arrows: "to",
          color: {
            color: isFraudEdge ? "#ff3131" : "#4b5563",
            highlight: isFraudEdge ? "#ff3131" : "#9ca3af",
            hover: "#ffffff"
          },
          width: isFraudEdge ? 3 : 1
        });
      }
    });

    // 3. NETWORK CONFIGURATION (THE "GLOW" LOGIC)
    const options = {
      physics: { enabled: true, stabilization: { iterations: 150 } },
      interaction: { hover: true, tooltipDelay: 200 },
      nodes: {
        font: { color: "#ffffff", size: 14, face: "Inter" },
        borderWidth: 2,
      },
      groups: {
        red: {
          color: { border: "#ff3131", background: "rgba(255, 49, 49, 0.2)" },
          size: 25,
          shadow: { enabled: true, color: "#ff3131", size: 20, x: 0, y: 0 }
        },
        orange: {
        
          color: { border: "#f97316", background: "rgba(249, 115, 22, 0.2)" },
          size: 20,
          shadow: { enabled: true, color: "#f97316", size: 15, x: 0, y: 0 }
        },
        green: {
          color: { border: "#39ff14", background: "rgba(57, 255, 20, 0.1)" },
          size: 15,
          shadow: { enabled: true, color: "#39ff14", size: 10, x: 0, y: 0 }
        }
      }
    };

    if (networkRef.current) networkRef.current.destroy();
    const network = new Network(containerRef.current, { nodes, edges }, options);
    
    network.on("click", params => {
      if (params.nodes.length > 0) {
        const id = params.nodes[0];
        const related = transactionsRef.current.filter(t => t.sender_id === id || t.receiver_id === id);
        setSelectedNode({ id, transactions: related });
      } else {
        setSelectedNode(null);
      }
    });

    networkRef.current = network;
  }, [backendData]);

  const downloadJSON = async () => {
    try {
      const blob = await apiClient.downloadResults();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "money_muling_report.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (backendData) {
        const blob = new Blob([JSON.stringify(backendData, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "fraud_analysis.json";
        link.click();
      }
    }
  };

  if (loading) {
    return (
      <div className="graph-wrapper">
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading analysis results...</div>
      </div>
    );
  }

  return (
    <div className="graph-wrapper">
      <button onClick={downloadJSON} className="download-btn" disabled={!backendData}>Download JSON Output</button>
      <div className="network-area-wrapper">
        <div ref={containerRef} className="network-area" />
        <div
          className="resize-handle"
          onMouseDown={e => {
            const startY = e.clientY;
            const startHeight = containerRef.current.offsetHeight;
            const onMouseMove = moveEvent => {
              const newHeight = Math.max(200, startHeight + (moveEvent.clientY - startY));
              containerRef.current.style.height = newHeight + 'px';
            };
            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
        />
      </div>

      {selectedNode && (
        <div className="side-panel">
          <div className="panel-header">
            <h3>Account {selectedNode.id}</h3>
            <button className="close-btn" onClick={() => setSelectedNode(null)}>✕</button>
          </div>
          {selectedNode.transactions.length > 0 ? (
            selectedNode.transactions.map(tx => (
              <div key={tx.transaction_id} className="tx-card">
                <p><b>ID:</b> {tx.transaction_id}</p>
                <p><b>Sender:</b> {tx.sender_id}</p>
                <p><b>Receiver:</b> {tx.receiver_id}</p>
                <p><b>Amount:</b> ₹{tx.amount}</p>
                <p><b>Time:</b> {tx.timestamp}</p>
                <hr />
              </div>
            ))
          ) : <p>No transactions found.</p>}
        </div>
      )}

      <div className="ring-table">
        <h2>Fraud Ring Summary</h2>
        <table>
          <thead>
            <tr><th>Ring ID</th><th>Pattern</th><th>Risk</th><th>Members</th></tr>
          </thead>
          <tbody>
            {fraudRings.map(r => (
              <tr key={r.ring_id}>
                <td>{r.ring_id}</td>
                <td>{r.pattern_type}</td>
                <td><span style={{color: '#ff3131'}}>{r.risk_score}</span></td>
                <td>{r.member_accounts?.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NetworkGraph;





// import React, { useEffect, useRef, useState } from "react";
// import { Network } from "vis-network";
// import Papa from "papaparse";
// import "vis-network/styles/vis-network.css";
// import "./Graph.scss";

// const NetworkGraph = () => {
//   const containerRef = useRef(null);
//   const networkRef = useRef(null);

//   const [accounts, setAccounts] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [rings, setRings] = useState([]);
//   const [suspiciousAccounts, setSuspiciousAccounts] = useState([]);

//   // -------- FETCH CSV FROM BACKEND --------
//   useEffect(() => {
//     fetch("/accounts.csv")
//       .then(res => res.text())
//       .then(csv => {
//         const parsed = Papa.parse(csv, {
//           header: true,
//           skipEmptyLines: true
//         });
//         setAccounts(parsed.data);
//       });

//     fetch("/transactions.csv")
//       .then(res => res.text())
//       .then(csv => {
//         const parsed = Papa.parse(csv, {
//           header: true,
//           skipEmptyLines: true
//         });
//         setTransactions(parsed.data);
//       });
//   }, []);

//   // -------- BUILD GRAPH --------
//   useEffect(() => {
//     if (!accounts.length || !transactions.length) return;

//     // ----- Detect Rings (Cycle of 3) -----
//     const graphMap = {};
//     transactions.forEach(tx => {
//       graphMap[tx.sender_id] = graphMap[tx.sender_id] || [];
//       graphMap[tx.sender_id].push(tx.receiver_id);
//     });

//     const detectedRings = [];
//     accounts.forEach(a => {
//       const first = graphMap[a.account_id] || [];
//       first.forEach(b => {
//         const second = graphMap[b] || [];
//         second.forEach(c => {
//           if ((graphMap[c] || []).includes(a.account_id)) {
//             const members = [a.account_id, b, c].sort();
//             const exists = detectedRings.some(r =>
//               JSON.stringify(r.members.sort()) === JSON.stringify(members)
//             );
//             if (!exists) {
//               detectedRings.push({
//                 ring_id: `RING_${detectedRings.length + 1}`,
//                 pattern_type: "Cycle_3",
//                 members,
//                 risk_score: 95
//               });
//             }
//           }
//         });
//       });
//     });

//     setRings(detectedRings);

//     const ringMembers = new Set(
//       detectedRings.flatMap(r => r.members)
//     );

//     // ---- Suspicious Accounts ----
//     const suspicious = accounts
//       .filter(
//         acc =>
//           parseFloat(acc.threshold) > 0.7 ||
//           ringMembers.has(acc.account_id)
//       )
//       .map(acc => ({
//         account_id: acc.account_id,
//         suspicion_score: parseFloat(acc.threshold) * 100,
//         detected_patterns: ringMembers.has(acc.account_id)
//           ? ["Cycle_3"]
//           : [],
//         ring_id: ringMembers.has(acc.account_id)
//           ? detectedRings.find(r =>
//               r.members.includes(acc.account_id)
//             )?.ring_id
//           : null
//       }))
//       .sort((a, b) => b.suspicion_score - a.suspicion_score);

//     setSuspiciousAccounts(suspicious);

//     // ----- Build Nodes -----
//     const nodes = accounts.map(acc => {
//       const threshold = parseFloat(acc.threshold);
//       const inRing = ringMembers.has(acc.account_id);

//       let color = "green";
//       if (inRing) color = "red";
//       else if (threshold < 0.5) color = "green";
//       else if (threshold <= 0.7) color = "blue";
//       else color = "orange";

//       return {
//         id: acc.account_id,
//         label: acc.account_id,
//         color,
//         size: inRing ? 30 : 18,
//         borderWidth: inRing ? 4 : 1
//       };
//     });

//     const edges = transactions.map(tx => ({
//       from: tx.sender_id,
//       to: tx.receiver_id,
//       arrows: "to"
//     }));

//     if (networkRef.current) networkRef.current.destroy();

//     const network = new Network(
//       containerRef.current,
//       { nodes, edges },
//       {
//         physics: { stabilization: false }
//       }
//     );

//     network.on("click", params => {
//       if (params.nodes.length > 0) {
//         const id = params.nodes[0];
//         const related = transactions.filter(
//           tx =>
//             tx.sender_id === id ||
//             tx.receiver_id === id
//         );
//         setSelectedNode({ id, transactions: related });
//       }
//     });

//     networkRef.current = network;
//   }, [accounts, transactions]);

//   // -------- DOWNLOAD JSON --------
//   const downloadJSON = () => {
//     const output = {
//       suspicious_accounts: suspiciousAccounts,
//       fraud_rings: rings,
//       summary: {
//         total_accounts_analyzed: accounts.length,
//         suspicious_accounts_flagged: suspiciousAccounts.length,
//         fraud_rings_detected: rings.length,
//         processing_time_seconds: 1.8
//       }
//     };

//     const blob = new Blob([JSON.stringify(output, null, 2)], {
//       type: "application/json"
//     });

//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "fraud_output.json";
//     link.click();
//   };

//   return (
//     <div className="graph-wrapper">
//       <button onClick={downloadJSON} className="download-btn">
//         Download JSON Output
//       </button>

//       <div ref={containerRef} className="network-area" />

//       {selectedNode && (
//         <div className="side-panel">
//           <div className="panel-header">
//             <h3>{selectedNode.id}</h3>
//             <button
//               className="close-btn"
//               onClick={() => setSelectedNode(null)}
//             >
//               ✕
//             </button>
//           </div>

//           {selectedNode.transactions.map(tx => (
//             <div key={tx.transaction_id} className="tx-card">
//               <p><b>ID:</b> {tx.transaction_id}</p>
//               <p><b>Sender:</b> {tx.sender_id}</p>
//               <p><b>Receiver:</b> {tx.receiver_id}</p>
//               <p><b>Amount:</b> ₹{tx.amount}</p>
//               <p><b>Time:</b> {tx.timestamp}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* RING TABLE */}
//       <div className="ring-table">
//         <h2>Fraud Ring Summary</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Ring ID</th>
//               <th>Pattern</th>
//               <th>Members</th>
//               <th>Risk</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rings.map(r => (
//               <tr key={r.ring_id}>
//                 <td>{r.ring_id}</td>
//                 <td>{r.pattern_type}</td>
//                 <td>{r.members.join(", ")}</td>
//                 <td>{r.risk_score}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default NetworkGraph;
