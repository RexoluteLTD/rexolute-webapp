import { Link } from "@tanstack/react-router";

export default function PrivacyPage() {
  return <article className="landing-container landing-section legal-page">
    <h1>Privacy information</h1>
    <p>Talking about wellbeing is personal. This page describes the information handled by the Rexolute public website. It does not replace the privacy information or consent arrangements provided for a therapy service.</p>
    <h2>Browsing the public website</h2><p>You can read the public pages without creating an account. This landing app does not include advertising trackers or analytics scripts. Hosting and network services may handle technical request information as part of serving the website.</p>
    <h2>Contact form and email</h2><p>The contact form uses the name, email address, optional phone number, and message you enter to prepare an email draft on your device. It does not submit those fields to a Rexolute website endpoint or save them in this landing app’s browser storage.</p><p>If you choose to send the draft, the information is handled by your email service and the recipient’s email service as an email to hello@example.co. You can also contact that address directly. Include only the information needed for your enquiry.</p>
    <h2>Client and practitioner services</h2><p>Links to the client app take you to a separate part of the service. Account, appointment, payment, and clinical information require their own privacy and consent arrangements. Check the information provided there before sharing personal or health information.</p>
    <h2>Cookies and browser storage</h2><p>Read the <Link to="/policy">cookie policy</Link> for information about storage used by the public website and how it differs from authenticated services.</p>
    <h2>Questions about your information</h2><p>To ask about information you have shared, request a correction, or discuss deletion of an enquiry, contact <a href="mailto:hello@example.co">hello@example.co</a>. Please identify the enquiry you are asking about without sending unnecessary sensitive details.</p>
    <h2>Updates</h2><p>This information should be updated when the website introduces new forms, analytics, account features, or other ways of handling personal information.</p>
  </article>;
}
