import { Link } from "@tanstack/react-router";
import { Accessibility, ArrowRight, Calendar, Check, Sparkles, Users } from "lucide-react";
import { appUrls } from "@rexolute/utils/app-urls";

const steps = [
  { title: "Explore the support you need", text: "Think about what brings you here, whether it is stress, relationships, or simply wanting space to talk." },
  { title: "Share a little about yourself", text: "Reflect on your goals and the kind of support that would feel right for you." },
  { title: "Find a therapist", text: "Look for an approach and a connection that help you feel comfortable being yourself." },
  { title: "Make space for your wellbeing", text: "Take the next step at your own pace, one conversation at a time." },
];

export default function HomePage() {
  return <>
    <section className="landing-section hero-section" aria-labelledby="hero-title">
      <div className="landing-container split-layout hero-layout">
        <div>
          <Sparkles className="hero-spark" size={42} aria-hidden="true" />
          <h1 id="hero-title">Your Journey To Better <span className="gold-text">Mental Wellness</span> Starts Here</h1>
          <p className="hero-description">Find professional therapy services online, anytime, anywhere. Take your next step towards feeling more like yourself.</p>
          <a href={`${appUrls.client}/login`} className="landing-button">Book a therapist <ArrowRight size={20} aria-hidden="true" /></a>
        </div>
        <img src="/images/pic1.jpg" alt="People connecting with professionals through online appointments" width={753} height={606} fetchPriority="high" className="hero-image" />
      </div>
    </section>

    <section className="landing-section" aria-labelledby="therapy-title">
      <div className="landing-container split-layout">
        <img src="/images/pic2.jpg" alt="Two people embracing during a support group gathering" width={580} height={615} loading="lazy" decoding="async" className="section-image therapy-image" />
        <div>
          <h2 id="therapy-title">Why therapy is important for you</h2>
          <p className="section-description">You do not need to have everything figured out before asking for support. Therapy offers time to explore what you are feeling, understand your patterns, and work towards changes that matter to you.</p>
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
          <h2 id="why-title">Why you should choose us.</h2>
          <p className="section-description">Finding support should feel approachable. We bring the next steps together so you can focus on what matters to you.</p>
          <div className="feature-list">
            {[
              { Icon: Accessibility, title: "Support within reach", text: "Explore online therapy from a space where you feel comfortable, without the journey to a waiting room." },
              { Icon: Users, title: "A connection that matters", text: "Every experience is different. Find a therapist whose approach fits the conversations you want to have." },
              { Icon: Calendar, title: "Time for your wellbeing", text: "Make room for support alongside work, family, and the rest of everyday life." },
            ].map(({ Icon, title, text }) => <div key={title}><h3><Icon size={24} aria-hidden="true" />{title}</h3><p>{text}</p></div>)}
          </div>
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
        <p className="eyebrow">ROOM FOR YOUR EXPERIENCE</p>
        <h2 id="support-title">Support for the things you carry</h2>
        <div className="support-grid">
          <article className="support-card"><h3>When life feels overwhelming</h3><p>A crowded mind, a difficult change, or a week that takes more than it gives. Therapy can be a place to slow down, name what is happening, and explore a way forward.</p></article>
          <article className="support-card"><h3>When you want to understand yourself</h3><p>You do not have to wait for a crisis to be curious about your wellbeing. Make space to reflect on your relationships, recognise patterns, and consider what you need next.</p></article>
        </div>
      </div>
    </section>

    <section className="landing-section green-section" aria-labelledby="online-title">
      <div className="landing-container">
        <div className="app-panel split-layout">
          <div><h2 id="online-title">A little more space for <span className="green-text">your wellbeing</span></h2><p className="section-description">Start your journey with Rexolute online. Explore support from your phone, tablet, or computer, at a pace that feels right for you.</p><a href={`${appUrls.client}/login`} className="landing-button">Get started online <ArrowRight size={20} aria-hidden="true" /></a></div>
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
