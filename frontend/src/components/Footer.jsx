import { IoMdMail } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "../Foot.css";

const FooterCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="footer-cta">
      {/* Background Layers */}
      <div className="footer-gradient" />
      <div className="footer-pattern" />

      <div className="footer-container">
        <div className="footer-content">
          {/* Icon */}
          <div className="footer-icon">
            <IoMdMail />
          </div>

          {/* Headline */}
          <h2 className="footer-title">
            Ready to Inspire and Get Discovered?
          </h2>

          {/* Subheadline */}
          <p className="footer-subtitle">
            Join thousands of artists showcasing their creativity and building their audience
          </p>

          {/* CTA Buttons */}
          <div className="footer-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/auth")}>
              Sign Up Free
            </button>
         
          </div>

          {/* Social Signup */}
          <div className="footer-social">
            <p>Or sign up with:</p>
            <div className="social-buttons">
              <button>Google</button>
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;