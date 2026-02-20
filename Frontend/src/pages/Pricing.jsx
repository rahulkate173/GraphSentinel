import React, { useState } from "react";
import "./Pricing.scss";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [activePlan, setActivePlan] = useState("pro"); // default active

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: yearly ? "9,999" : "999",
      features: [
        "CSV Upload (10K transactions)",
        "Cycle Detection",
        "Basic Graph Visualization",
        "JSON Export",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: yearly ? "24,999" : "2,499",
      features: [
        "Up to 100K transactions",
        "Smurfing & Shell Detection",
        "Time-based Replay",
        "Advanced Risk Scoring",
        "Priority Support",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited Transactions",
        "ISO 20022 Integration",
        "API Access",
        "Dedicated Analyst Dashboard",
        "24/7 Support",
      ],
    },
  ];

  return (
    <section className="pricing">
      <div className="pricing__cards">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card ${activePlan === plan.id ? "active" : ""}`}
            onClick={() => setActivePlan(plan.id)}
          >
            {plan.id === "pro" && (
              <div className="badge">Most Popular</div>
            )}

            <h3>{plan.name}</h3>
            <h2>
              {plan.price === "Custom"
                ? "Custom"
                : `₹${plan.price}`}
              {plan.price !== "Custom" && <span>/mo</span>}
            </h2>

            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <button className="btn">Select Plan</button>
          </div>
        ))}
      </div>
    </section>
  );
}