import React from "react";
import "../support.css";

const ContactSupport = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2>Contact Our Support Team</h2>
        <p>We’re here to help! Reach out to us anytime.</p>

        {/* Contact Info */}
        <div className="contact-info">
          <p>Email: <a href="sumii123@gmail.com">support@artecho.com</a></p>
          <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
        </div>

        {/* Contact Form */}
        <form className="contact-form">
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