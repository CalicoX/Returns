import { BRANDS } from "../../content/returnsCopy.js";

/** Trust band — same DOM/CSS as tracking-react */
export default function TrustBand() {
  return (
    <section className="trust-band">
      <div className="trust">
        <div className="trust-copy">
          <strong>{BRANDS.title}</strong>
          <span>{BRANDS.subtitle}</span>
        </div>
        <div className="logos-marquee" aria-label="Brand logos">
          <div className="logos-track">
            <div className="logo-tile">
              <img src="/assets/logos/aliexpress.svg" alt="AliExpress" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile">
              <img src="/assets/logos/baleaf.png" alt="baleaf" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile">
              <img src="/assets/logos/anker.svg" alt="ANKER" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile">
              <img src="/assets/logos/coofandy.png" alt="COOFANDY" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile">
              <img src="/assets/logos/eufy.png" alt="eufy" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile">
              <img src="/assets/logos/shopify.svg" alt="Shopify" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile">
              <img src="/assets/logos/shein.svg" alt="SHEIN" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile">
              <img src="/assets/logos/temu.svg" alt="Temu" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            {/* duplicate set for seamless loop */}
            <div className="logo-tile" aria-hidden="true">
              <img src="/assets/logos/aliexpress.svg" alt="" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile" aria-hidden="true">
              <img src="/assets/logos/baleaf.png" alt="" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile" aria-hidden="true">
              <img src="/assets/logos/anker.svg" alt="" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile" aria-hidden="true">
              <img src="/assets/logos/coofandy.png" alt="" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile" aria-hidden="true">
              <img src="/assets/logos/eufy.png" alt="" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile" aria-hidden="true">
              <img src="/assets/logos/shopify.svg" alt="" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile" aria-hidden="true">
              <img src="/assets/logos/shein.svg" alt="" width="112" height="28" loading="lazy" decoding="async" />
            </div>
            <div className="logo-tile" aria-hidden="true">
              <img src="/assets/logos/temu.svg" alt="" width="112" height="28" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
