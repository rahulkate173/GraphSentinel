import React from "react";
import "./Footer.scss";

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <span className="footer-logo">GraphSentinel</span>
      <span className="footer-links">
        <a href="/features">Features</a>
        <a href="/about">About</a>
        <a href="/pricing">Pricing</a>
        <a href="/login">Login</a>
      </span>
      <span className="footer-copy">&copy; {new Date().getFullYear()} GraphSentinel. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;
