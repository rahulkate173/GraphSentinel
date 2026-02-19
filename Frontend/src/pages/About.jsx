import React from "react";

const About = () => {
  return (
    <section className="page about-page">
      <h1>About Rift</h1>
      <p>
        Rift is a fraud network exploration tool that turns raw transaction CSV
        data into an interactive graph.
      </p>
      <p>
        It highlights 3-node cycles (fraud rings) in red, so analysts can
        quickly spot suspicious circular flows of money and investigate the
        accounts involved.
      </p>
      <p>
        The system is designed to plug into your backend, accept CSV exports,
        and visualize complex relationships that are hard to see in tables.
      </p>
    </section>
  );
};

export default About;

