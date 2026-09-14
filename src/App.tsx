import { ArrowRight, ExternalLink, Mail, Menu, X, Zap, Wrench, ShieldCheck, Layers3, Smartphone, Bot, Workflow, Boxes, Globe2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BlueprintMorph, BLUEPRINT_LABELS } from './components/BlueprintMorph';

const capabilities = [
  { icon: Globe2, label: 'Websites', text: 'Fast, focused, modern sites built around what the business actually needs.' },
  { icon: Smartphone, label: 'Apps', text: 'Mobile and web apps with the right stack instead of a pile of unnecessary tooling.' },
  { icon: Workflow, label: 'Automation', text: 'Turn repetitive work into systems that run without babysitting.' },
  { icon: Bot, label: 'AI systems', text: 'Agents, copilots, knowledge tools, and workflows where AI is useful, not decorative.' },
  { icon: Layers3, label: 'Internal tools', text: 'Dashboards, portals, operators, and software shaped around your real process.' },
  { icon: Boxes, label: '3D & interactive', text: 'WebGL, product visualization, game-like interfaces, and unusual digital experiences.' },
];

const barriers = [
  { icon: Wrench, title: 'Implementation', text: 'You know what should exist. You just do not know how to build it.' },
  { icon: Zap, title: 'Cost', text: 'Big agency pricing kills good ideas before they get a chance to prove themselves.' },
  { icon: ShieldCheck, title: 'Maintenance', text: 'A launch is not useful if nobody owns what happens after launch day.' },
];

