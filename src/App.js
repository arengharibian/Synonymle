import React, { useEffect, useState } from "react";
import "./App.css";

const MAX_GUESSES = 6;

// Expanded semantic word bank for Synonymle
const WORD_BANK = [
  {
    target: "OBSTINATE",
    hint: "Stubbornly refusing to change one’s opinion.",
    synonyms: ["STUBBORN", "HEADSTRONG", "INTRACTABLE", "PIGHEADED"],
    near: ["DETERMINED", "RESOLUTE", "UNYIELDING"],
    mid: ["FIRM", "STRICT", "STEADFAST"],
    opp: ["FLEXIBLE", "YIELDING", "ACCOMMODATING"]
  },
  {
    target: "LAMENT",
    hint: "To passionately express grief or sorrow.",
    synonyms: ["MOURN", "GRIEVE", "BEWAIL"],
    near: ["REGRET", "WEEP", "SORROW"],
    mid: ["COMPLAIN", "BEMOAN"],
    opp: ["REJOICE", "CELEBRATE", "PRAISE"]
  },
  {
    target: "EPHEMERAL",
    hint: "Lasting for a very short time.",
    synonyms: ["FLEETING", "TRANSIENT", "MOMENTARY"],
    near: ["SHORTLIVED", "PASSING", "BRIEF"],
    mid: ["TEMPORARY", "FLICKERING"],
    opp: ["ENDURING", "PERMANENT", "LASTING"]
  },
  {
    target: "ASTUTE",
    hint: "Having or showing sharp judgment.",
    synonyms: ["SHREWD", "PERCEPTIVE", "CLEVER"],
    near: ["INSIGHTFUL", "WISE", "SMART"],
    mid: ["AWARE", "ALERT"],
    opp: ["FOOLISH", "SLOW", "OBTUSE"]
  },
  {
    target: "ENIGMATIC",
    hint: "Difficult to understand; mysterious.",
    synonyms: ["MYSTERIOUS", "PUZZLING", "OBSCURE"],
    near: ["AMBIGUOUS", "CRYPTIC", "UNCLEAR"],
    mid: ["VAGUE", "SHADOWY"],
    opp: ["OBVIOUS", "CLEAR", "STRAIGHTFORWARD"]
  },
  {
    target: "MALICIOUS",
    hint: "Intended to cause harm.",
    synonyms: ["SPITEFUL", "MALEVOLENT", "VINDICTIVE"],
    near: ["CRUEL", "HOSTILE", "HATEFUL"],
    mid: ["MEAN", "HARSH"],
    opp: ["KIND", "BENIGN", "GENEROUS"]
  },
  {
    target: "SERENDIPITY",
    hint: "Finding something valuable by chance.",
    synonyms: ["LUCK", "FORTUNE", "FLUKE"],
    near: ["ACCIDENT", "COINCIDENCE"],
    mid: ["DISCOVERY", "SURPRISE"],
    opp: ["MISFORTUNE", "DISASTER"]
  },
  {
    target: "METICULOUS",
    hint: "Showing great attention to detail.",
    synonyms: ["PRECISE", "THOROUGH", "FASTIDIOUS"],
    near: ["CAREFUL", "DILIGENT"],
    mid: ["ORDERLY", "NEAT"],
    opp: ["CARELESS", "SLOPPY", "NEGLIGENT"]
  },
  {
    target: "AMBIVALENT",
    hint: "Having mixed feelings about something.",
    synonyms: ["UNCERTAIN", "TORN", "CONFLICTED"],
    near: ["UNDECIDED", "HESITANT"],
    mid: ["MIXED", "UNSURE"],
    opp: ["CERTAIN", "DECISIVE", "CLEAR"]
  },
  {
    target: "OSTENTATIOUS",
    hint: "Designed to attract notice; showy.",
    synonyms: ["FLASHY", "GAUDY", "FLAMBOYANT"],
    near: ["BOLD", "LAVISH", "LUXURIOUS"],
    mid: ["SHOWY", "ORNATE"],
    opp: ["MODEST", "SUBTLE", "UNASSUMING"]
  },
  {
    target: "BENEVOLENT",
    hint: "Well-meaning and kindly.",
    synonyms: ["KIND", "COMPASSIONATE", "GENEROUS"],
    near: ["GOODHEARTED", "CHARITABLE"],
    mid: ["POLITE", "FRIENDLY"],
    opp: ["MALICIOUS", "CRUEL", "HARSH"]
  },
  {
    target: "CANDOR",
    hint: "The quality of being open and honest.",
    synonyms: ["HONESTY", "FRANKNESS", "TRUTHFULNESS"],
    near: ["DIRECTNESS", "OPENNESS"],
    mid: ["SINCERITY"],
    opp: ["DECEIT", "DISHONESTY", "EVASION"]
  },
  {
    target: "PRUDENT",
    hint: "Acting with care and thought for the future.",
    synonyms: ["WISE", "SENSIBLE", "CAUTIOUS"],
    near: ["THOUGHTFUL", "CAREFUL"],
    mid: ["REASONABLE", "LOGICAL"],
    opp: ["RECKLESS", "CARELESS", "IMPULSIVE"]
  },
  {
    target: "RESILIENT",
    hint: "Able to recover quickly from difficulties.",
    synonyms: ["TOUGH", "STRONG", "HARDY"],
    near: ["ADAPTABLE", "ENDURING"],
    mid: ["STEADY", "BALANCED"],
    opp: ["FRAGILE", "WEAK", "VULNERABLE"]
  },
  {
    target: "ELUSIVE",
    hint: "Hard to find, catch, or achieve.",
    synonyms: ["SLIPPERY", "SUBTLE", "EVASIVE"],
    near: ["DIFFICULT", "UNCERTAIN"],
    mid: ["VAGUE"],
    opp: ["OBVIOUS", "CLEAR", "CERTAIN"]
  },
  {
    target: "TEDIOUS",
    hint: "Too long, slow, or dull.",
    synonyms: ["BORING", "MUNDANE", "DULL"],
    near: ["REPETITIVE", "UNINTERESTING"],
    mid: ["SLOW"],
    opp: ["EXCITING", "ENGAGING", "FUN"]
  },
  {
    target: "VIGILANT",
    hint: "Keeping careful watch for danger.",
    synonyms: ["WATCHFUL", "ALERT", "ATTENTIVE"],
    near: ["OBSERVANT", "AWARE"],
    mid: ["CAREFUL"],
    opp: ["OBLIVIOUS", "UNAWARE", "NEGLIGENT"]
  },
  {
    target: "NEBULOUS",
    hint: "Unclear, vague, or ill-defined.",
    synonyms: ["VAGUE", "INDISTINCT", "HAZY"],
    near: ["UNCLEAR", "FUZZY"],
    mid: ["BROAD", "GENERAL"],
    opp: ["CLEAR", "DETAILED", "PRECISE"]
  },
  {
    target: "RUINOUS",
    hint: "Disastrous or destructive.",
    synonyms: ["DEVASTATING", "DESTRUCTIVE", "CATASTROPHIC"],
    near: ["DAMAGING", "HARMFUL"],
    mid: ["BAD", "COSTLY"],
    opp: ["HARMLESS", "SAFE", "BENIGN"]
  },
  {
    target: "ARBITRARY",
    hint: "Based on random choice rather than reason.",
    synonyms: ["RANDOM", "CAPRICIOUS", "ERRATIC"],
    near: ["UNPREDICTABLE", "VARIED"],
    mid: ["ODD", "UNDECIDED"],
    opp: ["LOGICAL", "REASONED", "SYSTEMATIC"]
  }
];

