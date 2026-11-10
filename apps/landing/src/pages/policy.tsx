import { Link } from "@tanstack/react-router";

export default function CookiePolicyPage() {
  return <article className="landing-container landing-section legal-page">
    <h1>Cookie policy</h1>
    <p>This page explains cookies and browser storage in relation to the Rexolute public website.</p>
    <h2>What cookies and browser storage do</h2><p>Cookies are small pieces of information a website can ask a browser to retain. Browser storage, such as local storage and session storage, can also retain information on a device. These technologies can support features such as preferences and signed-in sessions.</p>
    <h2>The public landing website</h2><p>This landing app does not set advertising or analytics cookies and does not add third-party tracking scripts. Its navigation menu and contact form work without saving their contents in cookies, local storage, or session storage.</p><p>Infrastructure or services outside this landing app may have their own storage or security behaviour. This policy should be updated if additional website services are introduced.</p>
    <h2>Signing in to other Rexolute apps</h2><p>The client and admin apps are separate from the public landing pages. Their authenticated sessions currently use browser session storage. Read the privacy information provided for those services before signing in.</p>
    <h2>Your browser choices</h2><p>You can review, block, or clear cookies and site data through your browser settings. Removing session information from an authenticated app may sign you out. The public landing pages do not require tracking consent to read their content.</p>
    <h2>Contact</h2><p>For questions, email <a href="mailto:hello@example.co">hello@example.co</a> or read our <Link to="/privacy">privacy information</Link>.</p>
  </article>;
}
