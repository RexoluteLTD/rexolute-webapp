import { Link } from "@tanstack/react-router";

export default function AboutPage() {
  return <>
    <section className="landing-section" aria-labelledby="about-title">
      <div className="landing-container">
        <div className="page-intro"><p className="eyebrow">OUR PURPOSE</p><h1 id="about-title">About Rexolute</h1><p>We believe taking care of your mind deserves a place in everyday life. Rexolute brings therapy and mental wellness into a space that feels easier to approach.</p></div>
        <img src="/images/about-1.webp" alt="" width={2400} height={1098} className="about-image" fetchPriority="high" />
        <div className="split-layout vision-layout"><div><p className="eyebrow">OUR VISION</p><h2>More room to be yourself. More ways to move forward.</h2></div><div className="prose-copy"><p>Asking for support can feel like a big step. We want to make the beginning less daunting, whether you are exploring therapy for the first time or returning with new goals.</p><p>Our focus is on meaningful conversations, individual experiences, and helping people find support that fits their lives. There is no single story of mental wellness, and no one pace you need to follow.</p></div></div>
      </div>
    </section>
    <section className="landing-section green-section" aria-labelledby="values-title"><div className="landing-container"><div className="section-heading"><h2 id="values-title">What guides us</h2><p>A thoughtful approach to the very human experience of asking for help.</p></div><div className="values-grid">{[
      { title: "Listening first", text: "Your experiences and goals are the starting point for a conversation about support." },
      { title: "Respect for individuality", text: "Background, identity, and life experience all shape what wellbeing means to each of us." },
      { title: "Space to reflect", text: "Understanding yourself takes time. Small steps and honest conversations have a place here." },
      { title: "Connection with purpose", text: "Finding the right support starts with an approach that feels relevant to your needs." },
    ].map(({ title, text }) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><div className="section-heading about-cta"><Link to="/contact-us" className="landing-button button-light">Talk to our team</Link></div></div></section>
  </>;
}