const projects = [
  {
    name: 'Harrismas',
    client: 'Golden State Sports Club',
    url: 'https://harrismas.com',
    tags: ['Website', 'Payments', 'Brand'],
    blurb: 'A live event experience with payments, sponsor visibility, and a digital presence built around the event itself.',
    theme: 'gold',
  },
  {
    name: 'UniformBright',
    client: 'Uniform rental contract experts',
    url: 'https://uniformbright.com',
    tags: ['Website', 'Content', 'Operations'],
    blurb: 'A rebuilt digital platform designed to turn expertise, contract data, and lead generation into one coherent system.',
    theme: 'blue',
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBlueprint, setActiveBlueprint] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActiveBlueprint((v) => (v + 1) % BLUEPRINT_LABELS.length), 6500);
    return () => window.clearInterval(id);
  }, []);

  const openMail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const message = String(data.get('message') || '');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hello@digitalgnosis.dev?subject=Project idea from ${encodeURIComponent(name || 'website visitor')}&body=${body}`;
  };

  return (
    <div className="site-shell">
      <header className="nav-wrap">
        <a href="#home" className="wordmark" aria-label="Digital Gnosis home">DIGITAL GNOSIS</a>
        <nav className="desktop-nav">
          <a href="#work">Work</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cta desktop-nav" href="#contact">Let&apos;s build <ArrowRight size={14} /></a>
        <button className="menu-button" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <div className="mobile-nav">
            <a onClick={() => setMenuOpen(false)} href="#work">Work</a>
            <a onClick={() => setMenuOpen(false)} href="#capabilities">Capabilities</a>
            <a onClick={() => setMenuOpen(false)} href="#process">Process</a>
            <a onClick={() => setMenuOpen(false)} href="#contact">Contact</a>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="hero section-frame">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> IDEAS IN MOTION</div>
            <h1>You&apos;re onto<br />something.</h1>
            <p className="hero-lede">Ideas are messy. They change. They evolve. We help make sense of the moving target and turn it into something real.</p>
            <div className="hero-actions">
              <a href="#contact" className="primary-button">Make it real <ArrowRight size={17} /></a>
              <a href="#work" className="text-link">See what we build <ArrowRight size={14} /></a>
            </div>
            <div className="micro-sequence" aria-label="Digital Gnosis process">
              <span>IDEA</span><i />
              <span>UNDERSTAND</span><i />
              <span>BUILD</span><i />
              <span>RUN</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="An evolving digital blueprint">
            <div className="hero-canvas"><BlueprintMorph /></div>
            <div className="blueprint-panel panel-top">
              <span>BLUEPRINT / LIVE</span>
              <strong>{BLUEPRINT_LABELS[activeBlueprint]}</strong>
              <small>new inputs reshape the solution</small>
            </div>
            <div className="blueprint-panel panel-bottom">
              <span>MATERIALIZATION</span>
              <div className="progress"><b /></div>
              <small>concept → structure → reality</small>
            </div>
          </div>
          <div className="hero-floor" />
        </section>

        <section id="capabilities" className="section-frame section-block capabilities-section">
          <div className="section-kicker">WHAT CAN WE BUILD?</div>
          <div className="split-heading">
            <h2>The medium follows<br />the problem.</h2>
            <p>Web, mobile, automation, AI, internal software, 3D, integrations. We choose the form that fits the job instead of forcing every idea into the same template.</p>
          </div>
          <div className="capability-grid">
            {capabilities.map(({ icon: Icon, label, text }) => (
              <article className="capability-card" key={label}>
                <Icon size={22} strokeWidth={1.5} />
                <h3>{label}</h3>
                <p>{text}</p>
              </article>
            ))}
            <article className="capability-card capability-more">
              <span className="plus">+</span>
              <h3>And whatever&apos;s next.</h3>
              <p>If it is digital and useful, it is in scope.</p>
            </article>
          </div>
        </section>

        <section className="section-frame section-block friction-section">
          <div className="section-kicker">GOOD IDEAS SHOULD NOT DIE HERE</div>
          <h2>Most ideas hit the same walls.</h2>
          <div className="barrier-grid">
            {barriers.map(({ icon: Icon, title, text }) => (
              <article className="barrier" key={title}>
                <Icon size={20} strokeWidth={1.5} />
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
          <div className="friction-payoff">
            <div className="materialize-line"><span /><span /><span /><b /></div>
            <div>
              <div className="section-kicker">DIGITAL GNOSIS</div>
              <h3>We remove the friction.</h3>
              <p>We talk with you, build with you, and stay responsible for what happens after launch.</p>
            </div>
          </div>
        </section>

        <section id="work" className="section-frame section-block work-section">
          <div className="section-kicker">REAL WORK, LIVE RIGHT NOW</div>
          <div className="split-heading work-heading">
            <h2>Ideas in the wild.</h2>
            <p>Not concept art. Not made-up case studies. Real things people can open, use, and pay through today.</p>
          </div>
          <div className="project-stack">
            {projects.map((project) => (
              <a key={project.name} className={`project-card project-${project.theme}`} href={project.url} target="_blank" rel="noreferrer">
                <div className="project-copy">
                  <div className="live-chip"><span /> LIVE</div>
                  <p className="project-client">{project.client}</p>
                  <h3>{project.name}</h3>
                  <p>{project.blurb}</p>
                  <div className="tag-row">{project.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  <div className="project-link">Visit live project <ExternalLink size={15} /></div>
                </div>
                <div className="project-preview" aria-hidden="true">
                  <div className="browser-chrome"><i /><i /><i /></div>
                  <div className="preview-layout">
                    <div className="preview-sidebar" />
                    <div className="preview-main">
                      <div className="preview-headline" />
                      <div className="preview-subline" />
                      <div className="preview-cards"><span /><span /><span /></div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="process" className="section-frame section-block process-section">
          <div className="section-kicker">SIMPLE ON PURPOSE</div>
          <h2>Talk. Build. Run.</h2>
          <p className="process-intro">The process should not be harder than the problem.</p>
          <div className="process-track">
            <article><span>01</span><div className="process-shape shape-chaos"><i /><i /><i /><i /><i /></div><h3>Talk</h3><p>Tell us what is annoying, broken, missing, or stuck in your head.</p></article>
            <div className="process-arrow">→</div>
            <article><span>02</span><div className="process-shape shape-build"><i /><i /><i /><i /><i /></div><h3>Build</h3><p>We turn the moving idea into a working system and show progress as it takes shape.</p></article>
            <div className="process-arrow">→</div>
            <article><span>03</span><div className="process-shape shape-run"><i /><i /><i /><i /><i /></div><h3>Run</h3><p>We deploy it, maintain it, and keep changing it when the real world changes.</p></article>
          </div>
        </section>

        <section id="contact" className="section-frame section-block contact-section">
          <div className="contact-copy">
            <div className="section-kicker">LET&apos;S MAKE IT REAL</div>
            <h2>What are you<br />thinking about?</h2>
            <p>You do not need a spec, a stack, or the right terminology. Start with the idea or the problem.</p>
            <a href="mailto:hello@digitalgnosis.dev" className="email-link"><Mail size={16} /> hello@digitalgnosis.dev</a>
          </div>
          <form className="contact-form" onSubmit={openMail}>
            <textarea name="message" required rows={6} placeholder="I've been thinking about..." />
            <div className="form-row">
              <input name="name" required placeholder="Name" />
              <input name="email" required type="email" placeholder="Email" />
            </div>
            <button className="primary-button" type="submit">Start the conversation <ArrowRight size={17} /></button>
          </form>
        </section>
      </main>

      <footer className="section-frame footer">
        <div><strong>DIGITAL GNOSIS</strong><span>Ideas change. Good systems evolve with them.</span></div>
        <nav><a href="#work">Work</a><a href="#process">Process</a><a href="#contact">Contact</a></nav>
      </footer>
    </div>
  );
}

export default App;
