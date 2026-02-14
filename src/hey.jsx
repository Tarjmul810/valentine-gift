import { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────
// QUIZ DATA  ← edit these to your own questions & answers
// ─────────────────────────────────────────
const QUESTIONS = [
  {
    question: "Where did we first meet?",
    options: ["A café", "Online", "Through friends", "At a party"],
    correct: 1,
  },
  {
    question: "What's my favourite thing about you?",
    options: ["Your laugh", "Your kindness", "Your mind", "All of you"],
    correct: 3,
  },
  {
    question: "What do I call you when no one's listening?",
    options: ["Love", "My person", "Baby", "My home"],
    correct: 1,
  },
];

// ─────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap');

  html { scroll-behavior: smooth; }
  body { margin:0; padding:0; background:#000; overflow-x:hidden; }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes floatLeft  { from{transform:translateY(0)}    to{transform:translateY(-4px)} }
  @keyframes floatRight { from{transform:translateY(-2px)} to{transform:translateY(2px)}  }
  @keyframes heartbeat {
    0%   { left:0%;                 opacity:0; }
    5%   {                          opacity:1; }
    50%  { left:calc(50% - 6px);   opacity:.9; }
    95%  {                          opacity:1; }
    100% { left:calc(100% - 12px); opacity:0; }
  }
  @keyframes drift1 { from{transform:translate(0,0)} to{transform:translate(12px,-18px)} }
  @keyframes drift2 { from{transform:translate(0,0)} to{transform:translate(-10px,14px)} }
  @keyframes drift3 { from{transform:translate(0,0)} to{transform:translate(-14px,-10px)} }
  @keyframes drift4 { from{transform:translate(0,0)} to{transform:translate(10px,16px)} }
  @keyframes drift5 { from{transform:translate(0,0)} to{transform:translate(-8px,-12px)} }
  @keyframes grantedIn {
    0%   { opacity:0; transform:translateY(14px) scale(.97); }
    100% { opacity:1; transform:translateY(0)    scale(1);   }
  }
  @keyframes wrongShake {
    0%,100%{ transform:translateX(0); }
    25%    { transform:translateX(5px); }
    75%    { transform:translateX(-5px); }
  }

  @keyframes s4-fadeUp {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0);   }
  }
  @keyframes s4-cardIn {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }

  
  /* Section entrance */
  @keyframes s5-sectionIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Content stagger */
  @keyframes s5-fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* Final message fade */
  @keyframes s5-messageIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }

  /* Particle drift upward */
  @keyframes s5-rise {
    0%   { transform: translateY(0)      scale(1);    opacity: 0;    }
    8%   {                                             opacity: 0.15; }
    90%  {                                             opacity: 0.1;  }
    100% { transform: translateY(-100vh) scale(0.7);  opacity: 0;    }
  }

  /* Button fade out */
  @keyframes s5-btnOut {
    from { opacity: 1; transform: translateY(0);  }
    to   { opacity: 0; transform: translateY(4px);}
  }

  /* S1 */
  .s1-headline { opacity:0; animation:fadeUp 700ms ease forwards 100ms; }
  .s1-subtext  { opacity:0; animation:fadeUp 600ms ease forwards 400ms; }
  .s1-av-l     { opacity:0; animation:fadeUp 600ms ease forwards 700ms, floatLeft  7s ease-in-out 1.4s infinite alternate; }
  .s1-av-r     { opacity:0; animation:fadeUp 600ms ease forwards 900ms, floatRight 7s ease-in-out 2.2s infinite alternate; }
  .s1-line     { opacity:0; animation:fadeIn 400ms ease forwards 1000ms; }
  .s1-btn      { opacity:0; animation:fadeUp 600ms ease forwards 1400ms; }
  .pulse-dot   { animation:heartbeat 4.5s ease-in-out 1200ms infinite; }
  .dust-1{animation:drift1 18s ease-in-out infinite alternate;}
  .dust-2{animation:drift2 22s ease-in-out infinite alternate;}
  .dust-3{animation:drift3 16s ease-in-out infinite alternate;}
  .dust-4{animation:drift4 20s ease-in-out infinite alternate;}
  .dust-5{animation:drift5 25s ease-in-out infinite alternate;}
  .begin-btn:hover{ transform:translateY(-2px)!important; box-shadow:0 8px 25px rgba(0,0,0,.25)!important; }

  /* S2 card entrance */
  .s2-card-in  { opacity:0; animation:fadeUp 700ms ease forwards 150ms; }

  /* S2 question transitions */
  .q-enter  { opacity:0; transform:translateY(8px);  transition:opacity 450ms ease, transform 450ms ease; }
  .q-active { opacity:1; transform:translateY(0);    transition:opacity 450ms ease, transform 450ms ease; }
  .q-exit   { opacity:0; transform:translateY(-8px); transition:opacity 350ms ease, transform 350ms ease; }

  /* S2 option buttons */
  .opt-btn {
    width:100%;
    background:#fff;
    border:1px solid rgba(0,0,0,.18);
    border-radius:999px;
    padding:.85rem 2rem;
    font-family:'Jost',sans-serif;
    font-size:.88rem; font-weight:300; letter-spacing:.06em;
    color:#111; cursor:pointer; text-align:center;
    transition:background 280ms ease, color 280ms ease, transform 280ms ease, box-shadow 280ms ease, border-color 280ms ease, opacity 280ms ease;
  }
  .opt-btn:hover:not(:disabled){
    background:#111; color:#fff; border-color:#111;
    transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.15);
  }
  .opt-btn.correct{ background:#111; color:#fff; border-color:#111; box-shadow:0 0 0 3px rgba(0,0,0,.08); }
  .opt-btn.wrong  { animation:wrongShake 400ms ease; opacity:.35; }
  .opt-btn:disabled{ cursor:default; }

  /* access granted text */
  .granted-text { animation:grantedIn 800ms cubic-bezier(.16,1,.3,1) forwards; }
  .granted-sub  { opacity:0; animation:fadeIn 600ms ease forwards 1200ms; }

  /* ── S3 letter reveal ── */
  @keyframes letterReveal {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .s3-for-you, .s3-divider, .s3-para-1, .s3-para-2, .s3-para-3, .s3-sig { opacity:0; }

  .s3-visible .s3-for-you  { animation: fadeIn        900ms ease forwards 100ms;  }
  .s3-visible .s3-divider  { animation: fadeIn        700ms ease forwards 500ms;  }
  .s3-visible .s3-para-1   { animation: letterReveal  950ms ease forwards 750ms;  }
  .s3-visible .s3-para-2   { animation: letterReveal  950ms ease forwards 1200ms; }
  .s3-visible .s3-para-3   { animation: letterReveal  950ms ease forwards 1650ms; }
  .s3-visible .s3-sig      { animation: letterReveal  800ms ease forwards 2250ms; }

  .s4-dust-1{animation:drift1 18s ease-in-out infinite alternate;}
  .s4-dust-2{animation:drift2 22s ease-in-out infinite alternate;}
  .s4-dust-3{animation:drift3 16s ease-in-out infinite alternate;}
  .s4-dust-4{animation:drift4 20s ease-in-out infinite alternate;}
  .s4-dust-5{animation:drift5 25s ease-in-out infinite alternate;}

  .s4-card-in  { animation: s4-cardIn 700ms ease forwards; }
  .s4-headline { opacity:0; animation:s4-fadeUp 700ms ease forwards 100ms; }
  .s4-subtext  { opacity:0; animation:s4-fadeUp 600ms ease forwards 300ms; }
  .s4-buttons  { opacity:0; animation:s4-fadeUp 600ms ease forwards 520ms; }
  .s4-scenario { animation:s4-fadeUp 500ms cubic-bezier(.16,1,.3,1) forwards; }

  /* Pill buttons */
  .s4-pill {
    width: 100%;
    max-width: 320px;
    background: #fff;
    border: 1px solid rgba(0,0,0,.18);
    border-radius: 999px;
    padding: 1rem 2.5rem;
    font-family: 'Jost', sans-serif;
    font-size: .84rem;
    font-weight: 300;
    letter-spacing: .1em;
    color: #111;
    cursor: pointer;
    text-align: center;
    transition:
      background 300ms ease,
      color 300ms ease,
      transform 300ms ease,
      box-shadow 300ms ease,
      border-color 300ms ease;
  }
  .s4-pill:hover:not(.s4-pill--active) {
    background: #111;
    color: #fff;
    border-color: #111;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,.14);
  }
  .s4-pill--active {
    background: #111;
    color: #fff;
    border-color: #111;
    box-shadow: 0 0 0 3px rgba(0,0,0,.07);
    cursor: default;
 }


  /* Entrance trigger classes */
  .s5-visible .s5-headline {
    animation: s5-fadeUp 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards 100ms;
  }
  .s5-visible .s5-subline {
    animation: s5-fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards 500ms;
  }
  .s5-visible .s5-btn-wrap {
    animation: s5-fadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards 900ms;
  }

  .s5-headline  { opacity: 0; }
  .s5-subline   { opacity: 0; }
  .s5-btn-wrap  { opacity: 0; }

  /* Button hover */
  .s5-btn {
    background: #fff;
    color: #000;
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    padding: 1.05rem 3rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    display: inline-block;
    transition:
      transform    300ms ease,
      box-shadow   300ms ease,
      opacity      500ms ease;
  }
  .s5-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(255, 255, 255, 0.15);
  }
  .s5-btn.hiding {
    animation: s5-btnOut 500ms ease forwards;
  }

  /* Final message */
  .s5-final-msg {
    animation: s5-messageIn 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

// ─────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────
function DustParticles() {
  const pts = [
    { cls:"dust-1",size:3,top:"18%",left:"12%" },
    { cls:"dust-2",size:2,top:"72%",left:"22%" },
    { cls:"dust-3",size:4,top:"35%",left:"80%" },
    { cls:"dust-4",size:2,top:"60%",left:"68%" },
    { cls:"dust-5",size:3,top:"85%",left:"48%" },
  ];
  return (
    <>
      {pts.map((p,i)=>(
        <div key={i} className={p.cls} style={{
          position:"absolute", borderRadius:"50%", background:"#000", opacity:.12,
          pointerEvents:"none", width:`${p.size}px`, height:`${p.size}px`, top:p.top, left:p.left,
        }}/>
      ))}
    </>
  );
}

function Card({ children, maxWidth="940px", style={} }) {
  return (
    <div style={{
      position:"relative", width:"90%", maxWidth,
      borderRadius:"40px", background:"#f8f8f8",
      padding:"5.5rem 4.5rem",
      boxShadow:"0 40px 80px rgba(0,0,0,.45), inset 0 0 60px rgba(0,0,0,.03)",
      overflow:"hidden", ...style,
    }}>
      <DustParticles/>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
// SECTION 1
// ─────────────────────────────────────────
function AvatarPlaceholder() {
  return (
    <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#ddd" }}>
      <svg viewBox="0 0 100 100" style={{ width:"65%",height:"65%",fill:"rgba(0,0,0,.22)" }}>
        <circle cx="50" cy="36" r="21"/>
        <ellipse cx="50" cy="84" rx="34" ry="24"/>
      </svg>
    </div>
  );
}

function Avatar({ label, animClass }) {
  return (
    <div className={animClass} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"16px" }}>
      <div style={{ background:"radial-gradient(circle,rgba(0,0,0,.05) 0%,transparent 70%)",padding:"10px",borderRadius:"50%" }}>
        <div style={{
          width:"130px",height:"130px",borderRadius:"50%",overflow:"hidden",
          border:"1px solid rgba(0,0,0,.1)",background:"#e2e2e2",
          filter:"drop-shadow(0 8px 20px rgba(0,0,0,.15))",
          display:"flex",alignItems:"center",justifyContent:"center",
        }}>
          {/* To add a photo: replace <AvatarPlaceholder/> with
              <img src="URL" style={{width:"100%",height:"100%",objectFit:"cover",filter:"grayscale(100%)"}}/> */}
          <AvatarPlaceholder/>
        </div>
      </div>
      <span style={{ fontFamily:"'Jost',sans-serif",fontSize:".75rem",letterSpacing:".14em",color:"rgba(0,0,0,.5)",fontWeight:300 }}>
        {label}
      </span>
    </div>
  );
}

function Section1() {
  return (
    <section id="section1" style={{
      minHeight:"100vh",background:"#000",
      display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 20px",
    }}>
      <Card maxWidth="940px">
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr",alignItems:"center" }}>
          <Avatar label="me" animClass="s1-av-l"/>

          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"0 2.2rem" }}>
            <h1 className="s1-headline" style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(30px,4.2vw,48px)",fontWeight:500,color:"#0a0a0a",
              textAlign:"center",lineHeight:1.22,letterSpacing:"-.3px",
            }}>
              There are miles<br/>between us.<br/><em>But never distance.</em>
            </h1>
            <p className="s1-subtext" style={{
              marginTop:"1.4rem",fontFamily:"'Jost',sans-serif",
              fontSize:".9rem",color:"rgba(0,0,0,.45)",textAlign:"center",fontWeight:300,letterSpacing:".05em",
            }}>
              Let me show you something.
            </p>
          </div>

          <Avatar label="you" animClass="s1-av-r"/>

          {/* Heartbeat line */}
          <div className="s1-line" style={{ gridColumn:"1/4",position:"relative",height:"2px",background:"rgba(0,0,0,.13)",margin:"2.8rem 0 0" }}>
            <div className="pulse-dot" style={{
              position:"absolute",top:"50%",left:0,transform:"translateY(-50%)",
              width:"12px",height:"12px",borderRadius:"50%",background:"#111",
              filter:"blur(1px)",boxShadow:"0 0 12px rgba(0,0,0,.3)",opacity:0,
            }}/>
          </div>

          {/* Begin btn */}
          <div className="s1-btn" style={{ gridColumn:"1/4",display:"flex",justifyContent:"center",marginTop:"2.8rem" }}>
            <a href="#section2" className="begin-btn" style={{
              background:"#111",color:"#fff",fontFamily:"'Jost',sans-serif",
              fontSize:".82rem",fontWeight:400,letterSpacing:".18em",
              padding:"1rem 2.8rem",borderRadius:"999px",border:"none",
              cursor:"pointer",textDecoration:"none",display:"inline-block",
              transition:"transform 300ms ease, box-shadow 300ms ease",
            }}>
              begin
            </a>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ─────────────────────────────────────────
