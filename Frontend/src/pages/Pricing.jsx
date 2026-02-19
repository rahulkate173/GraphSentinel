import React from "react";

const Pricing = () => {
  return (
    <section className="page pricing-page">
      <h1>Pricing</h1>
      <p>Choose a plan that fits your fraud analytics needs.</p>

      <div className="pricing-grid">
        <div className="pricing-card">
          <h2>Starter</h2>
          <p className="price">Free</p>
          <ul>
            <li>Upload CSVs manually</li>
            <li>Interactive graph view</li>
            <li>Basic cycle detection</li>
          </ul>
        </div>

        <div className="pricing-card featured">
          <h2>Pro</h2>
          <p className="price">₹4,999 / month</p>
          <ul>
            <li>Automated daily CSV ingestion</li>
            <li>Advanced fraud ring analytics</li>
            <li>Exportable JSON reports</li>
            <li>Priority support</li>
          </ul>
        </div>

        <div className="pricing-card">
          <h2>Enterprise</h2>
          <p className="price">Contact us</p>
          <ul>
            <li>Custom data integrations</li>
            <li>Dedicated analyst workspace</li>
            <li>SLA & compliance reporting</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

