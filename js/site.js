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
    quote: "Outstanding contractor, delivers as promised, upfront and honest, doesn't nickel-and-dime.",
    author: "Joe Marsh",
    location: "Mobile, AL",
    project: "Backyard Pool Renovation",
  },
  {
    quote: "Installed our fiberglass pool basically in ONE DAY! The team was incredibly efficient and the result looks fantastic.",
    author: "Christopher Gates",
    location: "Mobile, AL",
    project: "Fiberglass Pool Installation",
  },
  {
    quote: "Clay transformed our backyard completely. The waterfall and paver deck look like something out of a resort — we get compliments from every guest.",
    author: "Michael & Sarah T.",
    location: "Daphne, AL",
    project: "Paver-Edge Pool & Water Feature",
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
    name: <>A Liner <em>Pool</em></>,
    location: 'Mobile, Alabama',
    desc: 'A clean residential liner pool built for a Midtown Mobile family. Blue speckle liner, decorative tile border, brushed concrete coping. Built right, built to last.',
    meta: 'NEW BUILD · 2023 · AL',
    placeholder: 'stone',
    photo: 'images/waterscapes-photo-1.webp',
    phLabel: 'POOL — MIDTOWN MOBILE RESIDENCE',
    variant: 'standard',
    slug: 'paver-edge-pool',
  },
  {
    no: '002',
    name: <>Lakeside <em>Rectangle</em></>,
    location: 'Daphne, Alabama',
    desc: 'A rectangular pool with dark stamped concrete deck set against a lakeside lot in Daphne. Stone planter wall, long summer view to the water.',
    meta: 'NEW BUILD · 2022 · AL',
    placeholder: 'water',
    photo: 'images/waterscapes-photo-2.webp',
    phLabel: 'POOL — DAPHNE LAKESIDE',
    variant: 'sidebar',
    slug: 'lakeside-rectangle',
  },
  {
    no: '003',
    name: <>A Family <em>Backyard Pool</em></>,
    location: 'Spanish Fort, Alabama',
    desc: 'A full-size rectangle with a diving board, built for a family in Spanish Fort. Vinyl liner, concrete deck, aluminum safety fence. A pool the whole neighborhood remembers.',
    meta: 'NEW BUILD · 2023 · AL',
    placeholder: 'dusk',
    photo: 'images/waterscapes-photo-3.webp',
    phLabel: 'POOL — SPANISH FORT RESIDENCE',
    variant: 'overlay',
    slug: 'waterfront-pool',
  },
  {
    no: '004',
    name: <>Custom Water <em>Feature</em></>,
    location: 'Mobile, Alabama',
    desc: 'A stone waterfall feature added to an existing pool. Dual-blade cascade over a semicircular block wall. The pool was already there — the waterfall made it theirs.',
    meta: 'RENOVATION · 2024 · AL',
    placeholder: 'stone',
    photo: 'images/waterscapes-photo-4.webp',
    phLabel: 'WATER FEATURE — MOBILE RESIDENCE',
    variant: 'asymmetric',
    slug: 'custom-water-feature',
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
    heading: <>Fifteen years of <em>considered work.</em></>,
    intro: 'Started in 2010 as Mobile\'s go-to gunite repair team. Grew into full custom pool design and construction because clients kept asking for more. We build across Mobile and Baldwin County — and we show up for every project ourselves.',
    stats: [
      { value: 100, suffix: '+', label: 'Pools completed across two counties' },
      { value: 15, label: 'Years in practice' },
      { value: 4.9, small: true, suffix: '/5', label: 'Client satisfaction rating' },
      { value: 100, suffix: '%', label: 'Satisfaction guarantee' },
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
        <div><span className="award-name">Nappie Award</span> Best Pool Construction 2025</div>
        <div><span className="award-name">Lagniappe Mobile</span> Reader's Choice</div>
        <div><span className="award-name">Mobile County</span> Licensed &amp; Insured</div>
        <div><span className="award-name">Baldwin County</span> Licensed &amp; Insured</div>
        <div><span className="award-name">15 Years</span> Serving Mobile &amp; Gulf Coast</div>
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
    title: <>Custom <em>Builds</em></>,
    desc: 'Ground-up gunite pools designed for your yard, your family, and your budget. From clean rectangular builds to resort-style retreats with waterfalls and grottos.',
    bullets: [
      'Custom inground pool design & engineering',
      'Waterfalls, grottos & water feature integration',
      'Spa, hot tub & sun shelf options',
      'Paver deck, landscaping & LED lighting',
    ],
    placeholder: 'water',
    photo: 'https://waterscapesdesigns.com/wp-content/uploads/2017/02/DSC_0509-1024x680.jpg',
    phLabel: 'SERVICE — CUSTOM BUILDS',
  },
  {
    no: '02',
    title: <>Pool <em>Renovations</em></>,
    desc: 'Existing pools, elevated. We replaster, retile, reshape, and modernize — or rebuild completely when the bones call for it.',
    bullets: [
      'Replaster, retile & recoping',
      'Gunite repair & resurfacing',
      'Equipment modernization & automation',
      'Paver and landscape reset',
    ],
    placeholder: 'stone',
    photo: 'https://waterscapesdesigns.com/wp-content/uploads/2017/02/DSC_0529-1024x680.jpg',
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

function Hero({ onStartQuiz, headline = 'serene', eyebrow = 'Custom Pool Builders · Since 2010' }) {
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="hero-bg" />
      <div className="hero-video" />
      <div className="hero-video-tag">
        <span className="rec" />
        <span>Film Plate — Replace with client reel</span>
      </div>
      <div className="hero-mono">WATERSCAPES / PROJECT GALLERY — 2025 / MOBILE, ALABAMA</div>
      <div className="hero-meta">EST. MMX · ALABAMA</div>

      <div className="hero-copy">
        <div className="hero-eyebrow">{eyebrow}</div>
        <h1 className="hero-title">{HEADLINES[headline] || HEADLINES.serene}</h1>
        <button className="btn-ghost hero-cta" onClick={onStartQuiz}>
          <span>Begin your design brief</span>
          <span className="arrow">→</span>
        </button>
      </div>

      <div className="hero-bottom-right">
        Featured — Daphne Lakeside Residence<br/>
        Alabama / 2022
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
            <div className="logo">WATERSCAPES</div>
            <a href="tel:+12516805579" className="footer-mobile-phone">+1 251 680 5579</a>
          </div>
          <p className="footer-tag">
            Custom inground pools for homeowners across Mobile and Baldwin County — designed and built by a team that has been doing this since 2010.
          </p>
          <p className="footer-tag-short">
            Custom inground pools designed and built across Mobile and Baldwin County.
          </p>
          <div className="footer-contact-line">
            <span className="footer-address">Studio &nbsp;·&nbsp; 7080 Westchester Dr, Mobile AL</span>
            <span className="footer-contact-details">
              <br/><a href="tel:+12516805579">+1 251 680 5579</a>
              <br/><a href="mailto:clay@waterscapesdesigns.com">clay@waterscapesdesigns.com</a>
            </span>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Service Areas</div>
          <ul>
            <li>Mobile &amp; Midtown, AL</li>
            <li>Daphne &amp; Spanish Fort, AL</li>
            <li>Gulf Shores &amp; Orange Beach, AL</li>
            <li>Fairhope &amp; Foley, AL</li>
            <li>Mobile County</li>
            <li>Baldwin County</li>
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
          <span>© 2026 Waterscapes Pool Design &amp; Construction</span>
          <span className="footer-dsk">&nbsp;·&nbsp; Licensed &amp; Insured · AL</span>
        </div>
        <div className="footer-credentials">
          <span>Licensed · Bonded · Insured</span>
          <span className="footer-dsk">Nappie Award 2025</span>
          <span className="footer-dsk">Mobile &amp; Baldwin County</span>
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
          WATERSCAPES
        </a>
        <div className="nav-right">
          <a href="tel:+12516805579" className="nav-link">+1 251 680 5579</a>
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
