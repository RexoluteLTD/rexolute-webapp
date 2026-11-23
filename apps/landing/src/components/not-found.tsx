import { Link } from "@tanstack/react-router";
export function LandingNotFound() {
  return <section className="landing-container landing-section page-intro"><h1>Page not found</h1><p>The page you requested does not exist. Let’s get you back to Rexolute.</p><Link to="/" className="landing-button">Return home</Link></section>;
}
