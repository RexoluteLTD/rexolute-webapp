import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { appUrls } from "@rexolute/utils/app-urls";
import { logoGreen, logoWhite } from "@rexolute/assets/svg";
import { Seo } from "../seo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about-us", label: "About us" },
  { to: "/contact-us", label: "Contact us" },
] as const;

export default function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      setMenuOpen(false);
      main.current?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname]);

  return (
    <div className="landing-app">
      <Seo pathname={pathname} />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="landing-header" onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); }
      }}>
        <div className="landing-container header-row">
          <Link to="/" aria-label="Rexolute home" className="brand-link">
            <img src={logoGreen} alt="Rexolute" width={150} height={40} />
          </Link>
          <nav aria-label="Main navigation" className="desktop-nav">
            {links.map(({ to, label }) => <Link key={to} to={to} activeOptions={{ exact: true }} activeProps={{ "aria-current": "page" }}>{label}</Link>)}
          </nav>
          <div className="header-actions">
            <a href={`${appUrls.client}/login`} className="landing-button header-cta">Get started</a>
            <button ref={menuButton} type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-nav landing-container" hidden={!menuOpen}>
          {links.map(({ to, label }) => <Link key={to} to={to} activeOptions={{ exact: true }} activeProps={{ "aria-current": "page" }} onClick={() => setMenuOpen(false)}>{label}</Link>)}
          <a href={`${appUrls.client}/login`}>Get started with Rexolute</a>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1} ref={main}>{children}</main>
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-top">
            <div>
              <Link to="/" aria-label="Rexolute home" className="brand-link"><img src={logoWhite} alt="Rexolute" width={150} height={40} loading="lazy" /></Link>
              <p className="footer-description">A space to be heard. Support to move forward.<br />Explore therapy and mental wellness with Rexolute.</p>
              <a className="landing-button button-light" href={`${appUrls.client}/login`}>Get started online</a>
            </div>
            <nav aria-label="Footer navigation" className="footer-links">
              {links.map(({ to, label }) => <Link key={to} to={to}>{label}</Link>)}
              <a href="mailto:hello@example.co">hello@example.co</a>
            </nav>
          </div>
          <div className="footer-bottom">
            <p>© Rexolute. All rights reserved.</p>
            <nav aria-label="Legal navigation" className="legal-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/policy">Cookie policy</Link>
              <Link to="/terms-condition">Terms</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
