import React from "react";
import "./Features.scss";

const features = [
  {
    icon: "🔒",
    title: "Authentication",
    desc: "Secure OAuth sign-in with Google, Facebook, GitHub, Microsoft, and Mobile using Clerk.",
  },
  {
    icon: "📁",
    title: "CSV Upload",
    desc: "Easily upload transaction files for fraud analysis and visualization.",
  },
  {
    icon: "🕸️",
    title: "Graph Visualization",
    desc: "Interactive network graph highlighting suspicious accounts and fraud rings.",
  },
  {
    icon: "🛑",
    title: "Fraud Ring Summary",
    desc: "Table view of detected fraud rings and their risk scores for quick review.",
  },
  {
    icon: "⬇️",
    title: "Download JSON",
    desc: "Export analysis results as JSON for further review or reporting.",
  },
  {
    icon: "💡",
    title: "Informational Pages",
    desc: "Dedicated Pricing and About pages for user guidance and transparency.",
  },
];

const Features = () => (
  <section className="features">
    <h1>Features</h1>
    <div className="features-grid">
      {features.map((f, i) => (
        <div className="feature-card" key={i}>
          <div className="feature-icon">{f.icon}</div>
          <h2>{f.title}</h2>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;
