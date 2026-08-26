import { BRANDS } from "../../content/returnsCopy.js";

/** Trust band — static 4×2 logo grid (no marquee) */
export default function TrustBand() {
  return (
    <section className="trust-band">
      <div className="trust">
        <div className="trust-copy">
          <strong>{BRANDS.title}</strong>
          <span>{BRANDS.subtitle}</span>
        </div>
        <div className="logos-grid" aria-label="Brand logos">
          {BRANDS.logos.map((logo) => (
            <div className="logo-tile" key={logo.alt}>
              <img
                src={logo.src}
                alt={logo.alt}
                width="112"
                height="28"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
