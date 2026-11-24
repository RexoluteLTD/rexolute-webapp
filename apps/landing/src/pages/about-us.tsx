import { Link } from "@tanstack/react-router";
import { appUrls } from "@rexolute/utils/app-urls";

const promises = [
  { title: "Affordable", text: "Quality care shouldn't be a luxury. We aim to keep our services within reach, so cost doesn't stand in the way of getting help." },
  { title: "Accessible", text: "Your phone is all you need. Talk to a therapist from your bedroom, your office, your car, or from another country. No long queues, no awkward waiting rooms." },
  { title: "Available", text: "Help when you need it, not months later. Support that fits around your life, not the other way round." },
];

const steps = [
  "Get started on the Rexolute website.",
  "Tell us what you need. Share as much or as little as you're comfortable with.",
  "Find a certified therapist who suits you.",
  "Start talking, privately and securely, from wherever you are.",
];

const beliefs = [
  "Mental health is health. It deserves the same care and respect as physical health.",
  "Asking for help takes courage. It is never a sign of weakness.",
  "Everyone deserves dignity. Our care is always without judgement.",
  "Culture matters. Support works best when it understands where you come from.",
  "Healing is possible. No matter how heavy things feel today.",
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="landing-section" aria-labelledby="about-title">
        <div className="landing-container">
          <div className="page-intro">
            <p className="eyebrow">Affordable. Accessible. Available.</p>
            <h1 id="about-title">About Rexolute</h1>
            <p className="about-lead">You don’t have to hold it all together alone.</p>
          </div>
          <img src="/images/about-1.webp" alt="" width={2400} height={1098} className="about-image" fetchPriority="high" />
          <div className="about-intro-copy prose-copy">
            <p>Some days, life feels heavy. The bills, the pressure at work, the loss you haven’t talked about, the thoughts that keep you up at 2am. Many of us have learned to smile, say “I’m fine” and keep going.</p>
            <p>At Rexolute, we believe you deserve more than just “managing”. You deserve to be heard, understood and supported, without shame, without judgement and without it costing you everything.</p>
            <p><strong>No pressure. No judgement. No hidden agenda. …we just want to help.</strong></p>
            <p>Rexolute is a digital mental health platform built for Africans, by people who understand Africa. We connect you with certified therapists and help organisations care for their people, so getting support becomes as natural as visiting a doctor.</p>
          </div>
        </div>
      </section>

      <div className="landing-container landing-section split-layout about-split">
        <section className="about-copy prose-copy" aria-labelledby="why-title">
          <h2 id="why-title">Why we exist</h2>
          <p>Across Africa and the world at large, millions of people are struggling quietly.</p>
          <p>Mental health support has been too expensive for most people, too far away for many, and too hidden behind stigma for almost everyone. People have been told their pain is weakness, a lack of faith or “just stress”. So they carry it alone, often until it becomes a crisis.</p>
          <p>We started Rexolute to change that. We believe getting help should be normal, accessible and dignified, and that no one should have to choose between their mental health and their rent.</p>
        </section>
        <section className="about-copy prose-copy" aria-labelledby="mantra-title">
          <h2 id="mantra-title">Our mantra</h2>
          <p><strong>“…we just want to help”</strong></p>
          <p>It’s simple, and we mean it.</p>
          <p>We’re not here to label you, lecture you or tell you how you should feel. We’re not here to make you prove that your pain is “serious enough”. Every therapist, every programme, every article and every conversation at Rexolute starts from the same place.</p>
          <p>Whether you’re carrying something heavy, supporting someone you love, or leading a team that needs care, we’ll meet you where you are, listen first, and walk with you at your pace.</p>
          <p>Because at the heart of everything we do, …we just want to help.</p>
        </section>
      </div>

      <section className="landing-section green-section" aria-labelledby="promise-title">
        <div className="landing-container">
          <div className="section-heading"><h2 id="promise-title">Our promise</h2><p>The three A’s</p></div>
          <div className="about-three-column">
            {promises.map(({ title, text }) => <article className="about-copy" key={title}><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="landing-container landing-section" aria-labelledby="services-title">
        <h2 id="services-title">What we do</h2>
        <div className="support-grid about-three-column">
          <article className="support-card prose-copy">
            <h3>Rexolute Care</h3>
            <p><strong>Support for you</strong></p>
            <p>Rexolute Care connects you with certified, vetted therapists for private, one-to-one sessions. Whatever you’re going through, there’s someone ready to listen. That might be anxiety, depression, grief, trauma, relationship struggles, addiction, burnout, or simply feeling lost.</p>
            <p>Our therapists understand the African context: the family expectations, the faith, the culture, the pressures of daily life. You won’t need to explain where you’re coming from. They get it.</p>
          </article>
          <article className="support-card prose-copy">
            <h3>Rexolute Training</h3>
            <p><strong>Support for your workplace</strong></p>
            <p>Healthy people build healthy organisations. Rexolute Training partners with companies, schools, faith communities and institutions to deliver workplace wellbeing programmes. These include mental health awareness, stress and burnout prevention, resilience, emotional intelligence and leadership wellbeing.</p>
            <p>When your people thrive, your organisation thrives too.</p>
          </article>
          <article className="support-card prose-copy">
            <h3>Learn and grow</h3>
            <p>Our free articles and resources help you understand what you’re feeling, recognise the signs, and take small, practical steps towards feeling better, at your own pace.</p>
            <Link to="/blog" className="about-inline-link">Explore the blog</Link>
          </article>
        </div>
      </section>

      <div className="landing-container landing-section split-layout about-split">
        <section className="about-copy prose-copy" aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          <ol className="about-numbered-list">{steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <p>Simple, safe, and entirely on your terms.</p>
        </section>
        <div className="about-group">
          <section className="about-copy prose-copy" aria-labelledby="privacy-title">
            <h2 id="privacy-title">Your privacy is sacred</h2>
            <p>Healing requires trust, and we take that trust seriously. We treat the information you share with care. Review the privacy and consent information for your therapy service before sharing personal or health information.</p>
            <p><Link to="/privacy" className="about-inline-link">Read our website privacy information</Link></p>
          </section>
          <section className="about-copy prose-copy" aria-labelledby="audience-title">
            <h2 id="audience-title">Who we’re for</h2>
            <p>Everyone. Students and young professionals, parents and grandparents, business owners and frontline workers, people at home and Africans in the diaspora. Whatever your age, gender, background, faith or story, there’s a place for you here.</p>
          </section>
        </div>
      </div>

      <div className="landing-container landing-section split-layout about-split">
        <section className="about-copy prose-copy" aria-labelledby="origins-title">
          <h2 id="origins-title">Where we come from</h2>
          <p>Rexolute grew out of The ICHAD Project, a youth development and mental health organisation that has worked in communities across Africa since 2019. Through its work, ICHAD has reached thousands of young people and teachers, and built safe spaces in communities across several African countries.</p>
          <p>Through that work, we saw the same truth again and again: people want help, but they can’t find it, can’t afford it, or are too afraid to ask. Rexolute was created to close that gap and bring professional mental health care to everyone, everywhere.</p>
        </section>
        <section className="about-copy" aria-labelledby="beliefs-title">
          <h2 id="beliefs-title">What we believe</h2>
          <ul className="about-beliefs">{beliefs.map((belief) => <li key={belief}>{belief}</li>)}</ul>
        </section>
      </div>

      <section className="landing-container landing-section" aria-labelledby="vision-title">
        <div className="app-panel about-copy prose-copy">
          <h2 id="vision-title">Our vision</h2>
          <p>An Africa where everyone can access the mental health support they need, when they need it, without stigma, without barriers, and without fear.</p>
          <p>We’re building a future where saying “I’m seeing a therapist” is as normal as saying “I’m going to the gym”, and where no one has to struggle alone.</p>
        </div>
      </section>

      <section className="landing-section green-section" aria-labelledby="first-step-title">
        <div className="landing-container">
          <div className="section-heading about-closing">
            <h2 id="first-step-title">Take the first step today</h2>
            <p>You don’t need to have the right words. You don’t need to wait until things get worse. You just need to start.</p>
            <div className="about-actions">
              <a href={`${appUrls.client}/login`} className="landing-button button-light">Book a session</a>
              <a href="mailto:hello@example.co?subject=Partnership%20enquiry" className="landing-button">Partner with us</a>
              <Link to="/contact-us" className="landing-button">Contact us</Link>
            </div>
            <p><strong>Rexolute. Affordable. Accessible. Available.</strong><br />…we just want to help.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
