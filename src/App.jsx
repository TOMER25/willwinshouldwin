import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// ADMIN PASSWORD
// Change this to something only you know
// ============================================================
const ADMIN_PASSWORD = "oscars2026admin";

// ============================================================
// SHOWS CONFIG
// To add a new show in the future, add a new entry here.
// Each show needs: id, name, shortName, year, date, status,
// and a categories array identical in structure to the existing one.
// ============================================================
const SHOWS = [
  {
    id: "oscars_98",
    name: "98th Academy Awards",
    shortName: "Oscars",
    org: "Academy of Motion Picture Arts and Sciences",
    year: 2026,
    date: "March 15, 2026",
    status: "active", // "upcoming" | "active" | "completed"
    categories: [
      { id: "best_picture", name: "Best Picture", nominees: ["Bugonia","F1","Frankenstein","Hamnet","Marty Supreme","One Battle After Another","The Secret Agent","Sentimental Value","Sinners","Train Dreams"] },
      { id: "best_director", name: "Best Director", nominees: ["Paul Thomas Anderson — One Battle After Another","Ryan Coogler — Sinners","Josh Safdie — Marty Supreme","Joachim Trier — Sentimental Value","Chloé Zhao — Hamnet"] },
      { id: "best_actor", name: "Best Actor", nominees: ["Timothée Chalamet — Marty Supreme","Leonardo DiCaprio — One Battle After Another","Ethan Hawke — Blue Moon","Michael B. Jordan — Sinners","Wagner Moura — The Secret Agent"] },
      { id: "best_actress", name: "Best Actress", nominees: ["Jessie Buckley — Hamnet","Rose Byrne — If I Had Legs I'd Kick You","Kate Hudson — Song Sung Blue","Renate Reinsve — Sentimental Value","Emma Stone — Bugonia"] },
      { id: "best_supporting_actor", name: "Best Supporting Actor", nominees: ["Benicio del Toro — One Battle After Another","Jacob Elordi — Frankenstein","Delroy Lindo — Sinners","Sean Penn — One Battle After Another","Stellan Skarsgård — Sentimental Value"] },
      { id: "best_supporting_actress", name: "Best Supporting Actress", nominees: ["Elle Fanning — Sentimental Value","Inga Ibsdotter Lilleaas — Sentimental Value","Amy Madigan — Weapons","Wunmi Mosaku — Sinners","Teyana Taylor — One Battle After Another"] },
      { id: "original_screenplay", name: "Original Screenplay", nominees: ["Blue Moon — Robert Kaplow","It Was Just an Accident — Jafar Panahi et al.","Marty Supreme — Ronald Bronstein & Josh Safdie","Sentimental Value — Eskil Vogt & Joachim Trier","Sinners — Ryan Coogler"] },
      { id: "adapted_screenplay", name: "Adapted Screenplay", nominees: ["Bugonia — Will Tracy","Frankenstein — Guillermo del Toro","Hamnet — Chloé Zhao & Maggie O'Farrell","One Battle After Another — Paul Thomas Anderson","Train Dreams"] },
      { id: "cinematography", name: "Cinematography", nominees: ["Frankenstein — Dan Laustsen","Marty Supreme — Darius Khondji","One Battle After Another — Michael Bauman","Sinners — Autumn Durald Arkapaw","Train Dreams — Adolpho Veloso"] },
      { id: "film_editing", name: "Film Editing", nominees: ["F1 — Stephen Mirrione","Marty Supreme — Ronald Bronstein & Josh Safdie","One Battle After Another — Andy Jurgensen","Sentimental Value — Olivier Bugge Coutté","Sinners — Michael P. Shawver"] },
      { id: "original_score", name: "Original Score", nominees: ["Bugonia — Jerskin Fendrix","Frankenstein — Alexandre Desplat","Hamnet — Max Richter","One Battle After Another — Jonny Greenwood","Sinners — Ludwig Göransson"] },
      { id: "original_song", name: "Original Song", nominees: ['"Dear Me" — Diane Warren: Relentless','"Golden" — KPop Demon Hunters','"I Lied To You" — Sinners','"Sweet Dreams Of Joy" — Viva Verdi!','"Train Dreams" — Train Dreams'] },
      { id: "animated_feature", name: "Animated Feature Film", nominees: ["Arco","Elio","KPop Demon Hunters","Little Amélie or the Character of Rain","Zootopia 2"] },
      { id: "international_feature", name: "International Feature Film", nominees: ["The Secret Agent (Brazil)","It Was Just an Accident (France)","Sentimental Value (Norway)","Sirāt (Spain)","The Voice of Hind Rajab (Tunisia)"] },
      { id: "documentary_feature", name: "Documentary Feature", nominees: ["The Alabama Solution","Come See Me in the Good Light","Cutting Through Rocks","Mr. Nobody Against Putin","The Perfect Neighbor"] },
      { id: "costume_design", name: "Costume Design", nominees: ["Avatar: Fire and Ash — Deborah L. Scott","Frankenstein — Kate Hawley","Hamnet — Malgosia Turzanska","Marty Supreme — Miyako Bellizzi","Sinners — Ruth E. Carter"] },
      { id: "production_design", name: "Production Design", nominees: ["Frankenstein","Hamnet","Marty Supreme","One Battle After Another","Sinners"] },
      { id: "makeup_hairstyling", name: "Makeup and Hairstyling", nominees: ["Frankenstein","Kokuho","Sinners","The Smashing of Atoms","The Ugly Stepsister"] },
      { id: "sound", name: "Sound", nominees: ["F1","Frankenstein","One Battle After Another","Sinners","Sirāt"] },
      { id: "visual_effects", name: "Visual Effects", nominees: ["Avatar: Fire and Ash","F1","Jurassic World Rebirth","The Lost Bus","Sinners"] },
      { id: "casting", name: "Casting (New Category!)", nominees: ["Hamnet — Nina Gold","Marty Supreme — Jennifer Venditti","One Battle After Another — Cassandra Kulukundis","The Secret Agent — Gabriel Domingues","Sinners — Francine Maisler"] },
      { id: "animated_short", name: "Animated Short Film", nominees: ["Butterfly","Forevergreen","The Girl Who Cried Pearls","Retirement Plan","The Three Sisters"] },
      { id: "live_action_short", name: "Live Action Short Film", nominees: ["Butcher's Stain","A Friend of Dorothy","Jane Austen's Period Drama","The Singers","Two People Exchanging Saliva"] },
      { id: "documentary_short", name: "Documentary Short Film", nominees: ["All the Empty Rooms","Armed Only With a Camera: The Life and Death of Brent Renaud","Children No More: 'Were and Are Gone'","The Devil Is Busy","Perfectly a Strangeness"] },
    ],
  },
  // ── ADD FUTURE SHOWS HERE ──────────────────────────────────
  // {
  //   id: "emmys_76",
  //   name: "76th Emmy Awards",
  //   shortName: "Emmys",
  //   org: "Television Academy",
  //   year: 2026,
  //   date: "September 2026",
  //   status: "upcoming",
  //   categories: [ ... ],
  // },
];

