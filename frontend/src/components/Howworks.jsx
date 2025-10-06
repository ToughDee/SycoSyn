
import { useNavigate } from "react-router-dom";
import "../How.css"
const HowItWorksSection = () => {
  const steps = [
    {
      icon: "👤",
      title: "Sign Up & Create Profile",
      description: "Join our community and set up your artist profile in minutes",
    },
    {
      icon: "🖼️",
      title: "Upload Your Artworks",
      description: "Share your creative works with the world in high quality",
    },
    {
      icon: "📈",
      title: "Connect & Grow",
      description: "Build your audience, collaborate, and get discovered",
    },
  ];

  const navigate=useNavigate();

  return (
    <section  id="how-it-works" className="how-section">
      <div className="how-container">
        {/* Header */}
        <div className="how-header">
          <h2>
            Get Started in <span className="highlight">3 Simple Steps</span>
          </h2>
          <p>Your creative journey begins here</p>
        </div>

        {/* Steps */}
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <div className="step-number">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta">
          <button onClick={() => navigate("/auth")}>Start Your Journey Today</button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;