// SECTION 2
// ─────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div style={{ width:"100%",marginBottom:"2.6rem" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".6rem" }}>
        <span style={{ fontFamily:"'Jost',sans-serif",fontSize:".68rem",letterSpacing:".2em",color:"rgba(0,0,0,.35)",fontWeight:400 }}>
          {current} of {total}
        </span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".78rem",letterSpacing:".1em",color:"rgba(0,0,0,.22)",fontStyle:"italic" }}>
          only you know this
        </span>
      </div>
      <div style={{ height:"1px",background:"rgba(0,0,0,.1)",borderRadius:"999px",overflow:"hidden" }}>
        <div style={{
          height:"100%",background:"rgba(0,0,0,.3)",borderRadius:"999px",
          width:`${(current/total)*100}%`,
          transition:"width 500ms cubic-bezier(.4,0,.2,1)",
        }}/>
      </div>
    </div>
  );
}

function Section2() {
  const [step,       setStep]       = useState(0);
  const [phase,      setPhase]      = useState("enter"); // enter | active | exit | granted
  const [selected,   setSelected]   = useState(null);
  const [wrongIdx,   setWrongIdx]   = useState(null);
  const [visible,    setVisible]    = useState(false);
  const sectionRef = useRef(null);

  // Trigger entrance on scroll-into-view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold:0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Let question animate in after step change
  useEffect(() => {
    const t = setTimeout(() => setPhase("active"), 40);
    return () => clearTimeout(t);
  }, [step]);

  const q = QUESTIONS[step];

  const handleSelect = useCallback((idx) => {
    if (selected !== null) return;
    const correct = idx === q.correct;
    setSelected(idx);

    if (!correct) {
      setWrongIdx(idx);
      setTimeout(() => { setSelected(null); setWrongIdx(null); }, 850);
      return;
    }

    // Correct path
    setTimeout(() => {
      setPhase("exit");
      setTimeout(() => {
        const next = step + 1;
        if (next >= QUESTIONS.length) {
          setPhase("granted");
          setTimeout(() => {
            document.getElementById("section3")?.scrollIntoView({ behavior:"smooth" });
          }, 2400);
        } else {
          setStep(next);
          setSelected(null);
          setWrongIdx(null);
          setPhase("enter");
        }
      }, 430);
    }, 360);
  }, [selected, q, step]);

  const qClass = phase==="enter" ? "q-enter" : phase==="exit" ? "q-exit" : "q-active";

  return (
    <section ref={sectionRef} id="section2" style={{
      minHeight:"100vh",background:"#000",
      display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 20px",
    }}>
      <Card maxWidth="720px" style={{ opacity: visible ? undefined : 0 }}>
        <div className={visible ? "s2-card-in" : ""}>

          {phase !== "granted" && (
            <>
              {/* Header */}
              <div style={{ textAlign:"center",marginBottom:"2.6rem" }}>
                <h2 style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"clamp(28px,3.8vw,44px)",fontWeight:500,color:"#0a0a0a",
                  lineHeight:1.2,letterSpacing:"-.2px",marginBottom:".9rem",
                }}>
                  Only you can unlock this.
                </h2>
                <p style={{
                  fontFamily:"'Jost',sans-serif",fontSize:".88rem",
                  color:"rgba(0,0,0,.45)",fontWeight:300,letterSpacing:".06em",
                }}>
                  Answer three little questions about us.
                </p>
              </div>

              {/* Progress */}
              <ProgressBar current={step+1} total={QUESTIONS.length}/>

              {/* Divider */}
              <div style={{ height:"1px",background:"rgba(0,0,0,.07)",marginBottom:"2.8rem" }}/>
            </>
          )}

          {/* Question / Granted */}
          {phase !== "granted" ? (
            <div className={qClass} style={{ textAlign:"center" }}>
              <p style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(22px,2.8vw,33px)",fontWeight:400,
                color:"#111",lineHeight:1.45,letterSpacing:"-.1px",marginBottom:"2.2rem",
              }}>
                {q.question}
              </p>

              <div style={{ display:"flex",flexDirection:"column",gap:".85rem",maxWidth:"400px",margin:"0 auto" }}>
                {q.options.map((opt,i) => {
                  const isChosen  = selected===i;
                  const isWrong   = wrongIdx===i;
                  const isCorrect = isChosen && i===q.correct;
                  return (
                    <button
                      key={i}
                      className={`opt-btn${isCorrect?" correct":isWrong?" wrong":""}`}
                      disabled={selected!==null && !isWrong}
                      onClick={() => handleSelect(i)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign:"center",padding:"3.5rem 0" }}>
              <p className="granted-text" style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(32px,5vw,54px)",fontWeight:400,
                color:"#0a0a0a",lineHeight:1.2,letterSpacing:"-.3px",fontStyle:"italic",
              }}>
                Access granted.
              </p>
              <p className="granted-sub" style={{
                fontFamily:"'Jost',sans-serif",fontSize:".78rem",
                color:"rgba(0,0,0,.3)",letterSpacing:".2em",fontWeight:300,marginTop:"1.2rem",
              }}>
                continuing…
              </p>
            </div>
          )}

        </div>
      </Card>
    </section>
  );
}

