/* global React */

const { useEffect, useRef, useState } = React;

/* ============================================
   Scroll reveal hook
   ============================================ */

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal, .reveal-line') || [];
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ============================================
   Parallax image
   ============================================ */

function Parallax({ children, speed = 0.2 }) {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2 - vh / 2;
      const translate = -center * speed;
      ref.current.style.transform = `translate3d(0, ${translate.toFixed(1)}px, 0)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed]);
  return <div ref={ref} className="project-img-wrap">{children}</div>;
}

/* ============================================
   Count-up stat
   ============================================ */

function Stat({ value, suffix, label, small }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const start = performance.now();
          const duration = 1800;
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(value * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  const rendered = small ? display.toFixed(1) : Math.round(display).toLocaleString();
  return (
    <div className="stat" ref={ref}>
      <div className="stat-value">{rendered}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ============================================
   Testimonials
   ============================================ */

const TESTIMONIALS = [
  {
    quote: "We interviewed four builders. Shoreline was the only one who walked our property before proposing anything. The finished pool feels like it was always meant to be there.",
    author: "Elena & Marcus R.",
    location: "Rosemary Beach, FL",
    project: "A Courtyard Pool",
  },
  {
    quote: "They talked us out of two features we thought we wanted. Best design advice we received during the entire build. Every decision felt considered, not sold.",
    author: "David H.",
    location: "Perdido Key, FL",
    project: "Gulf-View Vanishing Edge",
  },
  {
    quote: "Fourteen months from our first conversation to dive. Never once were we in the dark about a decision, a timeline, or a number. Quiet, thorough, and on budget.",
    author: "Pritha & James S.",
    location: "Seagrove Beach, FL",
    project: "Gulf-Facing Pool & Spa",
  },
];

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];
  return (
    <section id="testimonials" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="section-head">
        <div className="number-marker">003 — Voices</div>
        <h2>In their own <em>words.</em></h2>
        <div className="section-intro">
          The clients we are proudest of are the ones who refer us — quietly, years later, to their closest friends.
        </div>
      </div>
      <div className="testimonial-wrap">
        <div className="t-nav">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={i}
              className={i === idx ? 'active' : ''}
              onClick={() => setIdx(i)}
            >
              {String(i + 1).padStart(2, '0')} {item.location.split(',')[0]}
            </button>
          ))}
        </div>
        <div className="testimonial-slide" key={idx} style={{ animation: 'fade-up 700ms cubic-bezier(0.16,1,0.3,1)' }}>
          <blockquote className="testimonial-quote">
            {t.quote}
          </blockquote>
          <div className="testimonial-meta">
            <span>{t.author}</span>
            <span className="divider" />
            <span>{t.location}</span>
            <span className="divider" />
            <span style={{ fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif", textTransform: 'none', letterSpacing: 0, fontSize: 15 }}>{t.project}</span>
          </div>
        </div>
        <div className="t-counter">
          {String(idx + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Projects
   ============================================ */

const PROJECTS = [
  {
    no: '001',
    name: <>A Courtyard <em>Pool</em></>,
    location: 'Rosemary Beach, Florida',
    desc: 'A twenty-four-meter rectangular pool set within a walled coastal courtyard, framed by sea grape and native palms. Hand-troweled plaster in bone.',
    meta: 'NEW BUILD · 2025 · FL',
    placeholder: 'stone',
    photo: 'https://images.pexels.com/photos/15994062/pexels-photo-15994062.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=1',
    phLabel: 'POOL — ROSEMARY BEACH RESIDENCE',
    variant: 'standard',
    slug: 'courtyard-pool',
  },
  {
    no: '002',
    name: <>Gulf-View Vanishing <em>Edge</em></>,
    location: 'Perdido Key, Florida',
    desc: 'A negative-edge pool oriented to the Gulf, disappearing into the afternoon light off the water. Limestone coping, thirty-foot infinity run.',
    meta: 'NEW BUILD · 2024 · FL',
    placeholder: 'water',
    photo: 'images/project-002-gulf-view.webp',
    phLabel: 'POOL — PERDIDO KEY WATERFRONT',
    variant: 'sidebar',
    slug: 'gulf-view-vanishing-edge',
  },
  {
    no: '003',
    name: <>Gulf-Facing Pool &amp; <em>Spa</em></>,
    location: 'Seagrove Beach, Florida',
    desc: 'A restrained, symmetrical composition. Dark-plaster basin reads like water-within-water against the Gulf beyond. Integrated raised spa.',
    meta: 'NEW BUILD · 2024 · FL',
    placeholder: 'dusk',
    photo: 'images/project-003-gulf-facing.webp',
    phLabel: 'POOL — SEAGROVE BEACH ESTATE',
    variant: 'overlay',
    slug: 'gulf-facing-pool-spa',
  },
  {
    no: '004',
    name: <>Dune-Edge Plunge &amp; <em>Cabana</em></>,
    location: 'Gulf Shores, Alabama',
    desc: 'A cold plunge, integrated spa, and shaded cabana set into a dune-edge lot. A meditation on quiet, not spectacle.',
    meta: 'RENOVATION · 2023 · AL',
    placeholder: 'stone',
    photo: 'https://images.pexels.com/photos/8134745/pexels-photo-8134745.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=1',
    phLabel: 'POOL — GULF SHORES RENOVATION',
    variant: 'asymmetric',
    slug: 'dune-edge-plunge-cabana',
  },
];

function ProjectSidebar({ p, total }) {
  return (
    <article className={`project variant-sidebar`}>
      <div className="project-sidebar reveal">
        <div className="mono" style={{ color: 'var(--mute)', marginBottom: 32 }}>
          {p.no} / {String(total).padStart(3, '0')}
        </div>
        <h3 className="project-name" style={{ marginBottom: 24 }}>
          {p.name}
          <span className="loc">{p.location}</span>
        </h3>
        <p className="project-desc" style={{ marginBottom: 24 }}>{p.desc}</p>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--mute)', fontWeight: 500, marginBottom: 20,
        }}>{p.meta}</div>
        <a href={`project-${p.slug}.html`} className="btn-ghost" style={{ fontSize: 10.5 }}>
          <span>View project</span><span className="arrow">→</span>
        </a>
      </div>
      <div className="project-frame-wrap">
        <div className="project-frame reveal">
          <Parallax speed={0.12}>
            <div className={`ph ph-${p.placeholder}`} style={p.photo ? { backgroundImage: `url(${p.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
              <div className="ph-label">{p.phLabel}</div>
            </div>
          </Parallax>
        </div>
      </div>
    </article>
  );
}

function ProjectOverlay({ p, total }) {
  return (
    <article className="project variant-overlay">
      <div className="project-frame reveal">
        <Parallax speed={0.12}>
          <div className={`ph ph-${p.placeholder}`} style={p.photo ? { backgroundImage: `url(${p.photo})`, backgroundSize: 'cover', backgroundPosition: 'center top' } : {}}>
            <div className="ph-label">{p.phLabel}</div>
          </div>
        </Parallax>
      </div>
      <div className="project-caption" style={{ gridTemplateColumns: '180px 1fr 300px' }}>
        <div className="no reveal">{p.no} / {String(total).padStart(3, '0')}</div>
        <div className="reveal">
          <h3 className="project-name">
            {p.name}
            <span className="loc">{p.location}</span>
          </h3>
        </div>
        <div className="project-desc reveal">
          {p.desc}
          <span className="meta">{p.meta}</span>
          <a href={`project-${p.slug}.html`} className="btn-ghost" style={{ fontSize: 10.5, marginTop: 20 }}>
            <span>View project</span><span className="arrow">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function ProjectAsymmetric({ p, total }) {
  return (
    <article className="project variant-asymmetric">
      <div className="project-frame reveal">
        <Parallax speed={0.12}>
          <div className={`ph ph-${p.placeholder}`} style={p.photo ? { backgroundImage: `url(${p.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            <div className="ph-label">{p.phLabel}</div>
          </div>
        </Parallax>
      </div>
      <div className="project-caption">
        <div className="no reveal">{p.no} / {String(total).padStart(3, '0')}</div>
        <div className="reveal">
          <h3 className="project-name">
            {p.name}
            <span className="loc">{p.location}</span>
          </h3>
        </div>
        <div className="project-desc reveal">
          {p.desc}
          <span className="meta">{p.meta}</span>
          <a href={`project-${p.slug}.html`} className="btn-ghost" style={{ fontSize: 10.5, marginTop: 20 }}>
            <span>View project</span><span className="arrow">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function ProjectStandard({ p, total }) {
  return (
    <article className="project">
      <div className="project-frame reveal">
        <Parallax speed={0.12}>
          <div className={`ph ph-${p.placeholder}`} style={p.photo ? { backgroundImage: `url(${p.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            <div className="ph-label">{p.phLabel}</div>
          </div>
        </Parallax>
      </div>
      <div className="project-caption">
        <div className="no reveal">{p.no} / {String(total).padStart(3, '0')}</div>
        <div className="reveal">
          <h3 className="project-name">
            {p.name}
            <span className="loc">{p.location}</span>
          </h3>
        </div>
        <div className="project-desc reveal">
          {p.desc}
          <span className="meta">{p.meta}</span>
          <a href={`project-${p.slug}.html`} className="btn-ghost" style={{ fontSize: 10.5, marginTop: 20 }}>
            <span>View project</span><span className="arrow">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <section id="projects">
      <div className="section-head">
        <div className="number-marker">001 — Work</div>
        <h2>Selected <em>projects.</em></h2>
        <div className="section-intro">
          Each pool is designed for its site, its light, and the people who will use it. We build a small number of projects each year, on purpose.
        </div>
      </div>

      <div className="projects-stack">
        {PROJECTS.map((p) => {
          const Comp = {
            sidebar: ProjectSidebar,
            overlay: ProjectOverlay,
            asymmetric: ProjectAsymmetric,
          }[p.variant] || ProjectStandard;
          return <Comp key={p.no} p={p} total={PROJECTS.length} />;
        })}
      </div>

      <div className="projects-cta" style={{ padding: '40px 40px 80px', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
        <a href="project-courtyard-pool.html" className="btn-ghost">
          <span>Open case study</span><span className="arrow">→</span>
        </a>
      </div>
    </section>
  );
}

/* ============================================
   Process
   ============================================ */

const PROCESS_STEPS = [
  {
    no: '01',
    title: <>Discovery</>,
    duration: '4 — 6 weeks',
    desc: 'We walk the property, study the light, and listen. No renderings yet. This phase is about understanding what you want your water to do in your life.',
    deliverables: ['On-site walk', 'Program brief', 'Fee proposal', 'Site survey'],
  },
  {
    no: '02',
    title: <>Design</>,
    duration: '8 — 14 weeks',
    desc: 'Plans, sections, and material samples. We design iteratively — you will see three revisions before we commit a single line to construction.',
    deliverables: ['Concept plan', 'Material boards', 'Renderings', 'Final construction drawings'],
  },
  {
    no: '03',
    title: <>Build</>,
    duration: '16 — 28 weeks',
    desc: 'A single project manager. Weekly walkthroughs. Photographed milestones. You will never wonder what is happening on your property.',
    deliverables: ['Excavation & shell', 'Plumbing & electrical', 'Tile, coping, decking', 'Plaster & commissioning'],
  },
  {
    no: '04',
    title: <>Care</>,
    duration: 'Ongoing',
    desc: 'A relationship, not a transaction. We return at six months, one year, and five years to ensure the pool is performing — and to make any refinements.',
    deliverables: ['Six-month visit', 'Annual service', 'Warranty program', 'Lifetime advisory'],
  },
];

function Process() {
  return (
    <section id="process" className="process-section">
      <div className="section-head" style={{ borderTop: 'none', paddingTop: 120 }}>
        <div className="number-marker">002 — Method</div>
        <h2>A process of <em>patience.</em></h2>
        <div className="section-intro">
          A project of this scale should feel unhurried and clear. Our method is built around reassurance: you will always know where we are, and what comes next.
        </div>
      </div>
      <div className="process-grid">
        {PROCESS_STEPS.map(step => (
          <div key={step.no} className="process-step reveal">
            <div className="step-no">{step.no} / 04</div>
            <div className="step-title">{step.title}</div>
            <div className="step-duration">{step.duration}</div>
            <p className="step-desc">{step.desc}</p>
            <ul className="step-deliverables">
              {step.deliverables.map(d => <li key={d}>{d}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   Credentials
   ============================================ */

const CREDENTIALS_COPY = {
  boutique: {
    heading: <>Eighteen years of <em>considered work.</em></>,
    intro: 'A small studio by choice. We build a limited number of projects each year so every detail is resolved before we dive.',
    stats: [
      { value: 142, label: 'Signature projects completed' },
      { value: 18, label: 'Years of practice' },
      { value: 4.9, small: true, suffix: '/5', label: 'Client satisfaction, post-handover' },
      { value: 100, suffix: '%', label: 'On-time project delivery, 2022–25' },
    ],
  },
  multigenerational: {
    heading: <>Three generations, <em>one standard.</em></>,
    intro: 'Since 1954. A family firm, deliberately. The grandchildren of our founder still walk every project — because trust at this scale cannot be delegated to strangers.',
    stats: [
      { value: 3400, label: 'Pools built across four states' },
      { value: 72, label: 'Years in practice' },
      { value: 4.9, small: true, suffix: '/5', label: 'Client satisfaction, post-handover' },
      { value: 86, suffix: '%', label: 'Work from referral & repeat clients' },
    ],
  },
};

function Credentials({ variant = 'boutique' }) {
  const c = CREDENTIALS_COPY[variant] || CREDENTIALS_COPY.boutique;
  return (
    <section id="credentials" className="credentials">
      <div className="credentials-head">
        <div className="number-marker">004 — Standing</div>
        <h3>{c.heading}</h3>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, lineHeight: 1.55,
          color: 'rgba(241,236,227,0.7)',
          maxWidth: 440, marginLeft: 'auto', paddingTop: 8,
        }}>
          {c.intro}
        </div>
      </div>
      <div className="credentials-stats">
        {c.stats.map((s, i) => (
          <Stat key={i} value={s.value} suffix={s.suffix} label={s.label} small={s.small} />
        ))}
      </div>
      <div className="awards-bar">
        <div><span className="award-name">APSP Gold</span> 2024 &nbsp;·&nbsp; 2023 &nbsp;·&nbsp; 2022</div>
        <div><span className="award-name">Pool & Spa News</span> Top 50 Builders</div>
        <div><span className="award-name">Luxe RED</span> Award Winner</div>
        <div><span className="award-name">AIA</span> Collaborative Partner</div>
        <div><span className="award-name">Houzz</span> Best of Design, 10 yr.</div>
      </div>
    </section>
  );
}

/* ============================================
   Services
   ============================================ */

const SERVICES = [
  {
    no: '01',
    title: <>New <em>Builds</em></>,
    desc: 'Ground-up architectural pools designed for a specific site and specific client. Most of our work — and the work we are proudest of.',
    bullets: [
      'Custom architectural design & engineering',
      'Direct collaboration with your architect',
      'Vanishing edge, spa & water feature integration',
      'Pool and surrounding landscape',
    ],
    placeholder: 'water',
    photo: 'https://images.pexels.com/photos/31817156/pexels-photo-31817156.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1260&dpr=1',
    phLabel: 'SERVICE — NEW BUILDS',
  },
  {
    no: '02',
    title: <>Thoughtful <em>Renovations</em></>,
    desc: 'Existing pools, elevated. We work with what is there — or rebuild entirely if the bones call for it.',
    bullets: [
      'Replaster, retile & recoping',
      'Reshape and reimagine the basin',
      'Full equipment modernization',
      'Landscape reset around the pool',
    ],
    placeholder: 'stone',
    photo: 'https://images.pexels.com/photos/4066865/pexels-photo-4066865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1260&dpr=1',
    phLabel: 'SERVICE — RENOVATIONS',
  },
];

function Services({ onStartQuiz }) {
  return (
    <section id="services">
      <div className="section-head">
        <div className="number-marker">005 — Services</div>
        <h2>Two ways we <em>work.</em></h2>
        <div className="section-intro">
          Most of what we do is ground-up design. We also take on renovations when the site and the client are the right fit.
        </div>
      </div>
      <div className="services">
        <div className="services-grid">
          {SERVICES.map(s => (
            <div key={s.no} className="service reveal">
              <div className="service-frame">
                <div className={`ph ph-${s.placeholder}`} style={s.photo ? { backgroundImage: `url(${s.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                  <div className="ph-label">{s.phLabel}</div>
                </div>
              </div>
              <div className="service-no">{s.no} / 02</div>
              <h4 className="service-title">{s.title}</h4>
              <p className="service-desc">{s.desc}</p>
              <ul className="service-list">
                {s.bullets.map((b, i) => (
                  <li key={b}>
                    <span className="bullet-mark">{String(i+1).padStart(2,'0')}</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="service-cta">
                <button
                  type="button"
                  onClick={onStartQuiz}
                  className="btn-ghost"
                  style={{ fontSize: 10.5, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}
                >
                  <span>Inquire</span><span className="arrow">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Hero
   ============================================ */

const HEADLINES = {
  serene:   <>Water, <em>shaped</em><br/>for the life<br/>you are <em>building.</em></>,
  architectural: <>Stone, <em>light</em>,<br/>and a considered<br/>line of <em>water.</em></>,
  masculine: <>Built to <em>outlast</em><br/>the house it<br/><em>belongs to.</em></>,
  hospitality: <>A private<br/>resort, on the<br/>land you <em>already own.</em></>,
};

function Hero({ onStartQuiz, headline = 'serene', eyebrow = 'Custom Pool Builders · Since 2007' }) {
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="hero-bg" />
      <div className="hero-video" />
      <div className="hero-video-tag">
        <span className="rec" />
        <span>Film Plate — Replace with client reel</span>
      </div>
      <div className="hero-mono">SHORELINE / FILM REEL — 2025 / AUTOPLAY MUTED</div>
      <div className="hero-meta">EST. MMVII · FLORIDA</div>

      <div className="hero-copy">
        <div className="hero-eyebrow">{eyebrow}</div>
        <h1 className="hero-title">{HEADLINES[headline] || HEADLINES.serene}</h1>
        <button className="btn-ghost hero-cta" onClick={onStartQuiz}>
          <span>Begin your design brief</span>
          <span className="arrow">→</span>
        </button>
      </div>

      <div className="hero-bottom-right">
        Featured — Paradise Valley Residence<br/>
        Arizona / 2025
      </div>
    </section>
  );
}

/* ============================================
   Quiz banner
   ============================================ */

function QuizBanner({ onStartQuiz }) {
  return (
    <section className="quiz-banner">
      <div className="quiz-banner-eyebrow">Design your pool</div>
      <h2>
        Tell us about your site, your vision, and what you want the<br/>
        water to <em>do</em> — and we will take it from there.
      </h2>
      <button className="btn-ghost" onClick={onStartQuiz}>
        <span>Begin your design brief</span>
        <span className="arrow">→</span>
      </button>
      <div className="mono" style={{ color: 'var(--mute)', marginTop: 40, letterSpacing: '0.2em' }}>
        7 QUESTIONS · ABOUT 3 MINUTES · NO OBLIGATION
      </div>
    </section>
  );
}

/* ============================================
   Footer
   ============================================ */

function Footer() {
  return (
    <footer data-screen-label="Footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <div className="logo">SHORELINE</div>
            <a href="tel:+18505550100" className="footer-mobile-phone">+1 850 555 0100</a>
          </div>
          <p className="footer-tag">
            Quiet, considered pools for homeowners who notice the difference — built across the Gulf Coast since 2007.
          </p>
          <p className="footer-tag-short">
            Quiet, considered pools for homeowners who notice the difference.
          </p>
          <div className="footer-contact-line">
            <span className="footer-address">Studio &nbsp;·&nbsp; 36 Harbor Blvd, Destin FL</span>
            <span className="footer-contact-details">
              <br/><a href="tel:+18505550100">+1 850 555 0100</a>
              <br/><a href="mailto:studio@shoreline-pools.co">studio@shoreline-pools.co</a>
            </span>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Service Areas</div>
          <ul>
            <li>Destin &amp; 30A, FL</li>
            <li>Pensacola &amp; Gulf Breeze, FL</li>
            <li>Panama City Beach, FL</li>
            <li>Gulf Shores &amp; Orange Beach, AL</li>
            <li>Santa Rosa Beach, FL</li>
            <li>Naples &amp; Marco Island, FL</li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Studio</div>
          <ul>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li className="footer-dsk"><a href="#">Journal</a></li>
            <li className="footer-dsk"><a href="#">Careers</a></li>
          </ul>
        </div>
        <div className="footer-col footer-dsk">
          <div className="footer-col-head">Inquire</div>
          <ul>
            <li><a href="#">Design brief</a></li>
            <li><a href="#">Trade program</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Warranty</a></li>
          </ul>
          <div className="footer-col-head" style={{ marginTop: 36 }}>Follow</div>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Pinterest</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>
          <span>© 2026 Shoreline Pools, LLC</span>
          <span className="footer-dsk">&nbsp;·&nbsp; FL CGC #1059874 &nbsp;·&nbsp; AL HBC #01829</span>
        </div>
        <div className="footer-credentials">
          <span>Licensed · Bonded · Insured</span>
          <span className="footer-dsk">APSP Gold</span>
          <span className="footer-dsk">AIA Collaborative</span>
        </div>
        <div className="footer-dsk">
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', marginRight: 20 }}>Privacy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   Nav
   ============================================ */

function Nav({ onStartQuiz }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-left">
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#process" className="nav-link">Process</a>
          <a href="#services" className="nav-link">Services</a>
        </div>
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
        <a href="#top" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          SHORELINE
        </a>
        <div className="nav-right">
          <a href="tel:+14805550100" className="nav-link">+1 480 555 0100</a>
          <button
            onClick={onStartQuiz}
            className="nav-link"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}
          >
            Begin brief →
          </button>
        </div>
      </nav>
      <div className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="nav-mobile-close" onClick={closeMenu} aria-label="Close menu">
          <span>Close</span><span className="x">×</span>
        </button>
        <a href="#projects" className="nav-mobile-link" onClick={closeMenu}>Projects</a>
        <a href="#process" className="nav-mobile-link" onClick={closeMenu}>Process</a>
        <a href="#services" className="nav-mobile-link" onClick={closeMenu}>Services</a>
        <button className="nav-mobile-cta" onClick={() => { closeMenu(); onStartQuiz(); }}>
          Begin your design brief →
        </button>
      </div>
    </>
  );
}

window.Site = { Nav, Hero, Projects, Process, Testimonials, Credentials, Services, QuizBanner, Footer, useReveal, HEADLINES };
