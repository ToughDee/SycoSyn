import "../Hero.css"; 
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
    const navigate = useNavigate();

  const heroCards = [
  {
    id: 1,
    title: "Yayoi Kusama",
    desc: "Stunning digital artwork",
    image: "/assets/images/dig1.avif",
  },
  {
    id: 2,
    title: "Jeff Koons",
    desc: "Amazing modern art",
    image: "/assets/images/dig2.avif",
  },
  {
    id: 3,
    title: "Kehinde Wiley",
    desc: "Creative illustrations",
    image: "/assets/images/dig3.avif",
  },
];

  return (
    <section id="hero" className="hero">
      {/* Background */}
      <div className="hero-bg">
        <img src="/assets/images/hero-gallery.jpg" alt="Art Gallery" />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Showcase Your <span className="gradient-text">Creativity</span>
          <br /> to the World
        </h1>

        <p className="hero-subtitle">
          Create, Discover, and Connect – All in One Inspiring Space
        </p>

        {/* Buttons */}
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => navigate("/auth")}> Sign Up Free</button>
          <button className="btn btn-outline"  onClick={() => navigate("/slider")}> Top Artworks</button>
        </div>

        {/* Preview Cards */}
       <div className="hero-cards">
  {heroCards.map((card) => (
    <div key={card.id} className="card">
      <div
        className="card-preview"
        style={{
          backgroundImage: `url(${card.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <h3 className="card-title">{card.title}</h3>
      <p className="card-desc">{card.desc}</p>
    </div>
  ))}
</div>

        {/* Scroll Indicator */}
        <button className="scroll-down" onClick={scrollToFeatures}>
          ↓
        </button>
      </div>
    </section>
  );
};

export default HeroSection;