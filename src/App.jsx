import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// 2026 OSCAR NOMINATIONS DATA (98th Academy Awards)
// ============================================================
const CATEGORIES = [
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
];

// ============================================================
// GLOSSARY DATA
// ============================================================
const GLOSSARY = [
  {
    section: "How It Works",
    items: [
      { term: "★ Will Win", def: "Your prediction for who the Academy will actually give the award to. This is your forecasting pick — who has the momentum, the campaign, the narrative. Being correct here scores you a point on the leaderboard." },
      { term: "♥ Should Win", def: "Your personal artistic judgment — who you believe deserves the award regardless of what the Academy decides. This is your taste on record. After the ceremony, we track how often your Should Win matched the actual winner too." },
      { term: "Leaderboard", def: "Scored separately for ★ and ♥ accuracy. Will Win correct picks reward forecasting skill; Should Win matches reward taste that aligned with the Academy — a rarer and more interesting distinction." },
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
      { term: "Original Screenplay", def: "Given to a script that was written directly for the screen — not based on pre-existing published material. Awarded to the writers, not the director." },
      { term: "Adapted Screenplay", def: "Given to a script based on existing source material: a novel, play, article, previous film, etc. The craft of adaptation — what to keep, what to reimagine — is its own distinct skill." },
    ],
  },
  {
    section: "Craft Categories",
    items: [
      { term: "Cinematography", def: "Honors the Director of Photography (DP) — the person responsible for how the film looks. This includes lighting, camera movement, framing, and the overall visual language of the film." },
      { term: "Film Editing", def: "Awarded to the editor who shaped the film's pacing, structure, and rhythm in post-production. Often said that films are written three times: in the script, on set, and in the edit." },
      { term: "Original Score", def: "Given to the composer who wrote music specifically for the film. Distinguished from Original Song, which requires a fully-formed song with lyrics." },
      { term: "Original Song", def: "Must be an original song written specifically for the film and featured in it. The nominees perform live at the ceremony, making this one of the most watched categories on the night." },
      { term: "Sound", def: "A merged category (since 2021) that combines what were previously two awards: Sound Editing (creating sound effects) and Sound Mixing (the final blend of dialogue, music, and effects). Action and music films tend to dominate." },
      { term: "Production Design", def: "Recognizes the people who design and oversee all the physical environments in a film — sets, locations, props. Period films and large-scale productions tend to dominate this category." },
      { term: "Costume Design", def: "Honors the costume designer responsible for all clothing and accessories worn on screen. Period dramas and fantasy films have historically dominated, though contemporary fashion films increasingly compete." },
      { term: "Makeup and Hairstyling", def: "Covers everything from prosthetics and aging effects to period-appropriate hairstyles. Transformative physical performances — where actors are made to look dramatically different — tend to receive nominations here." },
      { term: "Visual Effects", def: "Given to the VFX supervisors behind the computer-generated and practical effects in a film. Tends to favor large-scale blockbusters, though the Academy has shown increasing appreciation for invisible or restrained VFX work." },
    ],
  },
  {
    section: "Specialized Categories",
    items: [
      { term: "Animated Feature Film", def: "Open to feature-length animated films. Pixar, Disney, and Studio Ghibli have historically dominated, though the field has diversified significantly in recent years." },
      { term: "International Feature Film", def: "Formerly known as Best Foreign Language Film. Each country submits one film, and the Academy selects nominees from those submissions. A film is eligible regardless of language, as long as it originates from that country." },
      { term: "Documentary Feature", def: "Given to feature-length non-fiction films. The category has expanded in prestige — several documentary nominees have crossed over into mainstream critical conversation in recent years." },
      { term: "Casting (New in 2026!)", def: "A brand new Oscar category introduced for the 98th ceremony. Recognizes the casting directors who assembled the ensemble of performers for a film — a behind-the-scenes role that has long been considered Oscar-worthy by the industry." },
      { term: "Short Film Categories", def: "The Academy awards three short film Oscars: Animated Short, Live Action Short, and Documentary Short. These are among the hardest categories to predict because few voters — or audiences — have seen the nominees before voting." },
    ],
  },
];

// ============================================================
// LOGO
// ============================================================
function Logo() {
  return (
    <div className="logo-lockup">
      <div className="logo-text">
        <span className="logo-will">Will</span>
        <span className="logo-win">Win</span>
        <span className="logo-slash">/</span>
        <span className="logo-should">Should</span>
        <span className="logo-win2">Win</span>
      </div>
      <div className="logo-sub">98th Academy Awards · March 15, 2026</div>
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
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { display_name: displayName } },
        });
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
        <div className="auth-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign In</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Join</button>
        </div>
        {mode === "signup" && <input className="auth-input" placeholder="Display name" value={displayName} onChange={e => setDisplayName(e.target.value)} />}
        <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
        <p className="auth-tagline">Make your picks. Own your taste.</p>
      </div>
    </div>
  );
}

