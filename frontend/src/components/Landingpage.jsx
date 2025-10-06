import React from "react";
import HeroSection from "./Hero";
import FeaturesSection from "./Features";
import HowItWorksSection from "./Howworks";
import FAQSection from "./Faqs";
import FooterCTA from "./Footer";
import Rotating3DGallery from "./Threedgallery";
import Navigation from "./Navigation";
// import other sections you want



const LandingPage = () => {
  return (
    <> 

    <Navigation></Navigation>
      
         <HeroSection />

       <FeaturesSection />
      
      
       <Rotating3DGallery></Rotating3DGallery> 
      <HowItWorksSection />
      <FAQSection />
      <FooterCTA />  
      
    </>
  );
};

export default LandingPage;