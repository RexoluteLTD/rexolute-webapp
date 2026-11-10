import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = `${form.get("firstName")} ${form.get("lastName")}`.trim();
    const body = `Name: ${name}\nEmail: ${form.get("email")}\nPhone: ${form.get("phone") || "Not provided"}\n\n${form.get("message")}`;
    const mailto = `mailto:hello@example.co?subject=${encodeURIComponent(`Rexolute enquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("Your email app has been requested. Review and send the draft there. If it does not open, email hello@example.co directly. Your message has not been sent by this website.");
  }
  return <section className="landing-section" aria-labelledby="contact-title"><div className="landing-container">
    <div className="page-intro"><h1 id="contact-title">Contact us</h1><p>Have a question about Rexolute, getting started, or working with our team? We would like to hear from you.</p></div>
    <div className="contact-grid">
      <section className="contact-info" aria-labelledby="contact-info-title"><h2 id="contact-info-title">Let’s talk</h2><p>For questions about the platform, partnerships, or therapist enquiries, send our team an email.</p><a href="mailto:hello@example.co" className="contact-email"><Mail aria-hidden="true" size={24} /><span>hello@example.co</span></a><p>You can also use the form to prepare an email in your own email app.</p></section>
      <form className="contact-form" action="mailto:hello@example.co" method="post" encType="text/plain" onSubmit={prepareEmail} aria-describedby="contact-help">
        <h2>Write to our team</h2><p id="contact-help">All fields marked with * are required. This form opens your email app; messages are sent from there.</p>
        <div className="form-row"><div><label htmlFor="first-name">First name *</label><input id="first-name" name="firstName" type="text" autoComplete="given-name" required maxLength={80} /></div><div><label htmlFor="last-name">Last name *</label><input id="last-name" name="lastName" type="text" autoComplete="family-name" required maxLength={80} /></div></div>
        <div className="form-row"><div><label htmlFor="email">Email address *</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} /></div><div><label htmlFor="phone">Phone number (optional)</label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} /></div></div>
        <div><label htmlFor="message">Message *</label><textarea id="message" name="message" rows={6} required maxLength={2000} /></div>
        <button type="submit" className="landing-button">Prepare email</button><p role="status" aria-live="polite">{status}</p>
      </form>
    </div>
  </div></section>;
}