// Simple deterministic pseudo-random so scores feel less rigid but are repeatable
function pseudoRandomFromWord(word) {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = (hash * 31 + word.charCodeAt(i)) & 0xffffffff;
  }
  return (hash >>> 0) / 0xffffffff; // 0–1
}

function pickRandomWord() {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
}

function scoreGuess(guess, word) {
  const g = guess.trim().toUpperCase();
  if (!g) {
    return { score: 0, band: "invalid" };
  }

  const { target, synonyms = [], near = [], mid = [], opp = [] } = word;

  if (g === target || synonyms.includes(g)) {
    return { score: 100, band: "correct" };
  }

  if (near.includes(g)) {
    const base = 80;
    const jitter = Math.floor(pseudoRandomFromWord(g) * 10); // 0–9
    return { score: base + jitter, band: "hot" }; // ~80–89
  }

  if (mid.includes(g)) {
    const base = 55;
    const jitter = Math.floor(pseudoRandomFromWord(g) * 15); // 0–14
    return { score: base + jitter, band: "warm" }; // ~55–69
  }

  if (opp.includes(g)) {
    const base = 5;
    const jitter = Math.floor(pseudoRandomFromWord(g) * 15); // 0–14
    return { score: base + jitter, band: "cold" }; // ~5–19
  }

  // Unknown word: neutral-ish
  const base = 30;
  const jitter = Math.floor(pseudoRandomFromWord(g) * 20); // 0–19
  return { score: base + jitter, band: "cool" }; // ~30–49
}

