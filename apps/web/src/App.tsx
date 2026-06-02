import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL ?? "";

type Health = { ok: boolean; dbConfigured: boolean };

export function App(): React.ReactElement {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiUrl) {
      setError("VITE_API_URL is not set");
      return;
    }

    const url = `${apiUrl.replace(/\/+$/, "")}/health`;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as Health;
      })
      .then(setHealth)
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : String(e));
      });
  }, []);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 480 }}>
      <h1>ShipFix E2E Demo</h1>
      <p>
        API base: <code>{apiUrl || "(not set at build time)"}</code>
      </p>
      {health && (
        <p style={{ color: "#166534" }}>
          Backend reachable — health ok={String(health.ok)}, dbConfigured={String(health.dbConfigured)}
        </p>
      )}
      {error && <p style={{ color: "#b91c1c" }}>Backend check failed: {error}</p>}
    </main>
  );
}
