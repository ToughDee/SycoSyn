import "../Features.css";
import { 
  FaUser, 
  FaUpload, 
  FaFolderOpen, 
  FaHeart, 
  FaSearch, 
  FaTachometerAlt, 
  FaMagic, 
  FaTags, 
  FaUsers 
} from "react-icons/fa";

const FeaturesSection = () => {
  const basicFeatures = [
    {
      icon: <FaUser size={35} color="#6366f1" />,
      title: "Artist Profiles",
      description: "Create your unique profile and showcase your artistic identity",
    },
    {
      icon: <FaUpload size={35} color="#6366f1" />,
      title: "Upload & Showcase",
      description: "Easily upload and display your creative works to the world",
    },
    {
      icon: <FaFolderOpen size={35} color="#6366f1" />,
      title: "Organize Works",
      description: "Create boards and collections to organize your portfolio",
    },
    {
      icon: <FaHeart size={35} color="#6366f1" />,
      title: "Like & Bookmark",
      description: "Save and organize your favorite artworks from other creators",
    },
    {
      icon: <FaSearch size={35} color="#6366f1" />,
      title: "Easy Discovery",
      description: "Find artwork through intuitive search and categorization",
    },
    {
      icon: <FaTachometerAlt size={35} color="#6366f1" />,
      title: "User Dashboard",
      description: "Manage your profile, works, and engagement in one place",
    },
  ];

  const advancedFeatures = [
    {
      icon: <FaMagic size={35} color="#f59e0b" />,
      title: "AI Recommendations",
      description: "Get personalized suggestions based on your interests",
    },
    {
      icon: <FaTags size={35} color="#f59e0b" />,
      title: "Smart Tagging",
      description: "Automatic AI-powered categorization and tagging",
    },
    {
      icon: <FaUsers size={35} color="#f59e0b" />,
      title: "Social Features",
      description: "Comments, collaborations, and group collections",
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        <h2>Everything You Need to Thrive</h2>
        <p>From basic portfolio management to advanced AI features</p>

        <div className="basic-features">
          {basicFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <h3>Advanced Features</h3>
        <p>Powered by cutting-edge AI technology</p>

        <div className="advanced-features">
          {advancedFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;