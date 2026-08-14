/** English nav — 17RETURNS active */
export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="nav-left">
          <a className="logo" href="https://www.17track.com/en" aria-label="17TRACK">
            <img src="/assets/logo-17track.svg" alt="17TRACK" width="130" height="20" />
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            <div className="nav-group">
              <a className="nav-item" href="#">Tracking</a>
              <a className="nav-item active" href="#">17RETURNS</a>
              <a className="nav-item" href="#">API</a>
            </div>
            <div className="nav-divider" aria-hidden="true"></div>
            <div className="nav-group">
              <a className="nav-item" href="#">Products <img src="/assets/icon-dropdown.svg" alt="" /></a>
              <a className="nav-item" href="#">Resources <img src="/assets/icon-dropdown.svg" alt="" /></a>
              <a className="nav-item" href="#">Pricing</a>
            </div>
          </nav>
        </div>
        <div className="nav-actions">
          <a className="btn-text" href="#">Sign in <img src="/assets/icon-chevron.svg" alt="" /></a>
          <a
            className="btn-split primary"
            href="https://www.17returns.com?utm_source=www.17track.com&utm_medium=products&utm_campaign=button"
            target="_blank"
            rel="noopener"
          >
            <span className="main">
              <span className="full">Start Free Trial</span>
              <span className="short" hidden={true}>Trial</span>
            </span>
            <span className="caret"><img src="/assets/icon-caret.svg" alt="" /></span>
          </a>
          <a className="btn-split shopify" href="https://www.17track.com/en/contact-us">
            <span className="main">Book a Demo</span>
            <span className="caret"><img src="/assets/icon-caret.svg" alt="" /></span>
          </a>
          <button className="menu-toggle" type="button" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