function bandLabel(band) {
  switch (band) {
    case "correct":
      return "Perfect match";
    case "hot":
      return "Very close";
    case "warm":
      return "Getting warmer";
    case "cool":
      return "Somewhat related";
    case "cold":
      return "Opposite / far";
    default:
      return "";
  }
}

function bandClass(band) {
  switch (band) {
    case "correct":
      return "score-badge score-correct";
    case "hot":
      return "score-badge score-hot";
    case "warm":
      return "score-badge score-warm";
    case "cool":
      return "score-badge score-cool";
    case "cold":
      return "score-badge score-cold";
    default:
      return "score-badge";
  }
}

export default function App() {
  const [word, setWord] = useState(null);
  const [guesses, setGuesses] = useState([]); // { text, score, band }
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(MAX_GUESSES);
  const [status, setStatus] = useState({ text: "", type: "info" });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  function startNewGame() {
    const w = pickRandomWord();
    setWord(w);
    setGuesses([]);
    setRemaining(MAX_GUESSES);
    setGameOver(false);
    setInput("");
    setStatus({
      text:
        "Welcome to Synonymle. Guess words that fit the clue and climb the score toward 100.",
      type: "info"
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!word || gameOver) return;

    const guessText = input.trim();
    if (!guessText) return;

    const { score, band } = scoreGuess(guessText, word);
    if (band === "invalid") return;

    const newGuess = { text: guessText.toUpperCase(), score, band };
    const newGuesses = [...guesses, newGuess];

    setGuesses(newGuesses);
    setInput("");

    if (band === "correct") {
      setStatus({
        text: `You hit 100! You found the secret word "${word.target}".`,
        type: "win"
      });
      setGameOver(true);
      return;
    }

    const newRemaining = remaining - 1;
    setRemaining(newRemaining);

    if (newRemaining <= 0) {
      setStatus({
        text: `Out of guesses. The secret word was "${word.target}". Try a new round of Synonymle!`,
        type: "lose"
      });
      setGameOver(true);
      return;
    }

    setStatus({
      text: `${bandLabel(band)} — your score is ${score}. Try to go higher!`,
      type: "info"
    });
  }

  function statusClass() {
    if (status.type === "win") return "status status-win";
    if (status.type === "lose") return "status status-lose";
    return "status status-info";
  }

  if (!word) {
    return (
      <div className="app">
        <h1 className="title">Synonymle</h1>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="title">Synonymle</h1>

      <div className="hint-box">
        <div className="hint-title">Clue</div>
        <div className="hint-text">{word.hint}</div>
        <div className="hint-meta">
          Secret word length: <strong>{word.target.length}</strong> letters
        </div>
        <div className="hint-meta">
          Goal: reach <strong>100</strong> by getting closer in meaning.
        </div>
      </div>

      <div className="board">
        {guesses.map((g, idx) => (
          <div className="row" key={idx}>
            <div className="tiles">
              {g.text.split("").map((ch, i) => (
                <div className="tile" key={i}>
                  {ch}
                </div>
              ))}
            </div>
            <div className={bandClass(g.band)}>
              <div className="score-number">{g.score}</div>
              <div className="score-label">{bandLabel(g.band)}</div>
            </div>
          </div>
        ))}

        {Array.from({ length: MAX_GUESSES - guesses.length }).map((_, i) => (
          <div className="row row-empty" key={`empty-${i}`}>
            <div className="tiles">
              <div className="tile tile-empty" />
              <div className="tile tile-empty" />
              <div className="tile tile-empty" />
              <div className="tile tile-empty" />
              <div className="tile tile-empty" />
            </div>
            <div className="score-badge score-empty" />
          </div>
        ))}
      </div>

      <form className="guess-form" onSubmit={handleSubmit}>
        <input
          className="guess-input"
          type="text"
          placeholder={
            gameOver
              ? "Game over – start a new word"
              : "Type a word that fits the clue"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={gameOver}
        />
        <button className="guess-button" type="submit" disabled={gameOver}>
          Guess
        </button>
      </form>

      <div className={statusClass()}>{status.text}</div>
      <div className="remaining">
        {remaining} guess{remaining === 1 ? "" : "es"} remaining
      </div>

      <button className="new-game" onClick={startNewGame}>
        New Secret Word
      </button>
    </div>
  );
}
