"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root-level error boundary. `layout.tsx` yoki uning provider'lari (Next-Intl,
 * Redux) render paytida xato tashlansa, [locale]/error.tsx ushlay olmaydi —
 * shu global fallback ishga tushadi. HTML tegini o'z ichida chiziydi (Next
 * shart qiladi).
 */
export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}>
          <h1 style={{ fontSize: "3.75rem", fontWeight: 700, marginBottom: "1rem" }}>500</h1>
          <p style={{ marginBottom: "2rem", color: "#4b5563", maxWidth: "28rem" }}>
            Something went wrong. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#111",
              color: "#fff",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