// ─────────────────────────────────────────
// SECTION 3 — The Letter
// ─────────────────────────────────────────

// ── Edit these to personalise the letter ──
const LETTER = {
  forYou:    "For You",
  paragraphs: [
    "There are nights when the distance feels loud, but even then, you are the quiet part of my heart.",
    "I don't love you because it's easy. I love you because it feels certain. Like something I could never talk myself out of, no matter how hard the miles try.",
    "And even across cities, across time, across silence — I still choose you. Every single time. Without hesitation. Without doubt.",
  ],
  signature: "yours, always",   // ← change this to your name
};

function Section3() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="section3" style={{
      minHeight:"100vh", background:"#000",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"48px 20px",
    }}>
      <Card maxWidth="620px">
        {/* The class toggle drives all staggered animations */}
        <div className={visible ? "s3-visible" : ""}>

          {/* "For You" label */}
          <p className="s3-for-you" style={{
            fontFamily:"'Jost',sans-serif",
            fontSize:".68rem", letterSpacing:".28em",
            textTransform:"uppercase", color:"rgba(0,0,0,.38)",
            textAlign:"center", fontWeight:400,
            marginBottom:"2rem",
          }}>
            {LETTER.forYou}
          </p>

          {/* Thin divider */}
          <div className="s3-divider" style={{
            width:"32px", height:"1px",
            background:"rgba(0,0,0,.2)",
            margin:"0 auto 2.8rem",
          }}/>

          {/* Paragraphs */}
          {LETTER.paragraphs.map((para, i) => (
            <p
              key={i}
              className={`s3-para-${i+1}`}
              style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"clamp(18px, 2.4vw, 22px)",
                fontWeight: 400,
                lineHeight: 1.85,
                color:"rgba(0,0,0,.82)",
                textAlign:"center",
                marginTop: i === 0 ? 0 : "1.8rem",
                letterSpacing:".01em",
              }}
            >
              {para}
            </p>
          ))}

          {/* Signature */}
          <p className="s3-sig" style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(17px,2vw,20px)",
            fontStyle:"italic",
            fontWeight:400,
            color:"rgba(0,0,0,.55)",
            textAlign:"center",
            marginTop:"3.2rem",
            letterSpacing:".04em",
          }}>
            — {LETTER.signature}
          </p>

          <div className="s3-sig" style={{ marginTop: "3rem", display: "flex", justifyContent: "center" }}>
  
          <a href="#section4"
        style={{
      fontFamily: "'Jost', sans-serif",
      fontSize: "0.72rem",
      letterSpacing: "0.22em",
      color: "rgba(0,0,0,0.3)",
      textDecoration: "none",
      textTransform: "lowercase",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "color 300ms ease",
    }}
    onMouseEnter={e => e.currentTarget.style.color = "rgba(0,0,0,0.7)"}
    onMouseLeave={e => e.currentTarget.style.color = "rgba(0,0,0,0.3)"}
  >
    keep reading
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </a>
</div>

        </div>
      </Card>
    </section>
  );
}

