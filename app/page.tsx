"use client";

import { useState } from "react";
import styles from "./page.module.css";

type CalmResponse = {
  inYourControl: string;
  reframe: string;
  nextSteps: string[];
};

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalmResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/calm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Something went wrong. Try again.",
        );
        return;
      }

      if (
        data &&
        typeof data.inYourControl === "string" &&
        typeof data.reframe === "string" &&
        Array.isArray(data.nextSteps)
      ) {
        setResult({
          inYourControl: data.inYourControl,
          reframe: data.reframe,
          nextSteps: data.nextSteps.filter(
            (s: unknown) => typeof s === "string",
          ),
        });
      } else {
        setError("Unexpected response. Try again.");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Exhale</h1>
        <p className={styles.tagline}>
          Say what is on your mind. You will get clarity—not generic therapy
          talk.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="stress">
          What is stressing you?
        </label>
        <textarea
          id="stress"
          className={styles.textarea}
          placeholder="A decision, a message you are waiting on, a spiral—anything."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.button}
            disabled={loading || !input.trim()}
          >
            {loading ? "Thinking…" : "Get clarity"}
          </button>
          <span className={styles.hint}>Takes a few seconds.</span>
        </div>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {loading && (
        <div className={styles.loading}>
          <span className={styles.spinner} aria-hidden />
          <span>Sorting what you can control from what you cannot…</span>
        </div>
      )}

      {result && !loading && (
        <article className={styles.result}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>In your control</h2>
            <p className={styles.sectionBody}>{result.inYourControl}</p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Reframe</h2>
            <p className={styles.sectionBody}>{result.reframe}</p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Next steps</h2>
            <ol className={styles.stepsList}>
              {result.nextSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        </article>
      )}

      <footer className={styles.footer}>
        Exhale is not therapy or medical advice. If you are in crisis, reach
        out to local emergency services or a crisis line.
      </footer>
    </main>
  );
}
