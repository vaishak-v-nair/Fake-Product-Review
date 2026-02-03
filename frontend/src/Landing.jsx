export default function Landing() {
  return (
    <main className="page">

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-wrap">
          <div className="hero-grid">
            <div>
              <span className="badge">AI Trust • Explainable</span>
              <h1>Review trust,<br/>made lovable.</h1>
              <p>
                VeriTrust uses deep language models to detect fake product
                reviews with clear, human-readable reasons.
              </p>
              <div style={{display:"flex", gap:12, marginTop:20}}>
                <a href="#demo" className="btn btn-primary">Try Live Demo</a>
                <a href="#how" className="btn btn-ghost">How it works</a>
              </div>
            </div>

            {/* BENTO */}
            <div className="bento">
              <div className="card soft">
                <strong>91% accuracy</strong>
                <p className="muted">RoBERTa-based detection</p>
              </div>
              <div className="card">
                <strong>Explainable</strong>
                <p className="muted">Why a review is flagged</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how">
        <h2>How it works</h2>
        <div className="how-grid">
          <div className="card">Paste a review</div>
          <div className="card">AI analyzes language</div>
          <div className="card">Get trust verdict</div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo">
        <h2>Live demo</h2>
        <div className="demo-box">
          <textarea placeholder="Paste a product review here…" />
          <div style={{marginTop:12}}>
            <button className="btn btn-primary">Analyze review</button>
          </div>
        </div>
      </section>

      <footer>
        VeriTrust • Built with RoBERTa, FastAPI & React
      </footer>
    </main>
  );
}
