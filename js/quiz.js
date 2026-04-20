/* global React, ReactDOM */

const { useState, useEffect, useRef } = React;

function useIsMobile(breakpoint = 900) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' && window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return mobile;
}

/* ============================================
   QUIZ — Full-screen takeover, one question at a time
   ============================================ */

const QUIZ_STEPS = [
  {
    key: 'property',
    eyebrow: 'Step 01 — Site',
    question: <>What is the nature of your <em>property?</em></>,
    helper: 'We design around your land — topography, orientation, privacy.',
    placeholder: 'water',
    placeholderLabel: 'PROPERTY — SITE STUDY',
    options: [
      { value: 'private', label: 'Private residence', sub: 'Primary home' },
      { value: 'estate', label: 'Estate / second home', sub: 'Multi-acre property' },
      { value: 'new', label: 'New construction', sub: 'Building from the ground' },
      { value: 'commercial', label: 'Commercial / hospitality', sub: 'Hotel, club, resort' },
    ],
  },
  {
    key: 'scope',
    eyebrow: 'Step 02 — Scope',
    question: <>What kind of project are you <em>considering?</em></>,
    helper: 'We work in three modes. Tell us which fits.',
    placeholder: 'stone',
    placeholderLabel: 'SCOPE — STUDIES',
    options: [
      { value: 'newbuild', label: 'A new pool', sub: 'Designed from scratch' },
      { value: 'reno', label: 'Renovation of an existing pool', sub: 'Refinish, reshape, modernize' },
      { value: 'complete', label: 'Pool + landscape + outdoor living', sub: 'Full environment' },
      { value: 'unsure', label: 'Not yet decided', sub: 'Still exploring' },
    ],
  },
  {
    key: 'style',
    eyebrow: 'Step 03 — Form',
    question: <>Which direction feels closest to <em>yours?</em></>,
    helper: 'A rough aesthetic — we will refine in discovery.',
    placeholder: 'dusk',
    placeholderLabel: 'FORM — REFERENCES',
    options: [
      { value: 'modern', label: 'Architectural & modern', sub: 'Clean lines, rectilinear, stone' },
      { value: 'natural', label: 'Naturalistic / organic', sub: 'Boulder, softer edges, landscape-driven' },
      { value: 'classical', label: 'Classical / formal', sub: 'Symmetry, traditional detailing' },
      { value: 'resort', label: 'Resort-inspired', sub: 'Vanishing edge, beach entry, spa' },
    ],
  },
  {
    key: 'features',
    eyebrow: 'Step 04 — Features',
    question: <>Which elements feel <em>essential?</em></>,
    helper: 'Select any that apply. You can add more in discovery.',
    placeholder: 'water',
    placeholderLabel: 'FEATURES — DETAIL STUDIES',
    multi: true,
    options: [
      { value: 'vanishing', label: 'Vanishing edge', sub: 'Horizon-blurring water' },
      { value: 'spa', label: 'Integrated spa', sub: 'Raised or flush' },
      { value: 'automation', label: 'Smart automation', sub: 'App control, scenes' },
      { value: 'waterfeatures', label: 'Scuppers, fire, fountains', sub: 'Water and fire detail' },
      { value: 'lighting', label: 'Curated lighting', sub: 'Dusk-to-dawn presence' },
      { value: 'cabana', label: 'Cabana / outdoor room', sub: 'Shade, kitchen, lounge' },
      { value: 'cover', label: 'Automated cover', sub: 'Safety and efficiency' },
      { value: 'plunge', label: 'Cold plunge', sub: 'Paired with the spa' },
    ],
  },
  {
    key: 'timeline',
    eyebrow: 'Step 05 — Timing',
    question: <>When do you imagine <em>breaking ground?</em></>,
    helper: 'Shoreline projects typically take 6–14 months from discovery to dive.',
    placeholder: 'stone',
    placeholderLabel: 'TIMELINE — STUDIES',
    options: [
      { value: 'immediate', label: 'Within 3 months', sub: 'Ready now' },
      { value: 'season', label: '3–6 months', sub: 'Next season' },
      { value: 'year', label: '6–12 months', sub: 'Planning ahead' },
      { value: 'exploring', label: 'No firm date', sub: 'Researching' },
    ],
  },
  {
    key: 'budget',
    eyebrow: 'Step 06 — Investment',
    question: <>What investment are you <em>planning for?</em></>,
    helper: 'Transparent pricing lets us propose the right scope. All figures approximate.',
    placeholder: 'dusk',
    placeholderLabel: 'INVESTMENT — PARAMETERS',
    budget: true,
  },
  {
    key: 'contact',
    eyebrow: 'Step 07 — Introductions',
    question: <>How should we <em>reach you?</em></>,
    helper: 'A senior designer will respond personally within two business days.',
    placeholder: 'water',
    placeholderLabel: 'CONTACT — INTRODUCTION',
    contact: true,
  },
];

