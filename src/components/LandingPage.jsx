import Topbar from "./layout/Topbar.jsx";
import Footer from "./layout/Footer.jsx";
import ProductDock from "./layout/ProductDock.jsx";
import Hero from "./sections/Hero.jsx";
import StatsRow from "./sections/StatsRow.jsx";
import TrustBand from "./sections/TrustBand.jsx";
import RoiCalculator from "./sections/RoiCalculator.jsx";
import FeatureRows from "./sections/FeatureRows.jsx";
import ExploreMore from "./sections/ExploreMore.jsx";
import BrandsSay from "./sections/BrandsSay.jsx";
import Credentials from "./sections/Credentials.jsx";
import BottomCta from "./sections/BottomCta.jsx";
import { useEffect } from "react";
import { useLandingEffects } from "../fx/useLandingEffects.js";

/**
 * 17 Returns landing — returns content + tracking shared modules.
 */
export default function LandingPage() {
  useEffect(() => {
    document.documentElement.classList.add("glass-mode-liquid");
    document.documentElement.lang = "en";
  }, []);
  useLandingEffects();

  return (
    <div className="glass-shell returns-page">
      <div className="page" id="glass-content">
        <Topbar />
        <main>
          <Hero />
          <TrustBand />
          <BrandsSay />
          <StatsRow />
          <RoiCalculator />
          <FeatureRows />
          <Credentials />
          <ExploreMore />
          <BottomCta />
        </main>
        <Footer />
      </div>
      <canvas id="glass-source" aria-hidden="true" />
      <canvas id="glass-output" aria-hidden="true" />
      <ProductDock />
    </div>
  );
}

