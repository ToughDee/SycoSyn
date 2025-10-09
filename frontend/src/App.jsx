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
import UserProfileTest from "./components/Dashboard/Other-user";
import ArtDetail from "./components/Gallery/Artdetail";

import "./index.css";
import { AuthProvider } from "./Store/Authcontext";
import BoardPage1 from "./components/Dashboard/BoardPage";
import { BoardsProvider } from "./Store/BoardContext";

function App() {
  return (
    <AuthProvider>
    <UploadsProvider>
      <BookmarksProvider>
         <BoardsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/slider" element={<Slider />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/support" element={<ContactSupport />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/user-profile" element={<Dashboard />} />
            <Route path="/upload-artworks" element={<UploadArtForm />} />
            <Route path="/user/:userId" element={<UserProfileTest />} />
             <Route path="/art/:id" element={<ArtDetail />} />
             <Route path="/boards/:id" element={<BoardPage1 />} />
          </Routes>
        </Router>
        </BoardsProvider>
      </BookmarksProvider>
    </UploadsProvider>
    </AuthProvider>
  );
}

export default App;