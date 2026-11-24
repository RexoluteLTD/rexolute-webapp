import { Link } from "@tanstack/react-router";
import { Accessibility, ArrowRight, Calendar, Check, Sparkles, Wallet } from "lucide-react";
import { appUrls } from "@rexolute/utils/app-urls";

const steps = [
  { title: "Get started online", text: "Sign in to your Rexolute account." },
  { title: "Tell us what you need", text: "Share as much or as little as you’re comfortable with." },
  { title: "Find a therapist who suits you", text: "Look for someone who understands your circumstances and the kind of support you want." },
  { title: "Start talking", text: "Make time for a private, one-to-one conversation from a place that feels comfortable." },
];

export default function HomePage() {
  return <>
    <section className="landing-section hero-section" aria-labelledby="hero-title">
      <div className="landing-container split-layout hero-layout">
        <div>
          <Sparkles className="hero-spark" size={42} aria-hidden="true" />
          <h1 id="hero-title">Mental health support <span className="gold-text">built for Africans</span></h1>
          <p className="hero-description">You don’t have to hold it all together alone. Find online therapy with people who understand where you’re coming from.</p>
          <a href={`${appUrls.client}/login`} className="landing-button">Book a therapist <ArrowRight size={20} aria-hidden="true" /></a>
        </div>
        <img src="/images/pic1.jpg" alt="People connecting with professionals through online appointments" width={753} height={606} fetchPriority="high" className="hero-image" />
      </div>
    </section>

    <section className="landing-section" aria-labelledby="therapy-title">
      <div className="landing-container split-layout">
        <img src="/images/pic2.jpg" alt="Two people embracing during a support group gathering" width={580} height={615} loading="lazy" decoding="async" className="section-image therapy-image" />
        <div>
          <h2 id="therapy-title">A space to be heard</h2>
          <p className="section-description">Asking for help takes courage. Therapy offers a place to talk about what you’re carrying, explore how you’re feeling and decide what you want to work on, at your own pace.</p>
          <ul className="benefit-list">
            {["Make sense of stress and anxious thoughts", "Build self-awareness and self-esteem", "Navigate life's changes and challenges", "Explore healthier relationships", "Practise communication and coping skills"].map((text) => <li key={text}><Check size={22} aria-hidden="true" /><span>{text}</span></li>)}
          </ul>
        </div>
      </div>
    </section>

    <div className="image-strip" aria-hidden="true">
      {[3, 4, 5].map((image) => <img key={image} src={`/images/pic${image}.png`} alt="" width={480} height={427} loading="lazy" decoding="async" />)}
    </div>

    <section className="landing-section" aria-labelledby="why-title">
      <div className="landing-container split-layout">
        <div>
          <h2 id="why-title">Our promise</h2>
          <p className="section-description">Getting help should feel normal and within reach. These are the three A’s that guide Rexolute.</p>
          <div className="feature-list">
            {[
              { Icon: Wallet, title: "Affordable", text: "Quality care shouldn’t be a luxury. We aim to keep the cost of support within reach." },
              { Icon: Accessibility, title: "Accessible", text: "Talk to a therapist online from a place that works for you, without travelling to a waiting room." },
              { Icon: Calendar, title: "Available", text: "Find time for support around work, family and the rest of everyday life." },
            ].map(({ Icon, title, text }) => <div key={title}><h3><Icon size={24} aria-hidden="true" />{title}</h3><p>{text}</p></div>)}
          </div>
          <Link to="/about-us" className="green-text mt-4 inline-flex min-h-11 items-center gap-2 font-semibold underline">
            More about Rexolute <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <img src="/images/pic6.jpg" alt="" width={603} height={623} loading="lazy" decoding="async" className="section-image" />
      </div>
    </section>

    <section className="landing-section green-section" aria-labelledby="how-title">
      <div className="landing-container">
        <div className="section-heading"><h2 id="how-title">How it works</h2><p>A few small steps towards the support you need.</p></div>
        <div className="split-layout steps-layout">
          <img src="/images/pic7.jpg" alt="" width={533} height={639} loading="lazy" decoding="async" className="section-image" />
          <ol className="steps-list">{steps.map(({ title, text }, index) => <li key={title}><span className="step-number" aria-hidden="true">{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
        </div>
      </div>
    </section>

    <section className="landing-section" aria-labelledby="support-title">
      <div className="landing-container">
        <h2 id="support-title">Support for you and your workplace</h2>
        <div className="support-grid">
          <article className="support-card">
            <h3>Rexolute Care</h3>
            <p>Private, one-to-one sessions with certified therapists who understand the African context. Talk through what’s on your mind, from grief and relationship struggles to burnout.</p>
          </article>
          <article className="support-card">
            <h3>Rexolute Training</h3>
            <p>Workplace wellbeing programmes for companies, schools and community organisations. Topics include mental health awareness, stress and burnout prevention, and leadership wellbeing.</p>
            <Link to="/contact-us" className="green-text inline-flex min-h-11 items-center font-semibold underline">Ask about workplace training</Link>
          </article>
        </div>
        <p className="section-description">Explore <Link to="/blog" className="green-text font-semibold underline">our free mental wellness articles</Link> for practical ways to learn and reflect at your own pace.</p>
      </div>
    </section>

    <section className="landing-section green-section" aria-labelledby="online-title">
      <div className="landing-container">
        <div className="app-panel split-layout">
          <div><h2 id="online-title">Take the first step today</h2><p className="section-description">You don’t need to have the right words. Get started from your phone, tablet or computer, at a pace that feels right for you.</p><a href={`${appUrls.client}/login`} className="landing-button">Get started online <ArrowRight size={20} aria-hidden="true" /></a></div>
          <img src="/images/rexolute-mock8.webp" alt="Preview of the Rexolute mobile experience" width={1072} height={1080} loading="lazy" decoding="async" className="app-preview" />
        </div>
      </div>
    </section>

    <section className="landing-section" aria-labelledby="team-title">
      <div className="landing-container split-layout">
        <div><h2 id="team-title">Interested in supporting others as a <span className="gold-text">therapist?</span></h2><p className="section-description">We would like to hear about your approach, your experience, and the people you hope to support. Get in touch to learn more about working with Rexolute.</p><Link to="/contact-us" className="landing-button">Contact our team <ArrowRight size={20} aria-hidden="true" /></Link></div>
        <img src="/images/pic10.png" alt="" width={544} height={618} loading="lazy" decoding="async" className="team-image" />
      </div>
    </section>
  </>;
}
