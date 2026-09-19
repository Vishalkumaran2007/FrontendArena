import { ArrowUpRight, Check, CheckCircle2, ChevronRight, Circle, ListTodo, Sparkles, Target } from "lucide-react";
import { Link } from "wouter";

const principles = [
  { label: "Capture", text: "Get the next useful thing out of your head and onto the shelf.", icon: ListTodo },
  { label: "Prioritize", text: "Give the day a shape with clear weights and softer edges.", icon: Target },
  { label: "Complete", text: "Move forward visibly, one finished volume at a time.", icon: CheckCircle2 },
];

export default function Home() {
  return (
    <main className="home-page">
      <div className="paper-grain" aria-hidden="true" />
      <header className="topbar page-width">
        <a className="brand" href="#top" aria-label="FocusList home">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">FocusList</span>
          <span className="brand-dot" aria-hidden="true">/</span>
          <span className="brand-tagline">daily volumes</span>
        </a>
        <nav className="home-nav" aria-label="Main navigation">
          <a href="#approach">Approach</a>
          <a href="#rhythm">Rhythm</a>
          <Link className="nav-cta" href="/todo">Open your shelf <ArrowUpRight size={15} /></Link>
        </nav>
      </header>

      <section className="home-hero page-width" id="top">
        <div className="home-hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> A calmer way to work through the day</p>
          <h1>Make room for<br /><em>the next thing.</em></h1>
          <p className="home-lead">FocusList is a quiet, local-first workspace for capturing what matters, giving it a weight, and moving it forward without the noise.</p>
          <div className="home-actions">
            <Link className="primary-cta" href="/todo">Start your day <ArrowUpRight size={17} /></Link>
            <a className="secondary-cta" href="#approach">See how it works <ChevronRight size={15} /></a>
          </div>
          <div className="home-note"><span className="status-dot" /> No account required <span className="note-divider" /> Your tasks stay in your browser</div>
        </div>
        <div className="home-hero-art" aria-label="Preview of a focused task list">
          <div className="art-shadow" />
          <div className="art-card art-card-back"><span>03</span><span>Make space for deep work</span></div>
          <div className="art-card art-card-main">
            <div className="art-card-top"><span>Today's rhythm</span><span className="art-live"><span className="status-dot" /> live</span></div>
            <div className="art-card-title">A small list<br /><em>with a clear center.</em></div>
            <div className="art-list">
              <div className="art-task"><span className="art-check"><Check size={11} /></span><span>Review the product brief</span><span className="art-priority high">High</span></div>
              <div className="art-task"><span className="art-check" /><span>Send the revised copy</span><span className="art-priority medium">Medium</span></div>
              <div className="art-task art-task-done"><span className="art-check done"><Check size={11} /></span><span>Make room for a walk</span><span className="art-priority low">Low</span></div>
            </div>
            <div className="art-card-foot"><span><Circle size={9} /> 2 pending</span><span>1 finished</span></div>
          </div>
        </div>
      </section>

      <section className="home-marquee" aria-label="FocusList promise"><span>Capture clearly</span><i>·</i><span>Prioritize gently</span><i>·</i><span>Finish visibly</span><i>·</i><span>Capture clearly</span></section>

      <section className="principles-section page-width" id="approach">
        <div className="principles-intro"><span className="section-kicker">01 / The approach</span><h2>Less noise.<br /><em>More signal.</em></h2><p>A good task list should make the day feel more possible, not more crowded. FocusList keeps the system small so your attention can stay with the work.</p></div>
        <div className="principles-list">
          {principles.map(({ label, text, icon: Icon }, index) => (
            <article className="principle-row" key={label}><span className="principle-index">0{index + 1}</span><span className="principle-icon"><Icon size={19} /></span><div><h3>{label}</h3><p>{text}</p></div><ArrowUpRight className="principle-arrow" size={17} /></article>
          ))}
        </div>
      </section>

      <section className="rhythm-section page-width" id="rhythm">
        <div className="rhythm-panel">
          <div><span className="section-kicker">02 / Your rhythm</span><h2>Designed for<br /><em>one day at a time.</em></h2></div>
          <div className="rhythm-copy"><p>Start with a clean shelf. Let priorities tell you where to look. Close the day knowing what moved.</p><Link className="text-link" href="/todo">Open the Todo workspace <ArrowUpRight size={15} /></Link></div>
        </div>
        <div className="rhythm-stats"><div><span>01</span><strong>local-first</strong><p>Your list stays close.</p></div><div><span>02</span><strong>quietly responsive</strong><p>Works across every screen.</p></div><div><span>03</span><strong>built for motion</strong><p>Progress you can see.</p></div></div>
      </section>

      <section className="home-final page-width"><div className="final-rule" /><span className="section-kicker">03 / Begin here</span><h2>Make the next<br /><em>useful thing easy.</em></h2><Link className="primary-cta" href="/todo">Go to your shelf <ArrowUpRight size={17} /></Link></section>

      <footer className="footer page-width"><span>FocusList is a quiet place to begin.</span><span>Made for the next useful thing.</span></footer>
    </main>
  );
}
