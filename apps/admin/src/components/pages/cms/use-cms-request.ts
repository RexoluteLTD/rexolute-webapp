import { useEffect, useState } from "react";
import { parseAxiosError, type ApiError } from "@rexolute/api";

export function useCmsRequest<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ load: typeof load; attempt: number; data?: T; error?: ApiError }>();
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal).then(
      (data) => { if (!controller.signal.aborted) setResult({ load, attempt, data }); },
      (error) => { if (!controller.signal.aborted) setResult({ load, attempt, error: parseAxiosError(error) }); },
    );
    return () => controller.abort();
  }, [load, attempt]);

  const current = result?.load === load && result.attempt === attempt ? result : undefined;
  return { data: current?.data, error: current?.error, loading: !current, reload: () => setAttempt((value) => value + 1) };
}
