import React from "react";
import "../support.css";
import { useNavigate } from "react-router-dom";

const ContactSupport = () => {
  const navigate = useNavigate();

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert("✅ Your message has been sent!");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <section id="contact" className="contact-section">
      {/* Back Button */}
      <button className="back-btn" onClick={handleBack}>
        ← Back
      </button>

      <div className="contact-container">
        <h2>Contact Our Support Team</h2>
        <p>We’re here to help! Reach out to us anytime.</p>

        {/* Contact Info */}
        <div className="contact-info">
          <p>Email: <a href="mailto:support@artecho.com">unwantedme752@gmail.com</a></p>
          <p>Phone: <a href="tel:+1234567890">+91 8767966452</a></p>
        </div>

        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSendMessage}>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="How can we help you?" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default ContactSupport;