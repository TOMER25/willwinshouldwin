import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// CONFIGURATION - Replace these with your Supabase credentials
// ============================================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// 2026 OSCAR NOMINATIONS DATA (98th Academy Awards)
// Ceremony: March 15, 2026
// ============================================================
const CATEGORIES = [
  {
    id: "best_picture",
    name: "Best Picture",
    nominees: [
      "Bugonia",
      "F1",
      "Frankenstein",
      "Hamnet",
      "Marty Supreme",
      "One Battle After Another",
      "The Secret Agent",
      "Sentimental Value",
      "Sinners",
      "Train Dreams",
    ],
  },
  {
    id: "best_director",
    name: "Best Director",
    nominees: [
      "Paul Thomas Anderson — One Battle After Another",
      "Ryan Coogler — Sinners",
      "Josh Safdie — Marty Supreme",
      "Joachim Trier — Sentimental Value",
      "Chloé Zhao — Hamnet",
    ],
  },
  {
    id: "best_actor",
    name: "Best Actor",
    nominees: [
      "Timothée Chalamet — Marty Supreme",
      "Leonardo DiCaprio — One Battle After Another",
      "Ethan Hawke — Blue Moon",
      "Michael B. Jordan — Sinners",
      "Wagner Moura — The Secret Agent",
    ],
  },
  {
    id: "best_actress",
    name: "Best Actress",
    nominees: [
      "Jessie Buckley — Hamnet",
      "Rose Byrne — If I Had Legs I'd Kick You",
      "Kate Hudson — Song Sung Blue",
      "Renate Reinsve — Sentimental Value",
      "Emma Stone — Bugonia",
    ],
  },
  {
    id: "best_supporting_actor",
    name: "Best Supporting Actor",
    nominees: [
      "Benicio del Toro — One Battle After Another",
      "Jacob Elordi — Frankenstein",
      "Delroy Lindo — Sinners",
      "Sean Penn — One Battle After Another",
      "Stellan Skarsgård — Sentimental Value",
    ],
  },
  {
    id: "best_supporting_actress",
    name: "Best Supporting Actress",
    nominees: [
      "Elle Fanning — Sentimental Value",
      "Inga Ibsdotter Lilleaas — Sentimental Value",
      "Amy Madigan — Weapons",
      "Wunmi Mosaku — Sinners",
      "Teyana Taylor — One Battle After Another",
    ],
  },
  {
    id: "original_screenplay",
    name: "Original Screenplay",
    nominees: [
      "Blue Moon — Robert Kaplow",
      "It Was Just an Accident — Jafar Panahi et al.",
      "Marty Supreme — Ronald Bronstein & Josh Safdie",
      "Sentimental Value — Eskil Vogt & Joachim Trier",
      "Sinners — Ryan Coogler",
    ],
  },
  {
    id: "adapted_screenplay",
    name: "Adapted Screenplay",
    nominees: [
      "Bugonia — Will Tracy",
      "Frankenstein — Guillermo del Toro",
      "Hamnet — Chloé Zhao & Maggie O'Farrell",
      "One Battle After Another — Paul Thomas Anderson",
      "Train Dreams",
    ],
  },
  {
    id: "cinematography",
    name: "Cinematography",
    nominees: [
      "Frankenstein — Dan Laustsen",
      "Marty Supreme — Darius Khondji",
      "One Battle After Another — Michael Bauman",
      "Sinners — Autumn Durald Arkapaw",
      "Train Dreams — Adolpho Veloso",
    ],
  },
  {
    id: "film_editing",
    name: "Film Editing",
    nominees: [
      "F1 — Stephen Mirrione",
      "Marty Supreme — Ronald Bronstein & Josh Safdie",
      "One Battle After Another — Andy Jurgensen",
      "Sentimental Value — Olivier Bugge Coutté",
      "Sinners — Michael P. Shawver",
    ],
  },
  {
    id: "original_score",
    name: "Original Score",
    nominees: [
      "Bugonia — Jerskin Fendrix",
      "Frankenstein — Alexandre Desplat",
      "Hamnet — Max Richter",
      "One Battle After Another — Jonny Greenwood",
      "Sinners — Ludwig Göransson",
    ],
  },
  {
    id: "original_song",
    name: "Original Song",
    nominees: [
      '"Dear Me" — Diane Warren: Relentless',
      '"Golden" — KPop Demon Hunters',
      '"I Lied To You" — Sinners',
      '"Sweet Dreams Of Joy" — Viva Verdi!',
      '"Train Dreams" — Train Dreams',
    ],
  },
  {
    id: "animated_feature",
    name: "Animated Feature Film",
    nominees: ["Arco", "Elio", "KPop Demon Hunters", "Little Amélie or the Character of Rain", "Zootopia 2"],
  },
  {
    id: "international_feature",
    name: "International Feature Film",
    nominees: [
      "The Secret Agent (Brazil)",
      "It Was Just an Accident (France)",
      "Sentimental Value (Norway)",
      "Sirāt (Spain)",
      "The Voice of Hind Rajab (Tunisia)",
    ],
  },
  {
    id: "documentary_feature",
    name: "Documentary Feature",
    nominees: [
      "The Alabama Solution",
      "Come See Me in the Good Light",
      "Cutting Through Rocks",
      "Mr. Nobody Against Putin",
      "The Perfect Neighbor",
    ],
  },
  {
    id: "costume_design",
    name: "Costume Design",
    nominees: [
      "Avatar: Fire and Ash — Deborah L. Scott",
      "Frankenstein — Kate Hawley",
      "Hamnet — Malgosia Turzanska",
      "Marty Supreme — Miyako Bellizzi",
      "Sinners — Ruth E. Carter",
    ],
  },
  {
    id: "production_design",
    name: "Production Design",
    nominees: [
      "Frankenstein",
      "Hamnet",
      "Marty Supreme",
      "One Battle After Another",
      "Sinners",
    ],
  },
  {
    id: "makeup_hairstyling",
    name: "Makeup and Hairstyling",
    nominees: [
      "Frankenstein",
      "Kokuho",
      "Sinners",
      "The Smashing of Atoms",
      "The Ugly Stepsister",
    ],
  },
  {
    id: "sound",
    name: "Sound",
    nominees: ["F1", "Frankenstein", "One Battle After Another", "Sinners", "Sirāt"],
  },
  {
    id: "visual_effects",
    name: "Visual Effects",
    nominees: [
      "Avatar: Fire and Ash",
      "F1",
      "Jurassic World Rebirth",
      "The Lost Bus",
      "Sinners",
    ],
  },
  {
    id: "casting",
    name: "Casting (New Category!)",
    nominees: [
      "Hamnet — Nina Gold",
      "Marty Supreme — Jennifer Venditti",
      "One Battle After Another — Cassandra Kulukundis",
      "The Secret Agent — Gabriel Domingues",
      "Sinners — Francine Maisler",
    ],
  },
  {
    id: "animated_short",
    name: "Animated Short Film",
    nominees: [
      "Butterfly",
      "Forevergreen",
      "The Girl Who Cried Pearls",
      "Retirement Plan",
      "The Three Sisters",
    ],
  },
  {
    id: "live_action_short",
    name: "Live Action Short Film",
    nominees: [
      "Butcher's Stain",
      "A Friend of Dorothy",
      "Jane Austen's Period Drama",
      "The Singers",
      "Two People Exchanging Saliva",
    ],
  },
  {
    id: "documentary_short",
    name: "Documentary Short Film",
    nominees: [
      "All the Empty Rooms",
      "Armed Only With a Camera: The Life and Death of Brent Renaud",
      "Children No More: 'Were and Are Gone'",
      "The Devil Is Busy",
      "Perfectly a Strangeness",
    ],
  },
];