const BUDGET_TIERS = [
  { min: 50, label: '$50k — $95k', tier: 'Essential', note: 'Refined fundamentals, quality materials.' },
  { min: 95, label: '$95k — $150k', tier: 'Considered', note: 'Bespoke form, custom details.' },
  { min: 150, label: '$150k — $250k', tier: 'Signature', note: 'Full architectural integration, premium finishes.' },
  { min: 250, label: '$250k+', tier: 'Estate', note: 'No-compromise design. Often includes landscape.' },
];

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf; const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

function BudgetSlider({ value, onChange, isMobile }) {
  const min = 50, max = 300;
  const pct = ((value - min) / (max - min)) * 100;
  const currentTier = [...BUDGET_TIERS].reverse().find(t => value >= t.min) || BUDGET_TIERS[0];
  const display = value >= 250 ? '$250k+' : `$${Math.round(value)}k`;

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'baseline', justifyContent: 'space-between', marginBottom: 40, gap: isMobile ? 8 : 0 }}>
        <div>
          <div className="label" style={{ color: 'var(--mute)', marginBottom: 10 }}>Your investment</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: isMobile ? 52 : 72,
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}>
            {display}
          </div>
        </div>
        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <div className="label" style={{ color: 'var(--mute)', marginBottom: 10 }}>Tier</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 28,
            color: 'var(--ink)',
          }}>
            {currentTier.tier}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', height: 40, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'var(--line)' }} />
        {BUDGET_TIERS.map((t, i) => {
          const tp = ((t.min - min) / (max - min)) * 100;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${tp}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 1, height: value >= t.min ? 14 : 8,
              background: value >= t.min ? 'var(--ink)' : 'var(--mute)',
              transition: 'height 300ms, background 300ms',
            }} />
          );
        })}
        <div style={{
          position: 'absolute', left: 0, width: `${pct}%`,
          height: 1, background: 'var(--ink)',
          transition: 'width 120ms',
        }} />
        <div style={{
          position: 'absolute', left: `${pct}%`,
          transform: 'translate(-50%, 0)',
          width: 18, height: 18,
          borderRadius: '50%',
          background: 'var(--ink)',
          pointerEvents: 'none',
        }} />
        <input
          type="range" min={min} max={max} step={5}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer', margin: 0,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <span className="mono" style={{ color: 'var(--mute)' }}>$50K</span>
        <span className="mono" style={{ color: 'var(--mute)' }}>$300K</span>
      </div>

      <div style={{
        marginTop: 48, paddingTop: 28, borderTop: '1px solid var(--line-soft)',
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '160px 1fr', gap: isMobile ? 8 : 28,
      }}>
        <div className="label" style={{ color: 'var(--mute)', paddingTop: 4 }}>What this includes</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, lineHeight: 1.5,
          color: 'var(--ink-soft)',
        }}>
          {currentTier.note}
        </div>
      </div>
    </div>
  );
}

function ContactStep({ values, onChange }) {
  return (
    <div style={{ display: 'grid', gap: 28, maxWidth: 560 }}>
      {[
        { k: 'name', label: 'Full name', type: 'text' },
        { k: 'email', label: 'Email', type: 'email' },
        { k: 'phone', label: 'Phone', type: 'tel' },
        { k: 'city', label: 'City & state', type: 'text' },
      ].map(field => (
        <div key={field.k}>
          <label className="label" style={{ display: 'block', color: 'var(--mute)', marginBottom: 12 }}>
            {field.label}
          </label>
          <input
            type={field.type}
            value={values[field.k] || ''}
            onChange={e => onChange({ ...values, [field.k]: e.target.value })}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--line)',
              padding: '12px 0',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26,
              fontWeight: 300,
              color: 'var(--ink)',
              outline: 'none',
              letterSpacing: '-0.01em',
            }}
            onFocus={e => e.target.style.borderBottomColor = 'var(--ink)'}
            onBlur={e => e.target.style.borderBottomColor = 'var(--line)'}
          />
        </div>
      ))}
    </div>
  );
}

