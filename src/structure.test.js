import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "src");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

describe("Returns landing structure", () => {
  it("App mounts LandingPage + returns-page styles", () => {
    const app = read("App.jsx");
    expect(app).toMatch(/LandingPage/);
    expect(app).toMatch(/returns-page\.css/);
    expect(app).not.toMatch(/LegacyLanding/);
  });

  it("TrustBand is a static two-row logo grid, not a marquee", () => {
    const tb = read("components/sections/TrustBand.jsx");
    expect(tb).toMatch(/logos-row/);
    expect(tb).not.toMatch(/logos-scroll/);
    expect(tb).not.toMatch(/aria-hidden/);
    const copy = read("content/returnsCopy.js");
    expect(copy).toMatch(/logos:\s*\[/);
    expect(copy).not.toMatch(/shopify\.svg|shein\.svg|temu\.svg/i);
    const css = read("styles/returns-page.css");
    expect(css).toMatch(/\.returns-page \.trust-copy \{[\s\S]*?text-align:\s*center/);
    expect(css).toMatch(/\.returns-page \.logos-row \{[\s\S]*?grid-template-columns:\s*repeat\(6/);
    expect(css).not.toMatch(/@keyframes logos-scroll/);
  });

  it("LandingPage uses returns-native sections (not tracking clone)", () => {
    const lp = read("components/LandingPage.jsx");
    for (const name of [
      "Topbar",
      "Hero",
      "StatsRow",
      "TrustBand",
      "RoiCalculator",
      "FeatureRows",
      "Plans",
      "Faq",
      "ExploreMore",
      "BrandsSay",
      "Credentials",
      "BottomCta",
      "Footer",
      "ProductDock",
    ]) {
      expect(lp).toContain(name);
    }
    expect(lp).not.toMatch(/ImpactBand|FeaturesSection|AiLab/);
    expect(lp).toMatch(/<TrustBand \/>\s*<BrandsSay \/>\s*<StatsRow \/>/);
    expect(lp).toMatch(/<Credentials \/>\s*<ExploreMore \/>\s*<BottomCta \/>/);
  });

  it("copy is English returns product page content", () => {
    const copy = read("content/returnsCopy.js");
    expect(copy).toContain("Turn every return");
    expect(copy).toContain("into a growth opportunity");
    expect(copy).toContain("AI-powered 24/7 returns automation");
    expect(copy).toContain("How Much Revenue Can");
    expect(copy).toContain("Branded Self-Service Returns Portal");
    expect(copy).toContain("Returns Solutions for Every DTC Growth Stage");
    expect(copy).toContain("How does the AI Rule Builder work?");
    expect(copy).toContain("Basic");
  });

  it("Product dock highlights Returns and offers Tracking", () => {
    const dock = read("components/layout/ProductDock.jsx");
    expect(dock).toMatch(/data-product="returns"/);
    expect(dock).toMatch(/data-product="tracking"/);
    expect(dock).toMatch(/className="tab active"/);
    expect(dock).toMatch(/tab active[\s\S]*data-product="returns"|data-product="returns"[\s\S]*tab active/);
  });

  it("ExploreMore promotes Tracking instead of Returns", () => {
    const explore = read("components/sections/ExploreMore.jsx");
    expect(explore).toMatch(/17 Order Tracking|trackingTitle/);
    expect(explore).toMatch(/explore-card-tracking/);
    expect(explore).toMatch(/ico-t-box/);
    expect(explore).toMatch(/os-status|WISMO inquiries/);
    expect(explore).toMatch(/Your order has been delivered/);
    expect(explore).not.toMatch(/Explore 17 Returns/);
    expect(explore).not.toMatch(/explore-card-returns/);
  });

  it("768 keeps API ascii; 480 keeps CTA gap after stacked copy", () => {
    const css = read("styles/returns-page.css");
    expect(css).toMatch(
      /explore-card-api > \.api-ascii \{\s*display:\s*block\s*!important/
    );
    expect(css).toMatch(/api-ascii-drift 36s/);
    expect(css).toMatch(
      /\.returns-page \.explore-card \.explore-link \{\s*margin-top:\s*20px/
    );
  });

  it("glass dock canvases still present for FX", () => {
    const land = read("components/LandingPage.jsx");
    expect(land).toMatch(/id="glass-source"/);
    expect(land).toMatch(/id="glass-output"/);
    expect(land).toMatch(/returns-page/);
  });
});
