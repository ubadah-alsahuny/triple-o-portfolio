import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroSection from "./pages/HeroSection/heroSection.jsx"
import LoginPage from "./pages/AuthPages/LoginPage/LoginPage.jsx";
import SignupPage from "./pages/AuthPages/SignupPage/SignupPage.jsx";
import HomePage from "./pages/MainPages/HomePage/HomePage.jsx";
import DesignLibrary from "./pages/MainPages/DesignLibrary/pages/DesignLibrary.jsx";
import Design from "./pages/MainPages/Design/Design.jsx";
import Profile from "./pages/MainPages/Profile/Profile.jsx";
import Gallery from "./pages/MainPages/Gallery/Gallery.jsx";
import Templates from "./pages/MainPages/Templatess/Templates.jsx";
import Home from "./pages/MainPages/Home/Home.jsx";
import HomeProvider from "./providers/HomeProvider.jsx";
import NotFound from "./pages/MainPages/NotFound/NotFound.jsx";

import DesignPreview from "./pages/MainPages/Design/DesignPreview.jsx";
import SharedDesign from "./pages/Shared/SharedDesign.jsx";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HeroSection />} />

        <Route
          path="/home"
          element={
            <HomeProvider>
              <HomePage />
            </HomeProvider>
          }
        >
          <Route path="design-library" element={<DesignLibrary />} />
          <Route path="design">
            <Route index element={<Design />} />
            <Route path=":id" element={<Design />} />
            <Route path=":id/preview" element={<DesignPreview />} />
          </Route>
          <Route path="templates" element={<Templates />} />
          <Route path="profile" element={<Profile />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="home" element={<Home />} />
        </Route>
          <Route path="*" element={<NotFound />} />
        <Route path="/shared/:id" element={<SharedDesign />} />
      </Routes>
    </Router>
  );
};

export default App;
