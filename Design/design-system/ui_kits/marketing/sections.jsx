/* Kheelona Marketing — sections.
   All sections are static composition. Hover bounces, header smoothscroll. */

function Header({ onNav }) {
  const items = [
    { id: 'how', label: 'How it works' },
    { id: 'values', label: 'Why Kheelona' },
    { id: 'parents', label: 'For parents' },
    { id: 'story', label: 'Our story' },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--kh-line-soft)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Logo size={36} />
        <nav style={{ display: 'flex', gap: 32 }}>
          {items.map(it => (
            <a key={it.id} href={`#${it.id}`} onClick={(e) => { e.preventDefault(); onNav?.(it.id); }}
               style={{
                 fontFamily: 'var(--kh-font-text)', fontWeight: 500, fontSize: 16,
                 color: 'var(--kh-ink-2)', textDecoration: 'none',
               }}>
              {it.label}
            </a>
          ))}
        </nav>
        <Button size="sm" onClick={() => onNav?.('order')}>Meet Kheelo</Button>
      </div>
    </header>
  );
}

function Hero({ onCTA }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <Cluster style={{ right: -180, top: -120, transform: 'rotate(-8deg)' }} />
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '80px 32px 64px',
        display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center',
      }}>
        <div>
          <span className="kh-eyebrow" style={{ fontFamily: 'var(--kh-font-accent)', fontStyle: 'italic', fontSize: 24, color: 'var(--kh-orange)' }}>
            <span style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontStyle: 'normal', letterSpacing: '-0.03em' }}>Meet</span>&nbsp;&nbsp;Kheelo
          </span>
          <h1 style={{
            fontFamily: 'var(--kh-font-text)', fontWeight: 700,
            fontSize: 84, lineHeight: 0.98, letterSpacing: '-0.035em',
            margin: '18px 0 20px', color: 'var(--kh-ink)',
          }}>
            Toys that develop&nbsp;brain.<br/>
            <span style={{ color: 'var(--kh-orange)' }}>Toy talks</span> in every&nbsp;language.
          </h1>
          <p style={{
            fontFamily: 'var(--kh-font-text)', fontSize: 22, lineHeight: 1.35,
            color: 'var(--kh-ink-3)', maxWidth: 560, margin: '0 0 32px',
          }}>
            AI-powered toys for kids 3–12. Cognitive development and vocabulary growth — without screens, without doom-scrolling, without "iPad neck".
          </p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Button variant="primary" size="lg" onClick={onCTA}>Pre-order &nbsp;→</Button>
            <Button variant="ghost" size="lg" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>How it works</Button>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 36, alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: ['#FFD6B0', '#FFB48A', '#FF916A', '#EF762F'][i], marginLeft: i ? -8 : 0, border: '2px solid #fff' }} />
              ))}
            </div>
            <div style={{ fontFamily: 'var(--kh-font-text)', fontSize: 14, color: 'var(--kh-ink-3)', lineHeight: 1.35 }}>
              <strong style={{ color: 'var(--kh-ink)' }}>3,200+ families</strong> on the waitlist.<br/>
              Ships from Mumbai · April 2026.
            </div>
          </div>
        </div>

        {/* Character collage */}
        <div style={{ position: 'relative', height: 480 }}>
          <Character shape="squircle" color="var(--kh-orange)" mood="happy" size={220} style={{ position: 'absolute', left: 80, top: 60, transform: 'rotate(-6deg)' }} />
          <Character shape="triangle-5" color="var(--kh-blue)" mood="curious" size={170} style={{ position: 'absolute', left: 0, top: 230, transform: 'rotate(8deg)' }} />
          <Character shape="flower-13" color="var(--kh-teal)" mood="ooh" size={150} style={{ position: 'absolute', right: 30, top: 0, transform: 'rotate(-12deg)' }} />
          <Character shape="polygon" color="var(--kh-purple)" mood="sleepy" size={160} style={{ position: 'absolute', right: 0, top: 280, transform: 'rotate(6deg)' }} />
          <Character shape="flower-5" color="var(--kh-yellow)" mood="giggle" size={130} style={{ position: 'absolute', right: 160, top: 320, transform: 'rotate(-3deg)' }} />
        </div>
      </div>
    </section>
  );
}

