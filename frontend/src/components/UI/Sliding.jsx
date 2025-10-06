import React, { useEffect, useRef } from "react";
import "../../Sliding.css"
import gsap from "gsap";
import { Link } from "react-router-dom";

const Slider = () => {
  const sliderWrapperRef = useRef();
  const sliderRef = useRef();
  const target = useRef(0);
  const current = useRef(0);
  const maxScroll = useRef(0);
  const ease = 0.075;

  const slideImages = [
    "/assets/images/img1.jpg",
    "/assets/images/img2.jpeg",
    "/assets/images/img3.jpg",
    "/assets/images/img4.avif",
    "/assets/images/img5.jpg",
    "/assets/images/img6.jpg",
    "/assets/images/img7.jpg",
  ];

  // Lerp function
  const lerp = (start, end, factor) => start + (end - start) * factor;

  const updateScaleAndPosition = () => {
    const slides = sliderWrapperRef.current.children;
    Array.from(slides).forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const centerPosition = (rect.left + rect.right) / 2;
      const distanceFromCenter = centerPosition - window.innerWidth / 2;

      let scale, offsetX;

      if (distanceFromCenter > 0) {
        scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
        offsetX = (scale - 1) * 300;
      } else {
        scale = Math.max(0.5, 1 - Math.abs(distanceFromCenter) / window.innerWidth);
        offsetX = 0;
      }

      gsap.set(slide, { scale, x: offsetX });
    });
  };

  const update = () => {
    current.current = lerp(current.current, target.current, ease);
    gsap.set(sliderWrapperRef.current, { x: -current.current });
    updateScaleAndPosition();
    requestAnimationFrame(update);
  };

  useEffect(() => {
    maxScroll.current = sliderWrapperRef.current.offsetWidth - window.innerWidth;
    update();

    const handleResize = () => {
      maxScroll.current = sliderWrapperRef.current.offsetWidth - window.innerWidth;
    };

    const handleWheel = (e) => {
      target.current += e.deltaY;
      target.current = Math.max(0, Math.min(maxScroll.current, target.current));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="slider_cont">
      <div className="logo">
        <Link to="/"> Go Back</Link>
      </div>
      <div className="sidebar">
        <div className="sidebar-item">
          <p id="header">
            ART <br /> ECHO
          </p>
          <p>EXPLORE THE FAMOUS ARTS <br />(Explore ART)</p>
        </div>
        <div className="sidebar-item">
          {/* <p></p>
          <p>Scroll Experience</p> */}
        </div>
      </div>

      <div className="slider" ref={sliderRef}>
        <div className="slider-wrapper" ref={sliderWrapperRef}>
          {slideImages.map((img, index) => (
            <div className="slide" key={index}>
              <img src={img} alt={`slide-${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;