
import React from "react";
import Spline from "@splinetool/react-spline";
import "./Home.scss";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home">
      <div className="hero">
        <div className="hero-left">
          <div className="tag">Fraud Detection</div>

          <h1>
            Spot suspicious activity before it costs your business
          </h1>

          <p>
            Automatically detect risky behavior and prevent fraud
            operations before transactions take place.
          </p>

          {/* <button className="cta">
           
          </button> */}
          <Link  to="/login" className="secondary-btn cta">
              Get Started →
            </Link>
        </div>

        <div className="hero-right">
          <Spline scene="https://prod.spline.design/ezuHoP10ut-qcydA/scene.splinecode" />
        </div>
      </div>
    </section>
  );
};

export default Home;
