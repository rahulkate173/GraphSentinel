import React from "react";
import "./About.scss";

const About = () => (
  <section className="about">
    <h1>About GraphSentinel</h1>
    <p>
      GraphSentinel is a modern web application designed to help businesses detect and prevent fraudulent activities in their financial operations. By leveraging advanced graph analysis and visualization, users can spot suspicious accounts, analyze transaction patterns, and gain actionable insights.
    </p>
    <p>
      The platform supports CSV uploads, interactive graph views, and detailed fraud ring summaries, making it a comprehensive tool for risk management and fraud detection.
    </p>
    <p>
      Built with React, Vite, and Clerk authentication, GraphSentinel offers a seamless and secure user experience.
    </p>
  </section>
);

export default About;


