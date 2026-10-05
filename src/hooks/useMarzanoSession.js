import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getVisualAssetUrl,
  loadLearningSession,
  saveLearningSession,
} from "../services/session";
import { useAuth } from "./useAuth";

const SESSION_VERSION = 1;

function makeDefaultData() {
  return {
    provide: { seen: [] },
    restate: { responses: {} },
    visualize: { items: {} },
    engage: { matched: [], mistakeTerms: {}, attempts: 0 },
    discuss: { response: "" },
    games: { answers: {} },
  };
}

function createDefaultState() {
  return {
    version: SESSION_VERSION,
    status: "not_started",
    currentStep: 1,
    highestUnlocked: 1,
    completedSteps: [],
    data: makeDefaultData(),
    startedAt: null,
    completedAt: null,
    updatedAt: null,
  };
}

function mergeState(candidate) {
  const base = createDefaultState();
  if (!candidate) return base;

  return {
    ...base,
    ...candidate,
    version: SESSION_VERSION,
    currentStep: Math.min(6, Math.max(1, Number(candidate.currentStep ?? 1))),
    highestUnlocked: Math.min(
      6,
      Math.max(1, Number(candidate.highestUnlocked ?? candidate.currentStep ?? 1))
    ),
    completedSteps: Array.isArray(candidate.completedSteps)
      ? candidate.completedSteps.filter((step) => Number(step) >= 1 && Number(step) <= 6)
      : [],
    data: {
      ...base.data,
      ...(candidate.data ?? {}),
      provide: { ...base.data.provide, ...(candidate.data?.provide ?? {}) },
      restate: { ...base.data.restate, ...(candidate.data?.restate ?? {}) },
      visualize: { ...base.data.visualize, ...(candidate.data?.visualize ?? {}) },
      engage: { ...base.data.engage, ...(candidate.data?.engage ?? {}) },
      discuss: { ...base.data.discuss, ...(candidate.data?.discuss ?? {}) },
      games: { ...base.data.games, ...(candidate.data?.games ?? {}) },
    },
  };
}

function newerState(a, b) {
  if (!a) return b;
  if (!b) return a;

  const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
  const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
  return bTime > aTime ? b : a;
}

async function hydrateVisualPreviews(state) {
  const items = state?.data?.visualize?.items ?? {};
  const entries = await Promise.all(
    Object.entries(items).map(async ([key, item]) => {
      if (!item?.storagePath || item.preview) return [key, item];
      const preview = await getVisualAssetUrl(item.storagePath);
      return [key, preview ? { ...item, preview } : item];
    })
  );

  return {
    ...state,
    data: {
      ...state.data,
      visualize: {
        ...state.data.visualize,
        items: Object.fromEntries(entries),
      },
    },
  };
}

export default function useMarzanoSession(chapterId) {
  const { user } = useAuth();
  const storageKey = useMemo(
    () =>
      user?.id && chapterId
        ? `marzalearn-session-v${SESSION_VERSION}:${user.id}:${chapterId}`
        : null,
    [user?.id, chapterId]
  );

  const [session, setSession] = useState(createDefaultState);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle");
  const [recovered, setRecovered] = useState(false);
  const persistTimer = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setRecovered(false);

      let local = null;
      if (storageKey) {
        try {
          const raw = window.localStorage.getItem(storageKey);
          if (raw) local = mergeState(JSON.parse(raw));
        } catch (error) {
          console.warn("MarzaLearn: local session recovery failed", error);
        }
      }

      let cloud = null;
      try {
        cloud = mergeState(await loadLearningSession(user?.id, chapterId));
      } catch (error) {
        console.warn("MarzaLearn: cloud session recovery failed", error);
      }

      if (!active) return;

      const hasCloud = cloud?.status && cloud.status !== "not_started";
      const hasLocal = local?.status && local.status !== "not_started";
      let chosen = createDefaultState();

      if (hasLocal || hasCloud) {
        chosen = newerState(hasLocal ? local : null, hasCloud ? cloud : null);
        chosen = await hydrateVisualPreviews(mergeState(chosen));
        if (!active) return;
        setRecovered(chosen.status === "in_progress");
      }

      setSession(chosen);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [chapterId, storageKey, user?.id]);

  useEffect(() => {
    if (loading || !storageKey) return;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(session));
    } catch (error) {
      console.warn("MarzaLearn: local autosave quota exceeded", error);
    }

    if (session.status === "not_started") return;

    if (persistTimer.current) clearTimeout(persistTimer.current);
    setSaveState("saving");

    // Completion is persisted immediately so leaving the result screen cannot
    // cancel the final database write. Normal answer edits remain debounced.
    if (session.status === "completed") {
      saveLearningSession(user?.id, chapterId, session).then((result) => {
        if (!mounted.current) return;
        setSaveState(result.ok ? "saved" : "local");
      });
      return;
    }

    persistTimer.current = setTimeout(async () => {
      const result = await saveLearningSession(user?.id, chapterId, session);
      if (!mounted.current) return;
      setSaveState(result.ok ? "saved" : "local");
    }, 700);
  }, [session, loading, storageKey, user?.id, chapterId]);

  const startSession = useCallback(() => {
    setSession((current) => {
      if (current.status === "completed") return current;
      if (current.status === "in_progress") return current;

      const now = new Date().toISOString();
      return {
        ...current,
        status: "in_progress",
        currentStep: 1,
        highestUnlocked: 1,
        startedAt: now,
        updatedAt: now,
      };
    });
  }, []);

  const updateStepData = useCallback((stepKey, updater) => {
    setSession((current) => {
      const currentValue = current.data[stepKey];
      const nextValue =
        typeof updater === "function" ? updater(currentValue) : updater;

      return {
        ...current,
        data: { ...current.data, [stepKey]: nextValue },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const goToStep = useCallback((stepNumber) => {
    setSession((current) => {
      const target = Math.min(6, Math.max(1, Number(stepNumber)));
      if (current.status !== "in_progress" || target > current.highestUnlocked) {
        return current;
      }
      return {
        ...current,
        currentStep: target,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const completeStep = useCallback((stepNumber) => {
    setSaveState("saving");
    setSession((current) => {
      const step = Math.min(6, Math.max(1, Number(stepNumber)));
      const completedSteps = Array.from(
        new Set([...current.completedSteps, step])
      ).sort((a, b) => a - b);
      const now = new Date().toISOString();

      if (step === 6) {
        return {
          ...current,
          status: "completed",
          currentStep: 6,
          highestUnlocked: 6,
          completedSteps,
          completedAt: now,
          updatedAt: now,
        };
      }

      const nextStep = step + 1;
      return {
        ...current,
        currentStep: nextStep,
        highestUnlocked: Math.max(current.highestUnlocked, nextStep),
        completedSteps,
        updatedAt: now,
      };
    });
  }, []);

  return {
    session,
    setSession,
    loading,
    saveState,
    recovered,
    startSession,
    updateStepData,
    goToStep,
    completeStep,
  };
}