// ============================================================
// GLOSSARY
// ============================================================
const GLOSSARY = [
  {
    section: "How It Works",
    items: [
      { term: "★ Will Win", def: "Your prediction for who will actually receive the award. This is your forecasting pick — who has the momentum, the campaign, the narrative. Being correct here scores you a point on the leaderboard." },
      { term: "♥ Should Win", def: "Your personal artistic judgment — who you believe deserves the award regardless of what happens on the night. This is your taste on record. After the ceremony, we track how often your Should Win matched the actual winner." },
      { term: "Leaderboard", def: "Scored separately for ★ and ♥ accuracy. Will Win correct picks reward forecasting skill; Should Win matches reward taste that aligned with the voters — a rarer and more interesting distinction." },
    ],
  },
  {
    section: "The Big Categories",
    items: [
      { term: "Best Picture", def: "The top award of the night. Given to the producers of the film the Academy votes as the best of the year. Voted on by all Academy members across all branches." },
      { term: "Best Director", def: "Recognizes the director whose vision and craft most distinguished their film. A director can win this without their film winning Best Picture, and vice versa." },
      { term: "Best Actor / Best Actress", def: "Given to the lead performer in a film — typically the character around whom the story is centered. The Academy nominates up to five performers in each category." },
      { term: "Best Supporting Actor / Actress", def: "Recognizes performers in roles that are not the lead. The line between lead and supporting is sometimes blurry and occasionally strategic — studios sometimes submit lead performances in the supporting category to improve odds." },
    ],
  },
  {
    section: "Screenplay Categories",
    items: [
      { term: "Original Screenplay", def: "Given to a script written directly for the screen — not based on pre-existing published material. Awarded to the writers, not the director." },
      { term: "Adapted Screenplay", def: "Given to a script based on existing source material: a novel, play, article, previous film, etc. The craft of adaptation — what to keep, what to reimagine — is its own distinct skill." },
    ],
  },
  {
    section: "Craft Categories",
    items: [
      { term: "Cinematography", def: "Honors the Director of Photography — responsible for how the film looks. This includes lighting, camera movement, framing, and the overall visual language of the film." },
      { term: "Film Editing", def: "Awarded to the editor who shaped the film's pacing, structure, and rhythm. Often said that films are written three times: in the script, on set, and in the edit." },
      { term: "Original Score", def: "Given to the composer who wrote music specifically for the film. Distinguished from Original Song, which requires a fully-formed song with lyrics." },
      { term: "Original Song", def: "Must be an original song written specifically for the film and featured in it. The nominees perform live at the ceremony, making this one of the most watched categories on the night." },
      { term: "Sound", def: "A merged category (since 2021) covering both sound editing and sound mixing — the creation of effects and the final blend of dialogue, music, and effects. Action and music films tend to dominate." },
      { term: "Production Design", def: "Recognizes the people who design all physical environments in a film — sets, locations, props. Period films and large-scale productions tend to dominate." },
      { term: "Costume Design", def: "Honors the costume designer responsible for all clothing and accessories worn on screen. Period dramas and fantasy films have historically dominated." },
      { term: "Makeup and Hairstyling", def: "Covers prosthetics, aging effects, and period-appropriate hairstyles. Transformative physical performances tend to receive nominations here." },
      { term: "Visual Effects", def: "Given to VFX supervisors behind the computer-generated and practical effects. Tends to favor large-scale blockbusters, though restrained or invisible VFX work is increasingly appreciated." },
    ],
  },
  {
    section: "Specialized Categories",
    items: [
      { term: "Animated Feature Film", def: "Open to feature-length animated films. Pixar, Disney, and Studio Ghibli have historically dominated, though the field has diversified significantly." },
      { term: "International Feature Film", def: "Each country submits one film, and the Academy selects nominees from those submissions. Formerly known as Best Foreign Language Film." },
      { term: "Documentary Feature", def: "Given to feature-length non-fiction films. The category has grown in prestige — several nominees have crossed into mainstream critical conversation in recent years." },
      { term: "Casting (New in 2026!)", def: "A brand new Oscar category introduced for the 98th ceremony, recognizing casting directors who assembled a film's ensemble." },
      { term: "Short Film Categories", def: "Three awards: Animated Short, Live Action Short, and Documentary Short. Among the hardest to predict because few voters — or audiences — have seen the nominees before voting." },
    ],
  },
];

// ============================================================
// STATUS BADGE HELPER
// ============================================================
function statusLabel(status) {
  if (status === "active") return { text: "Open for picks", cls: "badge-active" };
  if (status === "upcoming") return { text: "Coming soon", cls: "badge-upcoming" };
  if (status === "completed") return { text: "Completed", cls: "badge-completed" };
  return { text: status, cls: "" };
}

// ============================================================
// LOGO
// ============================================================
function Logo({ onClick }) {
  return (
    <div className="logo-lockup" onClick={onClick} style={onClick ? { cursor: "pointer" } : {}}>
      <div className="logo-text">
        <span className="logo-will">Will</span>
        <span className="logo-win">Win</span>
        <span className="logo-slash">/</span>
        <span className="logo-should">Should</span>
        <span className="logo-win2">Win</span>
      </div>
    </div>
  );
}

// ============================================================
// AUTH
// ============================================================
function AuthModal({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
        if (error) throw error;
        if (data.user) onAuth(data.user);
        else setError("Check your email to confirm your account, then log in.");
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-modal">
        <Logo />
        <p className="auth-tagline">Make your picks. Own your taste.</p>
        <div className="auth-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign In</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Join</button>
        </div>
        {mode === "signup" && <input className="auth-input" placeholder="Display name" value={displayName} onChange={e => setDisplayName(e.target.value)} />}
        <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-submit" onClick={handleSubmit} disabled={loading}>{loading ? "…" : mode === "login" ? "Sign In" : "Create Account"}</button>
      </div>
    </div>
  );
}