// ============================================================
// COMPONENTS
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
          email,
          password,
          options: { data: { display_name: displayName } },
        });
        if (error) throw error;
        if (data.user) onAuth(data.user);
        else setError("Check your email to confirm your account, then log in.");
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-modal">
        <Logo />
        <div className="auth-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Sign In
          </button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
            Join
          </button>
        </div>
        {mode === "signup" && (
          <input
            className="auth-input"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        )}
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
        <p className="auth-tagline">Make your picks. Own your taste.</p>
      </div>
    </div>
  );
}

function CategoryCard({ category, userPicks, onPick, aggregates }) {
  const willWin = userPicks?.[category.id]?.will_win;
  const shouldWin = userPicks?.[category.id]?.should_win;

  return (
    <div className="category-card">
      <h3 className="category-name">{category.name}</h3>
      <div className="pick-headers">
        <span className="pick-label will-label">WILL WIN</span>
        <span className="pick-label should-label">SHOULD WIN</span>
      </div>
      <div className="nominees-list">
        {category.nominees.map((nominee) => {
          const isWillWin = willWin === nominee;
          const isShouldWin = shouldWin === nominee;
          const pct = aggregates?.[category.id]?.[nominee];

          return (
            <div key={nominee} className={`nominee-row ${isWillWin || isShouldWin ? "picked" : ""}`}>
              <div className="nominee-name">
                {nominee}
                {pct?.will_win_pct > 0 && (
                  <span className="agg-badge will-agg">{Math.round(pct.will_win_pct)}%</span>
                )}
                {pct?.should_win_pct > 0 && (
                  <span className="agg-badge should-agg">{Math.round(pct.should_win_pct)}%</span>
                )}
              </div>
              <div className="nominee-picks">
                <button
                  className={`pick-btn will-btn ${isWillWin ? "selected" : ""}`}
                  onClick={() => onPick(category.id, "will_win", isWillWin ? null : nominee)}
                  title="Will Win"
                >
                  {isWillWin ? "★" : "☆"}
                </button>
                <button
                  className={`pick-btn should-btn ${isShouldWin ? "selected" : ""}`}
                  onClick={() => onPick(category.id, "should_win", isShouldWin ? null : nominee)}
                  title="Should Win"
                >
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

function Leaderboard({ currentUserId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState({});

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    // Fetch actual winners
    const { data: winData } = await supabase.from("winners").select("*");
    const winMap = {};
    (winData || []).forEach((w) => {
      winMap[w.category_id] = { will_win: w.will_win_winner, should_win: w.should_win_winner };
    });
    setWinners(winMap);

    // Fetch all picks
    const { data: picks } = await supabase.from("picks").select("*");
    // Fetch profiles
    const { data: profiles } = await supabase.from("profiles").select("*");

    const profileMap = {};
    (profiles || []).forEach((p) => (profileMap[p.id] = p.display_name || p.email));

    // Score
    const scoreMap = {};
    (picks || []).forEach((pick) => {
      if (!scoreMap[pick.user_id]) scoreMap[pick.user_id] = { will_win: 0, should_win: 0 };
      const winner = winMap[pick.category_id];
      if (!winner) return;
      if (winner.will_win && pick.will_win === winner.will_win) scoreMap[pick.user_id].will_win++;
      if (winner.should_win && pick.should_win === winner.should_win) scoreMap[pick.user_id].should_win++;
    });

    const leaderboard = Object.entries(scoreMap)
      .map(([uid, scores]) => ({
        uid,
        name: profileMap[uid] || "Anonymous",
        will_win: scores.will_win,
        should_win: scores.should_win,
        total: scores.will_win + scores.should_win,
        isYou: uid === currentUserId,
      }))
      .sort((a, b) => b.total - a.total || b.will_win - a.will_win);

    setEntries(leaderboard);
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  const winnersAnnounced = Object.keys(winners).length > 0;

  return (
    <div className="leaderboard">
      <h2 className="section-title">Leaderboard</h2>
      {!winnersAnnounced && (
        <p className="leaderboard-note">
          Scores will populate after the ceremony on March 15. Make your picks now!
        </p>
      )}
      {entries.length === 0 && (
        <p className="leaderboard-note">No picks yet — be the first!</p>
      )}
      <div className="leaderboard-table">
        <div className="lb-header">
          <span>Rank</span>
          <span>Name</span>
          <span title="Correct Will Win picks">★ Correct</span>
          <span title="Correct Should Win picks">♥ Correct</span>
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

function Community({ currentUserId }) {
  const [allPicks, setAllPicks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAggregates();
  }, []);

  const loadAggregates = async () => {
    setLoading(true);
    const { data: picks } = await supabase.from("picks").select("*");
    const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });

    const agg = {};
    const totals = {};

    (picks || []).forEach((pick) => {
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

    // Convert to percentages
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

  if (loading) return <div className="loading">Loading community picks...</div>;

  return (
    <div className="community">
      <h2 className="section-title">Community Picks</h2>
      <div className="community-legend">
        <span className="agg-badge will-agg">★%</span> Will Win consensus &nbsp;
        <span className="agg-badge should-agg">♥%</span> Should Win consensus
      </div>
      <div className="community-grid">
        {CATEGORIES.map((cat) => {
          const catData = allPicks[cat.id];
          if (!catData) return null;
          const sorted = cat.nominees
            .map((nom) => ({ nom, ...catData[nom] }))
            .filter((n) => n.will_win_pct > 0 || n.should_win_pct > 0)
            .sort((a, b) => (b.will_win_pct || 0) - (a.will_win_pct || 0));
          if (sorted.length === 0) return null;
          return (
            <div key={cat.id} className="community-card">
              <h4>{cat.name}</h4>
              {sorted.map((item) => (
                <div key={item.nom} className="community-row">
                  <span className="community-nom">{item.nom}</span>
                  <span className="agg-badge will-agg">{item.will_win_pct ? Math.round(item.will_win_pct) + "%" : ""}</span>
                  <span className="agg-badge should-agg">{item.should_win_pct ? Math.round(item.should_win_pct) + "%" : ""}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
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
  const [view, setView] = useState("picks"); // picks | community | leaderboard
  const [savedMsg, setSavedMsg] = useState(false);

  // Auth init
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load user picks & aggregates on auth
  useEffect(() => {
    if (user) {
      loadPicks();
      loadAggregates();
    }
  }, [user]);

  const loadPicks = async () => {
    const { data } = await supabase.from("picks").select("*").eq("user_id", user.id);
    const pickMap = {};
    (data || []).forEach((row) => {
      pickMap[row.category_id] = { will_win: row.will_win, should_win: row.should_win };
    });
    setPicks(pickMap);
  };

  const loadAggregates = async () => {
    const { data: allPicks } = await supabase.from("picks").select("*");
    const agg = {};
    const totals = {};
    (allPicks || []).forEach((pick) => {
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
    const newPicks = {
      ...picks,
      [categoryId]: {
        ...picks[categoryId],
        [pickType]: value,
      },
    };
    setPicks(newPicks);

    // Upsert to DB
    setSaving(true);
    await supabase.from("picks").upsert(
      {
        user_id: user.id,
        category_id: categoryId,
        will_win: newPicks[categoryId]?.will_win || null,
        should_win: newPicks[categoryId]?.should_win || null,
      },
      { onConflict: "user_id,category_id" }
    );
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
    loadAggregates();
  };

  const totalPicked = CATEGORIES.filter((c) => picks[c.id]?.will_win || picks[c.id]?.should_win).length;
  const bothPicked = CATEGORIES.filter((c) => picks[c.id]?.will_win && picks[c.id]?.should_win).length;

  if (loading) return <div className="loading-screen"><div className="loading-inner">Loading...</div></div>;
  if (!user) return <AuthModal onAuth={setUser} />;

  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Friend";

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <Logo />
        <nav className="app-nav">
          <button className={view === "picks" ? "nav-active" : ""} onClick={() => setView("picks")}>
            My Picks
          </button>
          <button className={view === "community" ? "nav-active" : ""} onClick={() => setView("community")}>
            Community
          </button>
          <button className={view === "leaderboard" ? "nav-active" : ""} onClick={() => setView("leaderboard")}>
            Leaderboard
          </button>
        </nav>
        <div className="header-right">
          <span className="user-name">{displayName}</span>
          {saving && <span className="save-indicator">saving...</span>}
          {savedMsg && !saving && <span className="save-indicator saved">✓ saved</span>}
          <button className="signout-btn" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Progress bar */}
      {view === "picks" && (
        <div className="progress-bar-wrap">
          <div className="progress-bar-inner">
            <span className="progress-text">
              {bothPicked} of {CATEGORIES.length} complete · {totalPicked} started
            </span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(bothPicked / CATEGORIES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="app-main">
        {view === "picks" && (
          <div className="picks-grid">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                userPicks={picks}
                onPick={handlePick}
                aggregates={aggregates}
              />
            ))}
          </div>
        )}
        {view === "community" && <Community currentUserId={user.id} />}
        {view === "leaderboard" && <Leaderboard currentUserId={user.id} />}
      </main>

      <footer className="app-footer">
        98th Academy Awards · willwinshouldwin.com
      </footer>
    </div>
  );
}
