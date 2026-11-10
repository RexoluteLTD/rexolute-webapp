import { Link } from "@tanstack/react-router";

export default function TermsPage() {
  return <article className="landing-container landing-section legal-page">
    <h1>Terms and conditions</h1>
    <p>These terms explain the use of the Rexolute public website. They are a starting point for learning about the platform and contacting our team. Any therapy, appointment, payment, or practitioner agreement should be confirmed separately before you begin a service.</p>
    <h2>Using this website</h2><p>You may browse information about Rexolute and contact us with questions about the platform, partnerships, or therapist opportunities. Please use the website respectfully and do not attempt to disrupt its operation or access another person’s information.</p>
    <h2>Information about therapy</h2><p>The public website provides general information about therapy and mental wellness. Its content is not an individual assessment, diagnosis, or treatment plan. The support that is appropriate for you depends on your circumstances and should be discussed with a qualified professional.</p>
    <h2>Before starting a service</h2><p>Ask about the practitioner’s qualifications, the type of support offered, fees, appointment arrangements, confidentiality, and cancellation terms. Do not assume that browsing this website or sending an enquiry creates a therapist–client relationship.</p>
    <h2>Contacting our team</h2><p>The contact form prepares a draft in your email app. Your email is sent only when you choose to send it there. We do not promise an immediate response or a particular outcome from an enquiry.</p>
    <h2>Urgent support</h2><p>Rexolute’s public website and general enquiry inbox are not emergency services. If you need urgent help, contact the appropriate emergency or urgent care service where you are.</p>
    <h2>Privacy and website storage</h2><p>Read our <Link to="/privacy">privacy information</Link> and <Link to="/policy">cookie policy</Link> for details about this public website. Separate client or practitioner services may provide additional information about their use of personal data.</p>
    <h2>Changes and questions</h2><p>Website information and these terms may be updated as Rexolute develops. For questions or to clarify any service arrangements, email <a href="mailto:hello@example.co">hello@example.co</a>.</p>
  </article>;
}
