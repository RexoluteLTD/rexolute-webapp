import { useEffect, useState } from "react";
import { parseAxiosError, type ApiError } from "@rexolute/api";

export function useBlogRequest<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ load: typeof load; attempt: number; data?: T; error?: ApiError }>();
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal).then(
      (data) => { if (!controller.signal.aborted) setResult({ load, attempt, data }); },
      (error) => { if (!controller.signal.aborted) setResult({ load, attempt, error: parseAxiosError(error) }); },
    );
    const refresh = (event: PageTransitionEvent) => { if (event.persisted) setAttempt((value) => value + 1); };
    window.addEventListener("pageshow", refresh);
    return () => {
      controller.abort();
      window.removeEventListener("pageshow", refresh);
    };
  }, [load, attempt]);

  const current = result?.load === load && result.attempt === attempt ? result : undefined;
  return { data: current?.data, error: current?.error, loading: !current, retry: () => setAttempt((value) => value + 1) };
}