function QuizOptions({ options, value, onChange, multi, isMobile }) {
  const isSelected = (v) => multi ? (value || []).includes(v) : value === v;
  const toggle = (v) => {
    if (multi) {
      const next = isSelected(v) ? value.filter(x => x !== v) : [...(value || []), v];
      onChange(next);
    } else {
      onChange(v);
    }
  };
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
      gap: 1,
      background: 'var(--line)',
      border: '1px solid var(--line)',
      maxWidth: 720,
    }}>
      {options.map(opt => {
        const sel = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            style={{
              background: sel ? 'var(--ink)' : 'var(--bg)',
              color: sel ? 'var(--bg)' : 'var(--ink)',
              border: 'none',
              padding: '28px 24px',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 300ms, color 300ms',
              minHeight: 110,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              gap: 10,
              position: 'relative',
            }}
            onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'var(--bg-2)'; }}
            onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'var(--bg)'; }}
          >
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}>
              {opt.label}
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 500,
              opacity: 0.75,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>{opt.sub}</span>
              {sel && <span style={{ fontSize: 14 }}>●</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function QuizComplete({ answers, onClose, onReset, isMobile }) {
  const tier = [...BUDGET_TIERS].reverse().find(t => answers.budget >= t.min) || BUDGET_TIERS[0];
  const countVal = useCountUp(answers.budget, true, 1600);
  const display = countVal >= 250 ? '$250k+' : `$${Math.round(countVal)}k`;
  return (
    <div style={{
      padding: isMobile ? '32px 20px' : '80px 80px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? 40 : 80,
      alignItems: 'center',
      height: '100%',
      maxWidth: 1400,
      margin: '0 auto',
      overflowY: 'auto',
    }}>
      <div>
        <div className="label" style={{ color: 'var(--mute)', marginBottom: 40 }}>Received · Thank you</div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: 'clamp(42px, 5vw, 68px)',
          lineHeight: 0.98,
          letterSpacing: '-0.02em',
          marginBottom: 36,
        }}>
          Your brief is with our<br/><em>design studio.</em>
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20,
          lineHeight: 1.55,
          color: 'var(--ink-soft)',
          maxWidth: 520,
          marginBottom: 48,
        }}>
          {answers.name ? `${answers.name.split(' ')[0]}, thank you. ` : ''}
          A senior designer will review your vision and reach out within two business days
          to schedule a discovery conversation. Expect a quiet, unhurried process from here.
        </p>
        <button className="btn-ghost" onClick={onClose}>
          <span>Return to Shoreline</span><span className="arrow">→</span>
        </button>
        <button
          className="btn-ghost"
          onClick={onReset}
          style={{ marginLeft: 40, color: 'var(--mute)' }}
        >
          <span>Start over</span>
        </button>
      </div>
      <div>
        <div style={{
          border: '1px solid var(--line)',
          padding: '40px 36px',
          background: 'var(--panel)',
        }}>
          <div className="label" style={{ color: 'var(--mute)', marginBottom: 8 }}>Anticipated investment</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 72,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: 8,
          }}>
            {display}
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 22,
            color: 'var(--ink-soft)',
            marginBottom: 32,
          }}>
            {tier.tier} tier
          </div>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24, display: 'grid', gap: 16 }}>
            {[
              ['Property', answers.property],
              ['Scope', answers.scope],
              ['Form', answers.style],
              ['Features', (answers.features || []).length ? `${answers.features.length} selected` : '—'],
              ['Timeline', answers.timeline],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16,
                fontSize: 13, lineHeight: 1.5,
              }}>
                <span className="label" style={{ color: 'var(--mute)' }}>{k}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, textTransform: 'capitalize' }}>
                  {v || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Quiz({ open, onClose }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({ budget: 150, features: [], contact: {} });
  const [complete, setComplete] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStepIdx(0);
        setComplete(false);
        setAnswers({ budget: 150, features: [], contact: {} });
      }, 500);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const step = QUIZ_STEPS[stepIdx];
  const total = QUIZ_STEPS.length;

  const currentValue = step ? (
    step.budget ? answers.budget :
    step.contact ? answers.contact :
    answers[step.key]
  ) : null;

  const canAdvance = () => {
    if (!step) return false;
    if (step.budget) return true;
    if (step.contact) {
      return answers.contact.name && answers.contact.email && answers.contact.phone;
    }
    if (step.multi) return (currentValue || []).length > 0;
    return !!currentValue;
  };

  const advance = () => {
    if (!canAdvance()) return;
    if (stepIdx === total - 1) {
      setComplete(true);
      return;
    }
    setDirection(1);
    setStepIdx(stepIdx + 1);
  };

  const back = () => {
    if (stepIdx === 0) { onClose(); return; }
    setDirection(-1);
    setStepIdx(stepIdx - 1);
  };

  const reset = () => {
    setStepIdx(0);
    setComplete(false);
    setAnswers({ budget: 150, features: [], contact: {} });
  };

  const isMobile = useIsMobile();

  const flatAnswers = {
    ...answers,
    ...answers.contact,
  };

  return (
    <div className={`quiz-overlay ${open ? 'open' : ''}`}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '16px 20px' : '24px 40px',
        borderBottom: '1px solid var(--line)',
      }}>
        <div className="logo" style={{ fontSize: 18 }}>SHORELINE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {!complete && (
            <div className="mono" style={{ color: 'var(--mute)' }}>
              {String(stepIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
          )}
          <button onClick={onClose} className="label" style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--mute)', padding: 0,
          }}>
            Close ✕
          </button>
        </div>
      </div>

      {!complete && (
        <div style={{
          height: 1,
          background: 'var(--line)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${((stepIdx + 1) / total) * 100}%`,
            background: 'var(--ink)',
            transition: 'width 600ms cubic-bezier(0.7, 0, 0.2, 1)',
          }} />
        </div>
      )}

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {complete ? (
          <QuizComplete answers={flatAnswers} onClose={onClose} onReset={reset} isMobile={isMobile} />
        ) : (
          <div
            key={stepIdx}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
              height: '100%',
              animation: `quiz-enter 700ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            <div style={{
              padding: isMobile ? '28px 20px 20px' : '80px 80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: isMobile ? 'flex-start' : 'center',
              overflowY: 'auto',
            }}>
              <div className="label" style={{ color: 'var(--mute)', marginBottom: isMobile ? 20 : 40 }}>
                {step.eyebrow}
              </div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: isMobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(36px, 4vw, 60px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: isMobile ? 16 : 24,
                maxWidth: 720,
              }}>
                {step.question}
              </h1>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? 16 : 19,
                lineHeight: 1.5,
                color: 'var(--ink-soft)',
                marginBottom: isMobile ? 28 : 56,
                maxWidth: 540,
              }}>
                {step.helper}
              </p>

              {step.budget ? (
                <BudgetSlider
                  value={answers.budget}
                  onChange={(v) => setAnswers(a => ({ ...a, budget: v }))}
                  isMobile={isMobile}
                />
              ) : step.contact ? (
                <ContactStep
                  values={answers.contact}
                  onChange={(v) => setAnswers(a => ({ ...a, contact: v }))}
                />
              ) : (
                <QuizOptions
                  options={step.options}
                  value={currentValue}
                  onChange={(v) => setAnswers(a => ({ ...a, [step.key]: v }))}
                  multi={step.multi}
                  isMobile={isMobile}
                />
              )}
            </div>

            {!isMobile && <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-3)' }}>
              <div
                className={`ph ph-${step.placeholder}`}
                style={{
                  position: 'absolute', inset: '-4% 0',
                  animation: 'quiz-img-enter 1100ms cubic-bezier(0.16, 1, 0.3, 1)',
                  width: '100%', height: '108%',
                }}
              >
                <div className="ph-label">{step.placeholderLabel}</div>
              </div>
              <div style={{
                position: 'absolute',
                top: 40, right: 40,
                color: 'rgba(255,255,255,0.8)',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 180,
                lineHeight: 1,
                letterSpacing: '-0.04em',
              }}>
                {String(stepIdx + 1).padStart(2, '0')}
              </div>
            </div>}
          </div>
        )}
      </div>

      {!complete && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: isMobile ? '16px 20px' : '24px 40px',
          borderTop: '1px solid var(--line)',
        }}>
          <button
            onClick={back}
            className="label"
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--ink-soft)', padding: 0,
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            ← {stepIdx === 0 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={advance}
            disabled={!canAdvance()}
            style={{
              background: canAdvance() ? 'var(--ink)' : 'transparent',
              color: canAdvance() ? 'var(--bg)' : 'var(--mute)',
              border: canAdvance() ? 'none' : '1px solid var(--line)',
              padding: '16px 32px',
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 500,
              cursor: canAdvance() ? 'pointer' : 'not-allowed',
              transition: 'all 300ms',
              display: 'inline-flex', alignItems: 'center', gap: 12,
            }}
          >
            {stepIdx === total - 1 ? 'Submit brief' : 'Continue'} →
          </button>
        </div>
      )}
    </div>
  );
}

window.Quiz = Quiz;
window.QUIZ_STEPS = QUIZ_STEPS;
window.BUDGET_TIERS = BUDGET_TIERS;
