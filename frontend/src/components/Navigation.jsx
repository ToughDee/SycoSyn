import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../nav.css"; // normal CSS

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Features", id: "features" },
    { label: "Gallery", id: "gallery" },
    { label: "How It Works", id: "how-it-works" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="logo" onClick={() => scrollToSection("hero")}>
          Art-Echo
        </div>

        {/* Desktop Navigation */}
        
        <div className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="nav-link"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="cta-btn">
          <button className="btn-primary" onClick={() => navigate("/auth")}>Sign Up / Login</button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="mobile-link"
            >
              {link.label}
            </button>
          ))}
          <button className="btn-primary mobile-btn" onClick={() => navigate("/auth")} >Sign Up/Login </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;