// ============================================================
// CATEGORY CARD
// ============================================================
function CategoryCard({ category, userPicks, onPick, aggregates, cardRef }) {
  const willWin = userPicks?.[category.id]?.will_win;
  const shouldWin = userPicks?.[category.id]?.should_win;

  return (
    <div className="category-card" ref={cardRef} id={`cat-${category.id}`}>
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
                <button className={`pick-btn will-btn ${isWillWin ? "selected" : ""}`} onClick={() => onPick(category.id, "will_win", isWillWin ? null : nominee)} title="Will Win">
                  {isWillWin ? "★" : "☆"}
                </button>
                <button className={`pick-btn should-btn ${isShouldWin ? "selected" : ""}`} onClick={() => onPick(category.id, "should_win", isShouldWin ? null : nominee)} title="Should Win">
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
// PICKS VIEW
// ============================================================
function PicksView({ user, picks, aggregates, onPick }) {
  const cardRefs = useRef({});
  const bothPicked = CATEGORIES.filter(c => picks[c.id]?.will_win && picks[c.id]?.should_win).length;
  const totalPicked = CATEGORIES.filter(c => picks[c.id]?.will_win || picks[c.id]?.should_win).length;

  const jumpToNext = () => {
    const next = CATEGORIES.find(c => !picks[c.id]?.will_win || !picks[c.id]?.should_win);
    if (next) {
      const el = document.getElementById(`cat-${next.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const allDone = bothPicked === CATEGORIES.length;

  return (
    <div>
      {/* Progress bar */}
      <div className="progress-bar-wrap">
        <div className="progress-bar-inner">
          <span className="progress-text">
            {bothPicked}/{CATEGORIES.length} complete
          </span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(bothPicked / CATEGORIES.length) * 100}%` }} />
          </div>
          {!allDone && (
            <button className="jump-btn" onClick={jumpToNext}>
              Next unpicked ↓
            </button>
          )}
          {allDone && <span className="progress-done">All done! ✓</span>}
        </div>
      </div>

      <div className="app-main">
        <div className="picks-grid">
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              userPicks={picks}
              onPick={onPick}
              aggregates={aggregates}
              cardRef={el => cardRefs.current[cat.id] = el}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LEADERBOARD
// ============================================================
function Leaderboard({ currentUserId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState({});

  useEffect(() => { loadLeaderboard(); }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    const { data: winData } = await supabase.from("winners").select("*");
    const winMap = {};
    (winData || []).forEach(w => { winMap[w.category_id] = w.will_win_winner; });
    setWinners(winMap);

    const { data: picks } = await supabase.from("picks").select("*");
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
      .map(([uid, scores]) => ({
        uid, name: profileMap[uid] || "Anonymous",
        will_win: scores.will_win, should_win: scores.should_win,
        total: scores.will_win + scores.should_win,
        isYou: uid === currentUserId,
      }))
      .sort((a, b) => b.total - a.total || b.will_win - a.will_win);

    setEntries(leaderboard);
    setLoading(false);
  };

  if (loading) return <div className="app-main"><div className="loading">Loading…</div></div>;
  const winnersAnnounced = Object.keys(winners).length > 0;

  return (
    <div className="app-main">
      <h2 className="section-title">Leaderboard</h2>
      {!winnersAnnounced && <p className="leaderboard-note">Scores populate after the ceremony on March 15. Make your picks now!</p>}
      {entries.length === 0 && <p className="leaderboard-note">No picks yet — be the first!</p>}
      <div className="leaderboard">
        <div className="lb-header">
          <span>Rank</span><span>Name</span>
          <span title="Correct Will Win picks">★</span>
          <span title="Correct Should Win picks">♥</span>
          <span>Total</span>
        </div>
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
function Community({ currentUserId }) {
  const [allPicks, setAllPicks] = useState({});
  const [loading, setLoading] = useState(true);
  const [compareUser, setCompareUser] = useState(null);
  const [compareSearch, setCompareSearch] = useState("");
  const [userList, setUserList] = useState([]);
  const [comparePicks, setComparePicks] = useState({});
  const [myPicks, setMyPicks] = useState({});
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const { data: picks } = await supabase.from("picks").select("*");
    const { data: profiles } = await supabase.from("profiles").select("*");

    // Build user list for search (exclude self)
    setUserList((profiles || []).filter(p => p.id !== currentUserId));

    // My picks
    const mine = {};
    (picks || []).filter(p => p.user_id === currentUserId).forEach(p => { mine[p.category_id] = p; });
    setMyPicks(mine);

    // Aggregates
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
    const { data } = await supabase.from("picks").select("*").eq("user_id", userId);
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
      {/* Tab strip: Aggregate vs Compare */}
      <div className="community-tabs">
        <button className={!compareMode ? "active" : ""} onClick={() => setCompareMode(false)}>Community Picks</button>
        <button className={compareMode ? "active" : ""} onClick={() => setCompareMode(true)}>Compare with a Friend</button>
      </div>

      {/* AGGREGATE VIEW */}
      {!compareMode && (
        <>
          <div className="community-legend">
            <span className="agg-badge will-agg">★%</span> Will Win consensus &nbsp;
            <span className="agg-badge should-agg">♥%</span> Should Win consensus
          </div>
          <div className="community-grid">
            {CATEGORIES.map(cat => {
              const catData = allPicks[cat.id];
              if (!catData) return null;
              const sorted = cat.nominees
                .map(nom => ({ nom, ...catData[nom] }))
                .filter(n => n.will_win_pct > 0 || n.should_win_pct > 0)
                .sort((a, b) => (b.will_win_pct || 0) - (a.will_win_pct || 0));
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

      {/* COMPARE VIEW */}
      {compareMode && (
        <div className="compare-wrap">
          {!compareUser ? (
            <div className="compare-search-wrap">
              <h3 className="compare-title">Find a friend to compare with</h3>
              <input
                className="auth-input compare-search"
                placeholder="Search by display name…"
                value={compareSearch}
                onChange={e => setCompareSearch(e.target.value)}
              />
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
                  <button className="copy-link-btn" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/?compare=${currentUserId}`)}>
                    Copy
                  </button>
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
                <span className="compare-you-dot" /> You &nbsp;&nbsp;
                <span className="compare-them-dot" /> {compareUser.display_name || compareUser.email} &nbsp;&nbsp;
                <span className="compare-match-dot" /> Both agree
              </div>
              <div className="compare-grid">
                {CATEGORIES.map(cat => {
                  const myW = myPicks[cat.id]?.will_win;
                  const myS = myPicks[cat.id]?.should_win;
                  const theirW = comparePicks[cat.id]?.will_win;
                  const theirS = comparePicks[cat.id]?.should_win;
                  const willMatch = myW && theirW && myW === theirW;
                  const shouldMatch = myS && theirS && myS === theirS;

                  return (
                    <div key={cat.id} className="compare-card">
                      <h4>{cat.name}</h4>
                      <div className="compare-row">
                        <span className="compare-col-label will-label">★ Will Win</span>
                        <div className="compare-picks-col">
                          {myW && <div className={`compare-pick ${willMatch ? "match" : "you"}`}><span className="cp-who">You</span> {myW}</div>}
                          {theirW && !willMatch && <div className="compare-pick them"><span className="cp-who">Them</span> {theirW}</div>}
                          {willMatch && <div className="compare-pick match"><span className="cp-who">Both</span> {myW}</div>}
                          {!myW && !theirW && <div className="compare-pick empty">—</div>}
                        </div>
                      </div>
                      <div className="compare-row">
                        <span className="compare-col-label should-label">♥ Should Win</span>
                        <div className="compare-picks-col">
                          {myS && <div className={`compare-pick ${shouldMatch ? "match" : "you"}`}><span className="cp-who">You</span> {myS}</div>}
                          {theirS && !shouldMatch && <div className="compare-pick them"><span className="cp-who">Them</span> {theirS}</div>}
                          {shouldMatch && <div className="compare-pick match"><span className="cp-who">Both</span> {myS}</div>}
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
function Profile({ user, picks }) {
  const [winners, setWinners] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Friend";

  useEffect(() => { loadWinners(); }, []);

  const loadWinners = async () => {
    const { data } = await supabase.from("winners").select("*");
    const map = {};
    (data || []).forEach(w => { map[w.category_id] = w.will_win_winner; });
    setWinners(map);
    setLoading(false);
  };

  const winnersAnnounced = Object.keys(winners).length > 0;
  const categoriesWithWinners = CATEGORIES.filter(c => winners[c.id]);
  const willWinCorrect = categoriesWithWinners.filter(c => picks[c.id]?.will_win === winners[c.id]).length;
  const shouldWinCorrect = categoriesWithWinners.filter(c => picks[c.id]?.should_win === winners[c.id]).length;
  const totalAnswered = categoriesWithWinners.length;

  const bothPicked = CATEGORIES.filter(c => picks[c.id]?.will_win && picks[c.id]?.should_win).length;
  const completionPct = Math.round((bothPicked / CATEGORIES.length) * 100);

  const shareUrl = `${window.location.origin}/?compare=${user.id}`;
  const copyShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-main">
      <div className="profile-wrap">
        {/* Profile card */}
        <div className="profile-card">
          <div className="profile-avatar">{displayName[0].toUpperCase()}</div>
          <div className="profile-info">
            <h2 className="profile-name">{displayName}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-year">98th Academy Awards · 2026</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="profile-stats">
          <div className="stat-box">
            <span className="stat-num">{bothPicked}/{CATEGORIES.length}</span>
            <span className="stat-label">Ballot complete</span>
            <div className="stat-bar-track"><div className="stat-bar-fill" style={{ width: `${completionPct}%` }} /></div>
          </div>
          {winnersAnnounced && (
            <>
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
            </>
          )}
          {!winnersAnnounced && (
            <div className="stat-box stat-pending">
              <span className="stat-num">—</span>
              <span className="stat-label">Accuracy scores available after March 15</span>
            </div>
          )}
        </div>

        {/* Shareable profile link */}
        <div className="profile-share">
          <p className="profile-share-label">Share your ballot with friends</p>
          <div className="compare-link-box">
            <span className="compare-link-text">{shareUrl}</span>
            <button className="copy-link-btn" onClick={copyShare}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>

        {/* Picks summary */}
        {winnersAnnounced && (
          <div className="profile-picks-summary">
            <h3 className="profile-section-title">Your Results</h3>
            {CATEGORIES.filter(c => winners[c.id]).map(cat => {
              const myW = picks[cat.id]?.will_win;
              const myS = picks[cat.id]?.should_win;
              const actual = winners[cat.id];
              const wCorrect = myW === actual;
              const sCorrect = myS === actual;
              return (
                <div key={cat.id} className="result-row">
                  <span className="result-cat">{cat.name}</span>
                  <span className="result-winner">{actual}</span>
                  <span className={`result-badge ${wCorrect ? "correct" : "wrong"}`}>{wCorrect ? "★✓" : "★✗"}</span>
                  <span className={`result-badge ${sCorrect ? "correct" : "wrong"}`}>{sCorrect ? "♥✓" : "♥✗"}</span>
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
      <p className="glossary-intro">Everything you need to understand the ballot — from how Will Win and Should Win work, to what every Oscar category actually means.</p>
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
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [picks, setPicks] = useState({});
  const [aggregates, setAggregates] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [view, setView] = useState("picks");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    // Handle ?compare= deep links
    const params = new URLSearchParams(window.location.search);
    if (params.get("compare")) setView("community");

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) { loadPicks(); loadAggregates(); }
  }, [user]);

  const loadPicks = async () => {
    const { data } = await supabase.from("picks").select("*").eq("user_id", user.id);
    const map = {};
    (data || []).forEach(row => { map[row.category_id] = { will_win: row.will_win, should_win: row.should_win }; });
    setPicks(map);
  };

  const loadAggregates = async () => {
    const { data: allPicks } = await supabase.from("picks").select("*");
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
      user_id: user.id, category_id: categoryId,
      will_win: newPicks[categoryId]?.will_win || null,
      should_win: newPicks[categoryId]?.should_win || null,
    }, { onConflict: "user_id,category_id" });
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
    loadAggregates();
  };

  if (loading) return <div className="loading-screen"><div className="loading-inner">Loading…</div></div>;
  if (!user) return <AuthModal onAuth={setUser} />;

  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Friend";

  const NAV_ITEMS = [
    { id: "picks", label: "My Picks" },
    { id: "community", label: "Community" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "profile", label: "Profile" },
    { id: "glossary", label: "Guide" },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <Logo />
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

      {view === "picks" && <PicksView user={user} picks={picks} aggregates={aggregates} onPick={handlePick} />}
      {view === "community" && <Community currentUserId={user.id} />}
      {view === "leaderboard" && <Leaderboard currentUserId={user.id} />}
      {view === "profile" && <Profile user={user} picks={picks} />}
      {view === "glossary" && <GlossaryView />}

      <footer className="app-footer">98th Academy Awards · willwinshouldwin.com</footer>
    </div>
  );
}
