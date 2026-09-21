import { BRANDS } from "../../content/returnsCopy.js";

/** Trust band — official 17TRACK brand logos, static 2×6 (no marquee) */

function LogoTile({ logo }) {
  return (
    <div className="logo-tile">
      <img
        src={logo.src}
        alt={logo.alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default function TrustBand() {
  const row1 = BRANDS.logos.slice(0, 6);
  const row2 = BRANDS.logos.slice(6, 12);
  return (
    <section className="trust-band">
      <div className="trust">
        <div className="trust-copy">
          <strong>{BRANDS.title}</strong>
        </div>
        <div className="logos-marquee" aria-label="Brand logos">
          <div className="logos-track">
            <div className="logos-row">
              {row1.map((logo) => (
                <LogoTile key={logo.alt} logo={logo} />
              ))}
            </div>
            <div className="logos-row">
              {row2.map((logo) => (
                <LogoTile key={logo.alt} logo={logo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