// ============================================================
// HOME SCREEN
// ============================================================
function HomeScreen({ onSelectShow, user, onGoProfile, onGoAdmin, allShows }) {
  return (
    <div className="home-screen">
      <div className="home-header">
        <Logo />
        <div className="home-header-right">
          <button className="home-nav-btn" onClick={onGoProfile}>Profile</button>
          <button className="home-nav-btn" onClick={onGoAdmin}>Admin</button>
          <button className="signout-btn" onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      </div>

      <div className="home-content">
        <div className="home-hero">
          <h1 className="home-title"><span className="home-title-will">Who will win.</span><br /><span className="home-title-should">Who should win.</span></h1>
          <p className="home-subtitle">Make your predictions across every category. Compare with friends. See how your taste stacks up against the voters.</p>
        </div>

        <div className="shows-section">
          <h2 className="shows-heading">Award Shows</h2>
          <div className="shows-grid">
            {allShows.map(show => {
              const badge = statusLabel(show.status);
              const isUpcoming = show.status === "upcoming";
              return (
                <button
                  key={show.id}
                  className={`show-card ${isUpcoming ? "show-card-upcoming" : ""}`}
                  onClick={() => !isUpcoming && onSelectShow(show)}
                  disabled={isUpcoming}
                >
                  <div className="show-card-top">
                    <span className={`show-badge ${badge.cls}`}>{badge.text}</span>
                  </div>
                  <h3 className="show-name">{show.name}</h3>
                  {show.org && <p className="show-org">{show.org}</p>}
                  {show.date && <p className="show-date">{show.date}</p>}
                  <p className="show-cats">{show.categories.length} categories</p>
                  {!isUpcoming && <div className="show-cta">Make your picks →</div>}
                </button>
              );
            })}

            {/* Placeholder — only show if no upcoming shows already exist */}
            {!allShows.some(s => s.status === "upcoming") && (
              <div className="show-card show-card-placeholder">
                <p className="placeholder-text">More shows coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="app-footer">willwinshouldwin.com</footer>
    </div>
  );
}

// ============================================================
// SHOW APP (picks, community, leaderboard, etc. for one show)
// ============================================================
function ShowApp({ show, user, onGoHome }) {
  const [picks, setPicks] = useState({});
  const [aggregates, setAggregates] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [view, setView] = useState("picks");

  const CATEGORIES = show.categories;

  useEffect(() => {
    document.title = `${show.name} — WillWin/ShouldWin`;
    loadPicks();
    loadAggregates();
    return () => { document.title = "WillWin / ShouldWin"; };
  }, [show.id]);

  const loadPicks = async () => {
    const { data } = await supabase.from("picks").select("*").eq("user_id", user.id).eq("show_id", show.id);
    const map = {};
    (data || []).forEach(row => { map[row.category_id] = { will_win: row.will_win, should_win: row.should_win }; });
    setPicks(map);
  };

  const loadAggregates = async () => {
    const { data: allPicks } = await supabase.from("picks").select("*").eq("show_id", show.id);
    const agg = {}, totals = {};
    (allPicks || []).forEach(pick => {
      if (!agg[pick.category_id]) agg[pick.category_id] = {};
      if (!totals[pick.category_id]) totals[pick.category_id] = { will: 0, should: 0 };
      if (pick.will_win) {
        if (!agg[pick.category_id][pick.will_win]) agg[pick.category_id][pick.will_win] = { will_count: 0, should_count: 0 };
        agg[pick.category_id][pick.will_win].will_count++;
        totals[pick.category_id].will++;
      }
      if (pick.should_win) {
        if (!agg[pick.category_id][pick.should_win]) agg[pick.category_id][pick.should_win] = { will_count: 0, should_count: 0 };
        agg[pick.category_id][pick.should_win].should_count++;
        totals[pick.category_id].should++;
      }
    });
    const pctMap = {};
    Object.entries(agg).forEach(([catId, nominees]) => {
      pctMap[catId] = {};
      Object.entries(nominees).forEach(([nom, counts]) => {
        pctMap[catId][nom] = {
          will_win_pct: totals[catId]?.will ? (counts.will_count / totals[catId].will) * 100 : 0,
          should_win_pct: totals[catId]?.should ? (counts.should_count / totals[catId].should) * 100 : 0,
        };
      });
    });
    setAggregates(pctMap);
  };

  const handlePick = async (categoryId, pickType, value) => {
    const newPicks = { ...picks, [categoryId]: { ...picks[categoryId], [pickType]: value } };
    setPicks(newPicks);
    setSaving(true);
    await supabase.from("picks").upsert({
      user_id: user.id, show_id: show.id, category_id: categoryId,
      will_win: newPicks[categoryId]?.will_win || null,
      should_win: newPicks[categoryId]?.should_win || null,
    }, { onConflict: "user_id,show_id,category_id" });
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
    loadAggregates();
  };

  const NAV_ITEMS = [
    { id: "picks", label: "My Picks" },
    { id: "community", label: "Community" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "profile", label: "Profile" },
    { id: "glossary", label: "Guide" },
  ];

  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Friend";

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="header-left">
            <button className="back-home-btn" onClick={onGoHome} title="All shows">←</button>
            <Logo onClick={onGoHome} />
            <span className="show-context-badge">{show.name}</span>
          </div>
          <div className="header-right">
            {saving && <span className="save-indicator">saving…</span>}
            {savedMsg && !saving && <span className="save-indicator saved">✓</span>}
            <span className="user-name">{displayName}</span>
            <button className="signout-btn" onClick={() => supabase.auth.signOut()}>Sign Out</button>
          </div>
        </div>
        <nav className="app-nav">
          {NAV_ITEMS.map(item => (
            <button key={item.id} className={view === item.id ? "nav-active" : ""} onClick={() => setView(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {view === "picks" && <PicksView picks={picks} aggregates={aggregates} onPick={handlePick} categories={CATEGORIES} />}
      {view === "community" && <Community currentUserId={user.id} show={show} />}
      {view === "leaderboard" && <Leaderboard currentUserId={user.id} show={show} />}
      {view === "profile" && <Profile user={user} picks={picks} show={show} />}
      {view === "glossary" && <GlossaryView />}

      <footer className="app-footer">{show.name} · willwinshouldwin.com</footer>
    </div>
  );
}

// ============================================================
// PICKS VIEW
// ============================================================
function PicksView({ picks, aggregates, onPick, categories }) {
  const bothPicked = categories.filter(c => picks[c.id]?.will_win && picks[c.id]?.should_win).length;
  const allDone = bothPicked === categories.length;

  const jumpToNext = () => {
    const next = categories.find(c => !picks[c.id]?.will_win || !picks[c.id]?.should_win);
    if (next) document.getElementById(`cat-${next.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-inner">
          <span className="progress-text">{bothPicked}/{categories.length} complete</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(bothPicked / categories.length) * 100}%` }} />
          </div>
          {!allDone && <button className="jump-btn" onClick={jumpToNext}>Next unpicked ↓</button>}
          {allDone && <span className="progress-done">All done! ✓</span>}
        </div>
      </div>
      <div className="app-main">
        <div className="picks-grid">
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} userPicks={picks} onPick={onPick} aggregates={aggregates} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CATEGORY CARD
// ============================================================
function CategoryCard({ category, userPicks, onPick, aggregates }) {
  const willWin = userPicks?.[category.id]?.will_win;
  const shouldWin = userPicks?.[category.id]?.should_win;
  return (
    <div className="category-card" id={`cat-${category.id}`}>
      <h3 className="category-name">{category.name}</h3>
      <div className="pick-headers">
        <span className="pick-label will-label">Will Win ★</span>
        <span className="pick-label should-label">Should Win ♥</span>
      </div>
      <div className="nominees-list">
        {category.nominees.map(nominee => {
          const isWillWin = willWin === nominee;
          const isShouldWin = shouldWin === nominee;
          const pct = aggregates?.[category.id]?.[nominee];
          return (
            <div key={nominee} className={`nominee-row ${isWillWin || isShouldWin ? "picked" : ""}`}>
              <div className="nominee-name">
                {nominee}
                {pct?.will_win_pct > 0 && <span className="agg-badge will-agg">{Math.round(pct.will_win_pct)}%</span>}
                {pct?.should_win_pct > 0 && <span className="agg-badge should-agg">{Math.round(pct.should_win_pct)}%</span>}
              </div>
              <div className="nominee-picks">
                <button className={`pick-btn will-btn ${isWillWin ? "selected" : ""}`} onClick={() => onPick(category.id, "will_win", isWillWin ? null : nominee)}>
                  {isWillWin ? "★" : "☆"}
                </button>
                <button className={`pick-btn should-btn ${isShouldWin ? "selected" : ""}`} onClick={() => onPick(category.id, "should_win", isShouldWin ? null : nominee)}>
                  {isShouldWin ? "♥" : "♡"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// LEADERBOARD
// ============================================================
function Leaderboard({ currentUserId, show }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winnersAnnounced, setWinnersAnnounced] = useState(false);

  useEffect(() => { loadLeaderboard(); }, [show.id]);

  const loadLeaderboard = async () => {
    setLoading(true);
    const { data: winData } = await supabase.from("winners").select("*").eq("show_id", show.id);
    const winMap = {};
    (winData || []).forEach(w => { winMap[w.category_id] = w.will_win_winner; });
    setWinnersAnnounced(Object.keys(winMap).length > 0);

    const { data: picks } = await supabase.from("picks").select("*").eq("show_id", show.id);
    const { data: profiles } = await supabase.from("profiles").select("*");
    const profileMap = {};
    (profiles || []).forEach(p => profileMap[p.id] = p.display_name || p.email);

    const scoreMap = {};
    (picks || []).forEach(pick => {
      if (!scoreMap[pick.user_id]) scoreMap[pick.user_id] = { will_win: 0, should_win: 0 };
      const winner = winMap[pick.category_id];
      if (!winner) return;
      if (pick.will_win === winner) scoreMap[pick.user_id].will_win++;
      if (pick.should_win === winner) scoreMap[pick.user_id].should_win++;
    });

    const leaderboard = Object.entries(scoreMap)
      .map(([uid, scores]) => ({ uid, name: profileMap[uid] || "Anonymous", ...scores, total: scores.will_win + scores.should_win, isYou: uid === currentUserId }))
      .sort((a, b) => b.total - a.total || b.will_win - a.will_win);
    setEntries(leaderboard);
    setLoading(false);
  };

  if (loading) return <div className="app-main"><div className="loading">Loading…</div></div>;

  return (
    <div className="app-main">
      <h2 className="section-title">Leaderboard</h2>
      {!winnersAnnounced && <p className="leaderboard-note">Scores populate after the ceremony on {show.date}. Make your picks now!</p>}
      {entries.length === 0 && <p className="leaderboard-note">No picks yet — be the first!</p>}
      <div className="leaderboard">
        <div className="lb-header"><span>Rank</span><span>Name</span><span>★</span><span>♥</span><span>Total</span></div>
        {entries.map((entry, i) => (
          <div key={entry.uid} className={`lb-row ${entry.isYou ? "lb-you" : ""}`}>
            <span className="lb-rank">#{i + 1}</span>
            <span className="lb-name">{entry.name} {entry.isYou && <em>(you)</em>}</span>
            <span className="lb-score">{entry.will_win}</span>
            <span className="lb-score">{entry.should_win}</span>
            <span className="lb-total">{entry.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COMMUNITY
// ============================================================
function Community({ currentUserId, show }) {
  const [allPicks, setAllPicks] = useState({});
  const [loading, setLoading] = useState(true);
  const [compareUser, setCompareUser] = useState(null);
  const [compareSearch, setCompareSearch] = useState("");
  const [userList, setUserList] = useState([]);
  const [comparePicks, setComparePicks] = useState({});
  const [myPicks, setMyPicks] = useState({});
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => { loadAll(); }, [show.id]);

  const loadAll = async () => {
    setLoading(true);
    const { data: picks } = await supabase.from("picks").select("*").eq("show_id", show.id);
    const { data: profiles } = await supabase.from("profiles").select("*");
    setUserList((profiles || []).filter(p => p.id !== currentUserId));

    const mine = {};
    (picks || []).filter(p => p.user_id === currentUserId).forEach(p => { mine[p.category_id] = p; });
    setMyPicks(mine);

    const agg = {}, totals = {};
    (picks || []).forEach(pick => {
      if (!agg[pick.category_id]) agg[pick.category_id] = {};
      if (!totals[pick.category_id]) totals[pick.category_id] = { will: 0, should: 0 };
      if (pick.will_win) {
        if (!agg[pick.category_id][pick.will_win]) agg[pick.category_id][pick.will_win] = { will_count: 0, should_count: 0 };
        agg[pick.category_id][pick.will_win].will_count++;
        totals[pick.category_id].will++;
      }
      if (pick.should_win) {
        if (!agg[pick.category_id][pick.should_win]) agg[pick.category_id][pick.should_win] = { will_count: 0, should_count: 0 };
        agg[pick.category_id][pick.should_win].should_count++;
        totals[pick.category_id].should++;
      }
    });
    const pctMap = {};
    Object.entries(agg).forEach(([catId, nominees]) => {
      pctMap[catId] = {};
      Object.entries(nominees).forEach(([nom, counts]) => {
        pctMap[catId][nom] = {
          will_win_pct: totals[catId]?.will ? (counts.will_count / totals[catId].will) * 100 : 0,
          should_win_pct: totals[catId]?.should ? (counts.should_count / totals[catId].should) * 100 : 0,
        };
      });
    });
    setAllPicks(pctMap);
    setLoading(false);
  };

  const loadComparePicks = async (userId) => {
    const { data } = await supabase.from("picks").select("*").eq("user_id", userId).eq("show_id", show.id);
    const map = {};
    (data || []).forEach(p => { map[p.category_id] = p; });
    setComparePicks(map);
  };

  const handleSelectUser = async (profile) => {
    setCompareUser(profile);
    setCompareMode(true);
    await loadComparePicks(profile.id);
  };

  const filteredUsers = userList.filter(u =>
    (u.display_name || u.email || "").toLowerCase().includes(compareSearch.toLowerCase())
  );

  if (loading) return <div className="app-main"><div className="loading">Loading…</div></div>;

  return (
    <div className="app-main">
      <div className="community-tabs">
        <button className={!compareMode ? "active" : ""} onClick={() => setCompareMode(false)}>Community Picks</button>
        <button className={compareMode ? "active" : ""} onClick={() => setCompareMode(true)}>Compare with a Friend</button>
      </div>

      {!compareMode && (
        <>
          <div className="community-legend">
            <span className="agg-badge will-agg">★%</span> Will Win consensus &nbsp;
            <span className="agg-badge should-agg">♥%</span> Should Win consensus
          </div>
          <div className="community-grid">
            {show.categories.map(cat => {
              const catData = allPicks[cat.id];
              if (!catData) return null;
              const sorted = cat.nominees.map(nom => ({ nom, ...catData[nom] })).filter(n => n.will_win_pct > 0 || n.should_win_pct > 0).sort((a, b) => (b.will_win_pct || 0) - (a.will_win_pct || 0));
              if (sorted.length === 0) return null;
              return (
                <div key={cat.id} className="community-card">
                  <h4>{cat.name}</h4>
                  {sorted.map(item => (
                    <div key={item.nom} className="community-row">
                      <span className="community-nom">{item.nom}</span>
                      {item.will_win_pct > 0 && <span className="agg-badge will-agg">{Math.round(item.will_win_pct)}%</span>}
                      {item.should_win_pct > 0 && <span className="agg-badge should-agg">{Math.round(item.should_win_pct)}%</span>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      {compareMode && (
        <div className="compare-wrap">
          {!compareUser ? (
            <div className="compare-search-wrap">
              <h3 className="compare-title">Find a friend to compare with</h3>
              <input className="auth-input compare-search" placeholder="Search by display name…" value={compareSearch} onChange={e => setCompareSearch(e.target.value)} />
              <div className="user-list">
                {filteredUsers.length === 0 && <p className="leaderboard-note">No users found.</p>}
                {filteredUsers.map(u => (
                  <button key={u.id} className="user-list-item" onClick={() => handleSelectUser(u)}>
                    <span className="user-avatar">{(u.display_name || u.email || "?")[0].toUpperCase()}</span>
                    <span>{u.display_name || u.email}</span>
                  </button>
                ))}
              </div>
              <div className="compare-link-section">
                <p className="compare-link-label">Or share your profile link:</p>
                <div className="compare-link-box">
                  <span className="compare-link-text">{window.location.origin}/?compare={currentUserId}</span>
                  <button className="copy-link-btn" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/?compare=${currentUserId}`)}>Copy</button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="compare-header">
                <button className="back-btn" onClick={() => { setCompareUser(null); setCompareSearch(""); }}>← Back</button>
                <h3 className="compare-title">You vs {compareUser.display_name || compareUser.email}</h3>
              </div>
              <div className="compare-legend">
                <span className="compare-you-dot" /> You &nbsp;
                <span className="compare-them-dot" /> {compareUser.display_name || compareUser.email} &nbsp;
                <span className="compare-match-dot" /> Both agree
              </div>
              <div className="compare-grid">
                {show.categories.map(cat => {
                  const myW = myPicks[cat.id]?.will_win, myS = myPicks[cat.id]?.should_win;
                  const theirW = comparePicks[cat.id]?.will_win, theirS = comparePicks[cat.id]?.should_win;
                  const willMatch = myW && theirW && myW === theirW;
                  const shouldMatch = myS && theirS && myS === theirS;
                  return (
                    <div key={cat.id} className="compare-card">
                      <h4>{cat.name}</h4>
                      <div className="compare-row">
                        <span className="compare-col-label will-label">★ Will Win</span>
                        <div className="compare-picks-col">
                          {willMatch ? <div className="compare-pick match"><span className="cp-who">Both</span>{myW}</div> : <>
                            {myW && <div className="compare-pick you"><span className="cp-who">You</span>{myW}</div>}
                            {theirW && <div className="compare-pick them"><span className="cp-who">Them</span>{theirW}</div>}
                          </>}
                          {!myW && !theirW && <div className="compare-pick empty">—</div>}
                        </div>
                      </div>
                      <div className="compare-row">
                        <span className="compare-col-label should-label">♥ Should Win</span>
                        <div className="compare-picks-col">
                          {shouldMatch ? <div className="compare-pick match"><span className="cp-who">Both</span>{myS}</div> : <>
                            {myS && <div className="compare-pick you"><span className="cp-who">You</span>{myS}</div>}
                            {theirS && <div className="compare-pick them"><span className="cp-who">Them</span>{theirS}</div>}
                          </>}
                          {!myS && !theirS && <div className="compare-pick empty">—</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PROFILE
// ============================================================
function Profile({ user, picks, show }) {
  const [winners, setWinners] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Friend";

  useEffect(() => { loadWinners(); }, [show.id]);

  const loadWinners = async () => {
    const { data } = await supabase.from("winners").select("*").eq("show_id", show.id);
    const map = {};
    (data || []).forEach(w => { map[w.category_id] = w.will_win_winner; });
    setWinners(map);
    setLoading(false);
  };

  const categories = show.categories;
  const winnersAnnounced = Object.keys(winners).length > 0;
  const categoriesWithWinners = categories.filter(c => winners[c.id]);
  const willWinCorrect = categoriesWithWinners.filter(c => picks[c.id]?.will_win === winners[c.id]).length;
  const shouldWinCorrect = categoriesWithWinners.filter(c => picks[c.id]?.should_win === winners[c.id]).length;
  const totalAnswered = categoriesWithWinners.length;
  const bothPicked = categories.filter(c => picks[c.id]?.will_win && picks[c.id]?.should_win).length;
  const completionPct = Math.round((bothPicked / categories.length) * 100);

  const shareUrl = `${window.location.origin}/?compare=${user.id}`;
  const copyShare = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (loading) return <div className="app-main"><div className="loading">Loading…</div></div>;

  return (
    <div className="app-main">
      <div className="profile-wrap">
        <div className="profile-card">
          <div className="profile-avatar">{displayName[0].toUpperCase()}</div>
          <div className="profile-info">
            <h2 className="profile-name">{displayName}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-year">{show.name}</p>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-box">
            <span className="stat-num">{bothPicked}/{categories.length}</span>
            <span className="stat-label">Ballot complete</span>
            <div className="stat-bar-track"><div className="stat-bar-fill" style={{ width: `${completionPct}%` }} /></div>
          </div>
          {winnersAnnounced ? <>
            <div className="stat-box">
              <span className="stat-num gold">{willWinCorrect}/{totalAnswered}</span>
              <span className="stat-label">★ Will Win correct</span>
              <div className="stat-bar-track"><div className="stat-bar-fill gold" style={{ width: `${totalAnswered ? (willWinCorrect / totalAnswered) * 100 : 0}%` }} /></div>
            </div>
            <div className="stat-box">
              <span className="stat-num crimson">{shouldWinCorrect}/{totalAnswered}</span>
              <span className="stat-label">♥ Should Win matched</span>
              <div className="stat-bar-track"><div className="stat-bar-fill crimson" style={{ width: `${totalAnswered ? (shouldWinCorrect / totalAnswered) * 100 : 0}%` }} /></div>
            </div>
          </> : (
            <div className="stat-box stat-pending">
              <span className="stat-num">—</span>
              <span className="stat-label">Accuracy scores available after {show.date}</span>
            </div>
          )}
        </div>
        <div className="profile-share">
          <p className="profile-share-label">Share your ballot with friends</p>
          <div className="compare-link-box">
            <span className="compare-link-text">{shareUrl}</span>
            <button className="copy-link-btn" onClick={copyShare}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>
        {winnersAnnounced && (
          <div className="profile-picks-summary">
            <h3 className="profile-section-title">Your Results</h3>
            {categories.filter(c => winners[c.id]).map(cat => {
              const myW = picks[cat.id]?.will_win, myS = picks[cat.id]?.should_win;
              const actual = winners[cat.id];
              return (
                <div key={cat.id} className="result-row">
                  <span className="result-cat">{cat.name}</span>
                  <span className="result-winner">{actual}</span>
                  <span className={`result-badge ${myW === actual ? "correct" : "wrong"}`}>{myW === actual ? "★✓" : "★✗"}</span>
                  <span className={`result-badge ${myS === actual ? "correct" : "wrong"}`}>{myS === actual ? "♥✓" : "♥✗"}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// GLOSSARY
// ============================================================
function GlossaryView() {
  const [open, setOpen] = useState({});
  const toggle = key => setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  return (
    <div className="app-main">
      <h2 className="section-title">Guide & Glossary</h2>
      <p className="glossary-intro">Everything you need to understand the ballot — from how Will Win and Should Win work, to what every category means.</p>
      {GLOSSARY.map(section => (
        <div key={section.section} className="glossary-section">
          <h3 className="glossary-section-title">{section.section}</h3>
          {section.items.map(item => {
            const key = `${section.section}-${item.term}`;
            return (
              <div key={key} className={`glossary-item ${open[key] ? "open" : ""}`}>
                <button className="glossary-term" onClick={() => toggle(key)}>
                  <span>{item.term}</span>
                  <span className="glossary-chevron">{open[key] ? "−" : "+"}</span>
                </button>
                {open[key] && <div className="glossary-def">{item.def}</div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ADMIN PANEL
// ============================================================

// ---- helpers ----
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function newCategory() {
  return { _id: Math.random().toString(36).slice(2), name: "", nominees: [""] };
}

// ---- Add Show Form ----
function AddShowForm({ onSaved, allShows }) {
  const [form, setForm] = useState({
    name: "", shortName: "", org: "", year: new Date().getFullYear() + 1,
    date: "", status: "upcoming",
  });
  const [categories, setCategories] = useState([newCategory()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Category helpers
  const addCategory = () => setCategories(cs => [...cs, newCategory()]);
  const removeCategory = (id) => setCategories(cs => cs.filter(c => c._id !== id));
  const setCatName = (id, val) => setCategories(cs => cs.map(c => c._id === id ? { ...c, name: val } : c));
  const addNominee = (id) => setCategories(cs => cs.map(c => c._id === id ? { ...c, nominees: [...c.nominees, ""] } : c));
  const removeNominee = (id, idx) => setCategories(cs => cs.map(c => c._id === id ? { ...c, nominees: c.nominees.filter((_, i) => i !== idx) } : c));
  const setNominee = (id, idx, val) => setCategories(cs => cs.map(c => c._id === id ? { ...c, nominees: c.nominees.map((n, i) => i === idx ? val : n) } : c));

  const handleSave = async () => {
    setError("");
    if (!form.name.trim()) return setError("Show name is required.");
    if (!form.shortName.trim()) return setError("Short name is required.");
    const filledCats = categories.filter(c => c.name.trim() && c.nominees.some(n => n.trim()));
    if (filledCats.length === 0) return setError("Add at least one category with at least one nominee.");

    const showId = slugify(form.name) + "_" + form.year;
    // Check for duplicate id
    if (allShows.some(s => s.id === showId)) return setError(`A show with id "${showId}" already exists.`);

    setSaving(true);
    // Save show
    const { error: showErr } = await supabase.from("db_shows").insert({
      id: showId,
      name: form.name.trim(),
      short_name: form.shortName.trim(),
      org: form.org.trim(),
      year: parseInt(form.year),
      date: form.date.trim(),
      status: form.status,
    });
    if (showErr) { setSaving(false); return setError(showErr.message); }

    // Save categories
    const catRows = filledCats.map((c, order) => ({
      show_id: showId,
      id: slugify(c.name),
      name: c.name.trim(),
      nominees: c.nominees.filter(n => n.trim()),
      sort_order: order,
    }));
    const { error: catErr } = await supabase.from("db_show_categories").insert(catRows);
    if (catErr) { setSaving(false); return setError(catErr.message); }

    setSaving(false);
    setSuccess(true);
    onSaved();
  };

  if (success) return (
    <div className="admin-success">
      <p>✓ Show saved successfully!</p>
      <button className="back-btn" onClick={() => setSuccess(false)}>Add another show</button>
    </div>
  );

  return (
    <div className="add-show-form">
      <h3 className="admin-section-title">Add a New Show</h3>
      <p className="admin-hint">Fill in the show details and build out the categories. Only categories with at least one nominee will be saved.</p>

      {error && <div className="auth-error" style={{ marginBottom: "1rem" }}>{error}</div>}

      {/* Show details */}
      <div className="add-show-fields">
        <div className="add-show-field">
          <label className="admin-cat-label">Show Name *</label>
          <input className="auth-input" placeholder="e.g. 76th Emmy Awards" value={form.name} onChange={e => setField("name", e.target.value)} />
        </div>
        <div className="add-show-field">
          <label className="admin-cat-label">Short Name *</label>
          <input className="auth-input" placeholder="e.g. Emmys" value={form.shortName} onChange={e => setField("shortName", e.target.value)} />
        </div>
        <div className="add-show-field">
          <label className="admin-cat-label">Organization</label>
          <input className="auth-input" placeholder="e.g. Television Academy" value={form.org} onChange={e => setField("org", e.target.value)} />
        </div>
        <div className="add-show-field-row">
          <div className="add-show-field">
            <label className="admin-cat-label">Year *</label>
            <input className="auth-input" type="number" value={form.year} onChange={e => setField("year", e.target.value)} />
          </div>
          <div className="add-show-field">
            <label className="admin-cat-label">Ceremony Date</label>
            <input className="auth-input" placeholder="e.g. September 21, 2026" value={form.date} onChange={e => setField("date", e.target.value)} />
          </div>
          <div className="add-show-field">
            <label className="admin-cat-label">Status</label>
            <select className="admin-select" value={form.status} onChange={e => setField("status", e.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active (open for picks)</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="add-show-cats-header">
        <h4 className="admin-section-title" style={{ fontSize: "0.95rem" }}>Categories</h4>
        <button className="add-cat-btn" onClick={addCategory}>+ Add Category</button>
      </div>

      <div className="add-show-cats">
        {categories.map((cat, ci) => (
          <div key={cat._id} className="add-cat-block">
            <div className="add-cat-header">
              <input
                className="auth-input add-cat-name-input"
                placeholder={`Category ${ci + 1} name, e.g. Best Picture`}
                value={cat.name}
                onChange={e => setCatName(cat._id, e.target.value)}
              />
              <button className="remove-btn" onClick={() => removeCategory(cat._id)} title="Remove category">✕</button>
            </div>
            <div className="add-nominees-list">
              {cat.nominees.map((nom, ni) => (
                <div key={ni} className="add-nominee-row">
                  <input
                    className="auth-input add-nominee-input"
                    placeholder={`Nominee ${ni + 1}`}
                    value={nom}
                    onChange={e => setNominee(cat._id, ni, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") { e.preventDefault(); addNominee(cat._id); }
                    }}
                  />
                  {cat.nominees.length > 1 && (
                    <button className="remove-btn remove-btn-sm" onClick={() => removeNominee(cat._id, ni)} title="Remove nominee">✕</button>
                  )}
                </div>
              ))}
              <button className="add-nominee-btn" onClick={() => addNominee(cat._id)}>+ Add Nominee</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <button className="auth-submit admin-save-btn" style={{ width: "auto", minWidth: "180px" }} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Show"}
        </button>
      </div>
    </div>
  );
}

// ---- Manage Shows (edit status of DB shows) ----
function ManageShows({ dbShows, onRefresh }) {
  const [saving, setSaving] = useState(null);

  const updateStatus = async (showId, status) => {
    setSaving(showId);
    await supabase.from("db_shows").update({ status }).eq("id", showId);
    setSaving(null);
    onRefresh();
  };

  if (dbShows.length === 0) return <p className="leaderboard-note">No database shows yet. Use "Add Show" to create one.</p>;

  return (
    <div className="manage-shows-list">
      {dbShows.map(show => (
        <div key={show.id} className="manage-show-row">
          <div className="manage-show-info">
            <span className="manage-show-name">{show.name}</span>
            <span className="manage-show-date">{show.date}</span>
          </div>
          <select
            className="admin-select manage-show-select"
            value={show.status}
            onChange={e => updateStatus(show.id, e.target.value)}
            disabled={saving === show.id}
          >
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      ))}
    </div>
  );
}

// ---- Main Admin Panel ----
function AdminPanel({ onBack }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [adminTab, setAdminTab] = useState("winners"); // "winners" | "add" | "manage"
  const [selectedShow, setSelectedShow] = useState(null);
  const [allShows, setAllShows] = useState([]);
  const [dbShows, setDbShows] = useState([]);
  const [winners, setWinners] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      loadDbShows();
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  };

  const loadDbShows = async () => {
    const { data } = await supabase.from("db_shows").select("*").order("year", { ascending: false });
    const shows = await Promise.all((data || []).map(async s => {
      const { data: cats } = await supabase.from("db_show_categories").select("*").eq("show_id", s.id).order("sort_order");
      return {
        id: s.id, name: s.name, shortName: s.short_name, org: s.org,
        year: s.year, date: s.date, status: s.status,
        categories: (cats || []).map(c => ({ id: c.id, name: c.name, nominees: c.nominees })),
        fromDb: true,
      };
    }));
    setDbShows(shows);
    const combined = [...SHOWS, ...shows];
    setAllShows(combined);
    const first = combined[0];
    setSelectedShow(first);
    loadWinners(first.id);
  };

  const loadWinners = async (showId) => {
    const { data } = await supabase.from("winners").select("*").eq("show_id", showId);
    const map = {};
    (data || []).forEach(w => { map[w.category_id] = w.will_win_winner || ""; });
    setWinners(map);
  };

  const handleShowChange = (show) => {
    setSelectedShow(show);
    loadWinners(show.id);
  };

  const handleWinnerChange = (catId, value) => {
    setWinners(prev => ({ ...prev, [catId]: value }));
  };

  const saveAll = async () => {
    setSaving(true);
    const rows = Object.entries(winners)
      .filter(([, v]) => v)
      .map(([category_id, will_win_winner]) => ({ show_id: selectedShow.id, category_id, will_win_winner }));
    if (rows.length > 0) {
      await supabase.from("winners").upsert(rows, { onConflict: "show_id,category_id" });
    }
    setSaving(false);
    setSaveMsg("Saved!");
    setTimeout(() => setSaveMsg(""), 2000);
  };

  if (!authed) {
    return (
      <div className="auth-backdrop">
        <div className="auth-modal">
          <Logo />
          <p className="auth-tagline">Admin Access</p>
          <input className="auth-input" type="password" placeholder="Admin password" value={pw}
            onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
          {pwError && <div className="auth-error">Incorrect password.</div>}
          <button className="auth-submit" onClick={login}>Enter</button>
          <button className="back-btn" style={{ alignSelf: "center", marginTop: "0.5rem" }} onClick={onBack}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="header-left">
            <button className="back-home-btn" onClick={onBack}>←</button>
            <Logo />
            <span className="show-context-badge">Admin</span>
          </div>
        </div>
        <nav className="app-nav">
          {[["winners","Enter Winners"],["add","Add Show"],["manage","Manage Shows"]].map(([id, label]) => (
            <button key={id} className={adminTab === id ? "nav-active" : ""} onClick={() => setAdminTab(id)}>{label}</button>
          ))}
        </nav>
      </header>

      <div className="app-main">

        {/* ENTER WINNERS TAB */}
        {adminTab === "winners" && selectedShow && (
          <>
            <div className="admin-show-tabs">
              {allShows.map(show => (
                <button key={show.id}
                  className={selectedShow.id === show.id ? "active" : ""}
                  onClick={() => handleShowChange(show)}>
                  {show.shortName} {show.year}
                </button>
              ))}
            </div>
            <div className="admin-section">
              <div className="admin-section-header">
                <h3 className="admin-section-title">Enter Winners — {selectedShow.name}</h3>
                <div className="admin-save-row">
                  {saveMsg && <span className="save-indicator saved">{saveMsg}</span>}
                  <button className="auth-submit admin-save-btn" onClick={saveAll} disabled={saving}>
                    {saving ? "Saving…" : "Save All Winners"}
                  </button>
                </div>
              </div>
              <p className="admin-hint">Select the winner from the dropdown for each category. Click "Save All Winners" when done.</p>
              <div className="admin-winners-grid">
                {selectedShow.categories.map(cat => (
                  <div key={cat.id} className="admin-winner-row">
                    <label className="admin-cat-label">{cat.name}</label>
                    <select className="admin-select" value={winners[cat.id] || ""} onChange={e => handleWinnerChange(cat.id, e.target.value)}>
                      <option value="">— Not yet announced —</option>
                      {cat.nominees.map(nom => <option key={nom} value={nom}>{nom}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ADD SHOW TAB */}
        {adminTab === "add" && (
          <AddShowForm allShows={allShows} onSaved={() => { loadDbShows(); setAdminTab("manage"); }} />
        )}

        {/* MANAGE SHOWS TAB */}
        {adminTab === "manage" && (
          <div className="admin-section">
            <h3 className="admin-section-title">Manage Shows</h3>
            <p className="admin-hint">Update the status of shows added via the admin panel. Code-defined shows (like the Oscars) are managed in App.jsx.</p>
            <ManageShows dbShows={dbShows} onRefresh={loadDbShows} />
          </div>
        )}

      </div>

      <footer className="app-footer">WillWin/ShouldWin Admin · willwinshouldwin.com</footer>
    </div>
  );
}

// ============================================================
// STANDALONE PROFILE PAGE (for /profile and ?compare= links)
// ============================================================
function StandaloneProfile({ user, onBack }) {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="header-left">
            <button className="back-home-btn" onClick={onBack}>←</button>
            <Logo onClick={onBack} />
          </div>
          <div className="header-right">
            <button className="signout-btn" onClick={() => supabase.auth.signOut()}>Sign Out</button>
          </div>
        </div>
      </header>
      <div className="app-main">
        <h2 className="section-title">My Profile</h2>
        {SHOWS.map(show => (
          <div key={show.id} style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontFamily: "Playfair Display, serif", color: "var(--gold-light)", marginBottom: "1rem" }}>{show.name}</h3>
            <Profile user={user} picks={{}} show={show} />
          </div>
        ))}
      </div>
      <footer className="app-footer">willwinshouldwin.com</footer>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("home");
  const [activeShow, setActiveShow] = useState(null);
  const [dbShows, setDbShows] = useState([]);
  const [showsLoading, setShowsLoading] = useState(true);

  useEffect(() => {
    document.title = "WillWin / ShouldWin";
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    loadDbShows();
    return () => subscription.unsubscribe();
  }, []);

  const loadDbShows = async () => {
    setShowsLoading(true);
    const { data } = await supabase.from("db_shows").select("*").order("year", { ascending: false });
    const shows = await Promise.all((data || []).map(async s => {
      const { data: cats } = await supabase.from("db_show_categories").select("*").eq("show_id", s.id).order("sort_order");
      return {
        id: s.id, name: s.name, shortName: s.short_name, org: s.org,
        year: s.year, date: s.date, status: s.status,
        categories: (cats || []).map(c => ({ id: c.id, name: c.name, nominees: c.nominees })),
        fromDb: true,
      };
    }));
    setDbShows(shows);
    setShowsLoading(false);
  };

  const allShows = [...SHOWS, ...dbShows];

  if (loading || showsLoading) return <div className="loading-screen"><div className="loading-inner">Loading…</div></div>;
  if (!user) return <AuthModal onAuth={setUser} />;

  if (screen === "admin") return <AdminPanel onBack={() => { setScreen("home"); loadDbShows(); }} />;

  if (screen === "show" && activeShow) {
    return <ShowApp show={activeShow} user={user} onGoHome={() => { setScreen("home"); setActiveShow(null); }} />;
  }

  if (screen === "profile") {
    return <StandaloneProfile user={user} onBack={() => setScreen("home")} />;
  }

  return (
    <HomeScreen
      onSelectShow={show => { setActiveShow(show); setScreen("show"); }}
      user={user}
      onGoProfile={() => setScreen("profile")}
      onGoAdmin={() => setScreen("admin")}
      allShows={allShows}
    />
  );
}
