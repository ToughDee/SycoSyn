import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import LandingPage from "./components/Landingpage";
import Slider from "./components/UI/Sliding";
import AuthForm from "./components/AuthForm";
import ContactSupport from "./components/Contactsupport";
import Gallery from "./components/Gallery/Gallery";
import Dashboard from "./components/Dashboard/DashBoard";
import UploadArtForm from "./components/Dashboard/UploadArt";

import { UploadsProvider } from "./Store/UploadsContext";
import { BookmarksProvider } from "./Store/BookmarksContext";

import "./index.css";

function App() {
  return (
    <UploadsProvider>
      <BookmarksProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/slider" element={<Slider />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/support" element={<ContactSupport />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/user-profile" element={<Dashboard />} />
            <Route path="/upload-artworks" element={<UploadArtForm />} />
          </Routes>
        </Router>
      </BookmarksProvider>
    </UploadsProvider>
  );
}

export default App;