const FUTURES = [
  {
    label: "1 Year From Now",
    text: "Still calling each other at random hours.\nStill choosing each other on the hard days.\nA little more settled. A lot more sure.",
  },
  {
    label: "5 Years From Now",
    text: "Different apartment. Same laughter.\nA routine that feels like home.\nSame us — just deeper.",
  },
  {
    label: "Old Together",
    text: "Wrinkles, slow mornings,\nand the same hand to hold.\nNothing else needed.",
  },
];

const DUST = [
  { size: 3, top: "14%", left: "9%",  anim: "drift1" },
  { size: 2, top: "70%", left: "18%", anim: "drift2" },
  { size: 4, top: "30%", left: "83%", anim: "drift3" },
  { size: 2, top: "58%", left: "72%", anim: "drift4" },
  { size: 3, top: "82%", left: "50%", anim: "drift5" },
];

function StyleTag() {
  return <style dangerouslySetInnerHTML={{ __html: globalStyles }} />;
}


function Section4() {
  const [active, setActive] = useState(null);  // index or null
  const [scenarioKey, setScenarioKey] = useState(0); // force re-mount for re-animation

  function handlePick(i) {
    if (active === i) return;
    setActive(i);
    setScenarioKey(k => k + 1);
  }

  return (
    <>
      <StyleTag />

      <section
        id="section4"
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
        }}
      >
        {/* ── Card ── */}
        <div
          className="s4-card-in"
          style={{
            position: "relative",
            width: "90%",
            maxWidth: "780px",
            borderRadius: "40px",
            background: "#f8f8f8",
            padding: "6.5rem 4.5rem",
            boxShadow: "0 40px 80px rgba(0,0,0,.45), inset 0 0 60px rgba(0,0,0,.03)",
            overflow: "hidden",
          }}
        >
          {/* dust */}
          {DUST.map((p, i) => (
            <div
              key={i}
              className={`s4-dust-${i + 1}`}
              style={{
                position: "absolute",
                borderRadius: "50%",
                background: "#000",
                opacity: .12,
                pointerEvents: "none",
                width: `${p.size}px`,
                height: `${p.size}px`,
                top: p.top,
                left: p.left,
              }}
            />
          ))}

          {/* ── Headline ── */}
          <h2
            className="s4-headline"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: 500,
              color: "#0a0a0a",
              textAlign: "center",
              lineHeight: 1.2,
              letterSpacing: "-.2px",
            }}
          >
            A Future With You.
          </h2>

          {/* ── Subtext ── */}
          <p
            className="s4-subtext"
            style={{
              marginTop: "1rem",
              fontFamily: "'Jost', sans-serif",
              fontSize: ".9rem",
              color: "rgba(0,0,0,.45)",
              textAlign: "center",
              fontWeight: 300,
              letterSpacing: ".05em",
            }}
          >
            Just imagine for a moment.
          </p>

          {/* ── Divider ── */}
          <div style={{
            width: "32px", height: "1px",
            background: "rgba(0,0,0,.15)",
            margin: "2.4rem auto 0",
          }} />

          {/* ── Pill Buttons ── */}
          <div
            className="s4-buttons"
            style={{
              marginTop: "2.8rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.1rem",
            }}
          >
            {FUTURES.map((f, i) => (
              <button
                key={i}
                className={`s4-pill${active === i ? " s4-pill--active" : ""}`}
                onClick={() => handlePick(i)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* ── Scenario text ── */}
          {active !== null && (
            <div
              key={scenarioKey}
              className="s4-scenario"
              style={{
                marginTop: "2.8rem",
                maxWidth: "480px",
                marginLeft: "auto",
                marginRight: "auto",
                opacity: 0,
              }}
            >
              {/* thin rule */}
              <div style={{
                width: "100%", height: "1px",
                background: "rgba(0,0,0,.08)",
                marginBottom: "2rem",
              }} />

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(17px, 2.4vw, 21px)",
                fontWeight: 400,
                color: "rgba(0,0,0,.85)",
                textAlign: "center",
                lineHeight: 1.85,
                letterSpacing: ".01em",
                whiteSpace: "pre-line",
                fontStyle: "italic",
              }}>
                {FUTURES[active].text}
              </p>
            </div>
          )}

          {/* ── Lead-in to next section ── */}
          {active !== null && (
            <div
              key={`next-${scenarioKey}`}
              style={{
                marginTop: "3rem",
                textAlign: "center",
                opacity: 0,
                animation: "s4-fadeUp 500ms ease forwards 700ms",
              }}
            >
              <a
                href="#section5"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: ".72rem",
                  letterSpacing: ".22em",
                  color: "rgba(0,0,0,.3)",
                  textDecoration: "none",
                  textTransform: "lowercase",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".5rem",
                  transition: "color 300ms ease",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(0,0,0,.7)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(0,0,0,.3)"}
              >
                keep reading
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────
   RISING PARTICLES CONFIG
   ───────────────────────────────────────── */
const PARTICLES = [
  { size: 2, left: "12%",  duration: 13, delay: 0    },
  { size: 3, left: "27%",  duration: 11, delay: 2.4  },
  { size: 2, left: "43%",  duration: 14, delay: 0.8  },
  { size: 2, left: "58%",  duration: 12, delay: 3.6  },
  { size: 3, left: "71%",  duration: 10, delay: 1.2  },
  { size: 2, left: "84%",  duration: 13, delay: 4.8  },
  { size: 2, left: "19%",  duration: 11, delay: 6.0  },
  { size: 3, left: "91%",  duration: 14, delay: 2.0  },
];


/* ─────────────────────────────────────────
   RISING PARTICLES
   ───────────────────────────────────────── */
function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: "-6px",
            left: p.left,
            width:  `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "#fff",
            opacity: 0,
            animation: `s5-rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Section5() {
  const [visible,    setVisible]    = useState(false);
  const [hiding,     setHiding]     = useState(false);   // button fading out
  const [revealed,   setRevealed]   = useState(false);   // final message shown
  const sectionRef  = useRef(null);

  /* Scroll-into-view trigger */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function handleStay() {
    if (revealed) return;
    setHiding(true);
    setTimeout(() => setRevealed(true), 520);
  }

  return (
    <>
      <StyleTag />

      <section
        ref={sectionRef}
        id="section5"
        className={visible ? "s5-visible" : ""}
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transition: "opacity 900ms ease-out",
        }}
      >

        {/* Vignette — draws eye to center */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,1) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Rising particles */}
        <Particles />

        {/* Content — above vignette */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", width: "100%" }}>

          {/* ── Headline ── */}
          <h2
            className="s5-headline"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(38px, 5vw, 64px)",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              maxWidth: "760px",
              margin: "0 auto",
            }}
          >
            Out of everyone<br />in this world,<br />
            <em>I still choose you.</em>
          </h2>

          {/* ── Subline ── */}
          <p
            className="s5-subline"
            style={{
              marginTop: "1.6rem",
              fontFamily: "'Jost', sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.18em",
              fontWeight: 300,
            }}
          >
            Today. Tomorrow. Always.
          </p>

          {/* ── Spacer ── */}
          <div style={{ height: "4rem" }} />

          {/* ── Button / Final message ── */}
          {!revealed ? (
            <div className="s5-btn-wrap">
              <button
                className={`s5-btn${hiding ? " hiding" : ""}`}
                onClick={handleStay}
              >
                Stay with me.
              </button>
            </div>
          ) : (
            <div className="s5-final-msg">
              {/* Thin rule */}
              <div style={{
                width: "28px", height: "1px",
                background: "rgba(255,255,255,0.2)",
                margin: "0 auto 2.2rem",
              }} />
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(19px, 2.6vw, 26px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.75,
                letterSpacing: "0.01em",
                maxWidth: "520px",
                margin: "0 auto",
              }}>
                Distance is temporary.<br />You are not.
              </p>

              {/* Signature */}
              <p style={{
                marginTop: "2.4rem",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                color: "rgba(255,255,255,0.2)",
                fontWeight: 300,
                textTransform: "lowercase",
              }}>
                happy valentine's day, my love
              </p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────
export default function ValentinePage() {
  const styleRef = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const tag = document.createElement("style");
      tag.innerHTML = globalStyles;
      document.head.appendChild(tag);
      styleRef.current = tag;
    }
    return () => {
      if (styleRef.current) {
        try { document.head.removeChild(styleRef.current); } catch(_){}
        styleRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ background:"#000" }}>
      <Section1/>
      <Section2/>
      <Section3/>
      <Section4/>   
      <Section5/>
    </div>
  );
}