function ValueGrid() {
  const values = [
    { color: 'var(--kh-teal)', shape: 'flower-13', mood: 'ooh', title: 'Screen-free freedom', body: 'Protect childhood imagination from the doom-scrolling trap. No glass between your kid and the world.' },
    { color: 'var(--kh-orange)', shape: 'squircle', mood: 'happy', title: 'Confidence through conversation', body: 'Back-and-forth dialogue is the fastest way to build vocabulary and emotional intelligence.' },
    { color: 'var(--kh-purple)', shape: 'polygon', mood: 'curious', title: 'Problem-solving with fun', body: 'Fun today, success tomorrow. Building the grit and logic to win in real life.' },
  ];
  return (
    <section id="values" style={{ background: 'var(--kh-bg-warm)', padding: '96px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontFamily: 'var(--kh-font-accent)', fontStyle: 'italic', fontSize: 28, color: 'var(--kh-ink-3)' }}>
            <span style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontStyle: 'normal', letterSpacing: '-0.03em', color: 'var(--kh-ink)' }}>Why</span>&nbsp;&nbsp;Kheelona
          </span>
          <Tick width={110} style={{ display: 'block', marginTop: 14 }} />
          <h2 style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontSize: 56, letterSpacing: '-0.03em', color: 'var(--kh-ink)', margin: '20px 0 0', maxWidth: 720, lineHeight: 1.05 }}>
            Three things every Kheelona toy is built to do.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {values.map((v, i) => (
            <article key={i} style={{
              background: '#fff', borderRadius: 16, padding: 32, border: '1px solid var(--kh-line)',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              <Character shape={v.shape} color={v.color} mood={v.mood} size={88} />
              <h3 style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em', color: 'var(--kh-ink)', margin: 0, lineHeight: 1.15 }}>
                {v.title}
              </h3>
              <p style={{ fontFamily: 'var(--kh-font-text)', fontSize: 17, lineHeight: 1.45, color: 'var(--kh-ink-3)', margin: 0 }}>
                {v.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: 'package', title: 'Unbox a friend', body: 'Each Kheelo arrives in a hand-painted box. No app to download. No setup wizard. Pull the tab, hear "hi".' },
    { icon: 'message-circle', title: 'Talk to it', body: 'Kheelo asks questions, listens, and remembers. Kids practice articulating thoughts — the way they used to with grandparents.' },
    { icon: 'sparkles', title: 'Watch them grow', body: 'Weekly progress notes land in your inbox. Vocabulary, curiosity, dialog turns — never screen-time minutes.' },
  ];
  return (
    <section id="how" style={{ padding: '96px 32px', position: 'relative', overflow: 'hidden' }}>
      <Cluster style={{ left: -220, bottom: -180, transform: 'rotate(14deg)' }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: 'var(--kh-font-accent)', fontStyle: 'italic', fontSize: 28, color: 'var(--kh-ink-3)' }}>
            <span style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontStyle: 'normal', letterSpacing: '-0.03em', color: 'var(--kh-ink)' }}>How</span>&nbsp;&nbsp;it works
          </span>
          <Tick width={88} style={{ display: 'block', marginTop: 14 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 56, position: 'relative' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--kh-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--kh-font-display)', fontWeight: 700, fontSize: 22, boxShadow: 'var(--kh-shadow)' }}>
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--kh-ink)', margin: 0 }}>{s.title}</h3>
              </div>
              <p style={{ fontFamily: 'var(--kh-font-text)', fontSize: 17, lineHeight: 1.45, color: 'var(--kh-ink-3)', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard() {
  return (
    <section style={{ padding: '96px 32px', background: 'var(--kh-bg-cool)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, alignItems: 'center' }}>
        <div style={{ position: 'relative', height: 420, background: '#fff', borderRadius: 24, border: '1px solid var(--kh-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <Cluster style={{ right: -260, bottom: -160, transform: 'rotate(-6deg)' }} />
          <Character shape="squircle" color="var(--kh-orange)" mood="happy" size={280} style={{ position: 'relative', zIndex: 2, transform: 'rotate(-4deg)' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--kh-teal)', color: '#fff', borderRadius: 999, fontFamily: 'var(--kh-font-text)', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Ages 3–6</span>
            <span style={{ display: 'inline-block', padding: '6px 12px', background: '#fff', color: 'var(--kh-ink-2)', borderRadius: 999, fontFamily: 'var(--kh-font-text)', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', border: '1px solid var(--kh-line)' }}>Screen-free</span>
          </div>
          <h2 style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontSize: 64, lineHeight: 1, letterSpacing: '-0.035em', color: 'var(--kh-ink)', margin: '0 0 18px' }}>
            Kheelo, the<br/>first friend.
          </h2>
          <p style={{ fontFamily: 'var(--kh-font-text)', fontSize: 20, lineHeight: 1.45, color: 'var(--kh-ink-3)', margin: '0 0 28px', maxWidth: 520 }}>
            A soft, palm-sized toy with a face you can't help but talk to. Kheelo learns your kid's words and asks questions back — building vocabulary one giggle at a time.
          </p>
          <div style={{ display: 'flex', gap: 28, marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: 'var(--kh-font-display)', fontWeight: 700, fontSize: 36, color: 'var(--kh-ink)', lineHeight: 1 }}>₹4,499</div>
              <div style={{ fontFamily: 'var(--kh-font-text)', fontSize: 13, color: 'var(--kh-ink-4)', marginTop: 2 }}>Early-bird · 30% off</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--kh-line)', paddingLeft: 28 }}>
              <div style={{ fontFamily: 'var(--kh-font-display)', fontWeight: 700, fontSize: 36, color: 'var(--kh-ink)', lineHeight: 1 }}>11 langs</div>
              <div style={{ fontFamily: 'var(--kh-font-text)', fontSize: 13, color: 'var(--kh-ink-4)', marginTop: 2 }}>EN, HI, BN, TA, TE…</div>
            </div>
          </div>
          <Button variant="primary" size="lg">Pre-order Kheelo</Button>
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="story" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'center' }}>
        <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '3/4', background: '#FFE9D6' }}>
          <img src="../../assets/hero-kids.png" alt="Painterly Pixar-style children" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
        <div>
          <span style={{ fontFamily: 'var(--kh-font-accent)', fontStyle: 'italic', fontSize: 28, color: 'var(--kh-ink-3)' }}>
            <span style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontStyle: 'normal', letterSpacing: '-0.03em', color: 'var(--kh-ink)' }}>Our</span>&nbsp;&nbsp;story
          </span>
          <Tick width={70} style={{ display: 'block', marginTop: 14, marginBottom: 28 }} />
          <p style={{ fontFamily: 'var(--kh-font-text)', fontSize: 22, lineHeight: 1.45, color: 'var(--kh-ink-2)', margin: '0 0 24px' }}>
            Aman and Apoorva realised the $100B toy industry was stuck in the past — selling plastic while the world moved to AI. Then they decided to change that.
          </p>
          <p style={{ fontFamily: 'var(--kh-font-text)', fontSize: 22, lineHeight: 1.45, color: 'var(--kh-ink-2)', margin: '0 0 24px' }}>
            We aren't just making "smart toys". We're building how toys will feel, from now on.
          </p>
          <p style={{ fontFamily: 'var(--kh-font-text)', fontSize: 18, lineHeight: 1.5, color: 'var(--kh-ink-4)', margin: 0, fontStyle: 'italic' }}>
            — Founders, Kheelona · est. 2026, Bangalore
          </p>
        </div>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section id="parents" style={{ padding: '96px 32px', background: 'var(--kh-bg-warm)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: 'var(--kh-font-accent)', fontStyle: 'italic', fontSize: 28, color: 'var(--kh-ink-3)' }}>
            <span style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontStyle: 'normal', letterSpacing: '-0.03em', color: 'var(--kh-ink)' }}>Built</span>&nbsp;&nbsp;for parents
          </span>
          <h2 style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontSize: 56, letterSpacing: '-0.03em', color: 'var(--kh-ink)', margin: '14px 0 0', lineHeight: 1.05 }}>
            who'd rather hear giggles than YouTube.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { stat: '3–12', label: 'Age range', sub: 'The years that matter most' },
            { stat: '0', label: 'Screen time', sub: 'No tablet, no phone, no glow' },
            { stat: '11', label: 'Languages', sub: 'EN + 10 Indian languages' },
            { stat: '4.7★', label: 'Pilot rating', sub: 'From 240 Tier-1 families' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '24px 24px 28px', border: '1px solid var(--kh-line)' }}>
              <div style={{ fontFamily: 'var(--kh-font-display)', fontWeight: 700, fontSize: 56, lineHeight: 1, color: 'var(--kh-orange)' }}>{s.stat}</div>
              <div style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em', color: 'var(--kh-ink)', marginTop: 12 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--kh-font-text)', fontSize: 13, color: 'var(--kh-ink-4)', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterCTA() {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState('idle'); // idle | done
  return (
    <section style={{ padding: '96px 32px', position: 'relative', overflow: 'hidden', background: '#000' }}>
      <Cluster style={{ right: -200, top: -180, transform: 'rotate(-12deg)', opacity: 0.7 }} />
      <Cluster style={{ left: -250, bottom: -200, transform: 'rotate(8deg)', opacity: 0.7 }} />
      <div style={{ maxWidth: 880, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        <Character shape="squircle" color="var(--kh-orange)" mood="ooh" size={120} style={{ display: 'inline-block', marginBottom: 28, transform: 'rotate(-6deg)' }} />
        <h2 style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontSize: 56, letterSpacing: '-0.035em', color: '#fff', margin: '0 0 16px', lineHeight: 1.05 }}>
          Get on the list.<br/>Get a Kheelo first.
        </h2>
        <p style={{ fontFamily: 'var(--kh-font-text)', fontSize: 20, color: 'rgba(255,255,255,0.7)', margin: '0 0 40px' }}>
          Monthly notes from the workshop. No spam, no upsells — promise.
        </p>
        {state === 'idle' ? (
          <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setState('done'); }}
                style={{ display: 'flex', gap: 12, justifyContent: 'center', maxWidth: 520, margin: '0 auto' }}>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@home.com"
              style={{
                flex: 1, padding: '16px 22px', fontFamily: 'var(--kh-font-text)', fontSize: 18,
                background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 999, outline: 'none',
              }}
            />
            <Button type="submit" variant="primary" size="md">Notify me</Button>
          </form>
        ) : (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '16px 28px', borderRadius: 999, background: 'var(--kh-teal)', color: '#fff',
            fontFamily: 'var(--kh-font-text)', fontSize: 18, fontWeight: 600,
          }}>
            <i data-lucide="check" style={{ width: 22, height: 22 }}></i>
            You're in. See you in {email.split('@')[0]}'s inbox.
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid var(--kh-line-soft)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: 32 }}>
          <div>
            <Logo size={32} />
            <p style={{ fontFamily: 'var(--kh-font-text)', fontSize: 14, color: 'var(--kh-ink-4)', marginTop: 16, maxWidth: 280, lineHeight: 1.5 }}>
              Toys that develop brain. Made for kids 3–12. Built in Bangalore, shipping nationwide April 2026.
            </p>
          </div>
          {[
            { title: 'Kheelona', items: ['How it works', 'Why Kheelona', 'For parents', 'Our story'] },
            { title: 'Help', items: ['FAQs', 'Shipping', 'Returns', 'Safety'] },
            { title: 'Company', items: ['About', 'Careers', 'Press', 'Contact'] },
          ].map((c, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--kh-ink-4)', marginBottom: 14 }}>{c.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.items.map(it => <li key={it}><a href="#" style={{ fontFamily: 'var(--kh-font-text)', fontSize: 15, color: 'var(--kh-ink-2)', textDecoration: 'none' }}>{it}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--kh-line-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--kh-font-text)', fontSize: 13, color: 'var(--kh-ink-4)' }}>© 2026 Kheelona Pvt Ltd</span>
          <Marker />
          <span style={{ fontFamily: 'var(--kh-font-text)', fontSize: 13, color: 'var(--kh-ink-4)' }}>v 1.0 · Brand May 2026</span>
        </div>
      </div>
    </footer>
  );
}

function OrderModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 40, maxWidth: 460, width: '100%', position: 'relative', boxShadow: '0 16px 32px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', cursor: 'pointer', padding: 8 }}>
          <i data-lucide="x" style={{ width: 24, height: 24, color: 'var(--kh-ink-3)' }}></i>
        </button>
        <Character shape="squircle" color="var(--kh-orange)" mood="happy" size={88} />
        <h3 style={{ fontFamily: 'var(--kh-font-text)', fontWeight: 700, fontSize: 32, letterSpacing: '-0.025em', color: 'var(--kh-ink)', margin: '20px 0 8px', lineHeight: 1.1 }}>
          Reserve a Kheelo
        </h3>
        <p style={{ fontFamily: 'var(--kh-font-text)', fontSize: 16, color: 'var(--kh-ink-3)', margin: '0 0 24px', lineHeight: 1.4 }}>
          ₹500 holds your spot. Shipping April 2026. Refundable any time.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder="Your name" style={{ padding: '14px 18px', borderRadius: 10, border: '1px solid var(--kh-line)', fontFamily: 'var(--kh-font-text)', fontSize: 16 }} />
          <input placeholder="Email" type="email" style={{ padding: '14px 18px', borderRadius: 10, border: '1px solid var(--kh-line)', fontFamily: 'var(--kh-font-text)', fontSize: 16 }} />
          <input placeholder="Child's age" type="number" min="3" max="12" style={{ padding: '14px 18px', borderRadius: 10, border: '1px solid var(--kh-line)', fontFamily: 'var(--kh-font-text)', fontSize: 16 }} />
        </div>
        <Button variant="primary" size="md" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} onClick={onClose}>
          Hold my Kheelo →
        </Button>
      </div>
    </div>
  );
}

Object.assign(window, { Header, Hero, ValueGrid, HowItWorks, ProductCard, Story, Audience, NewsletterCTA, Footer, OrderModal });
