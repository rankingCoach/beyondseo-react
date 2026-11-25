import { useSyncExternalStore } from "react";

type Trigger = () => void;

// The provider lives in the meta-box root while the buttons render in other roots; this bus connects them.
let activeTrigger: Trigger | null = null;
// True from a trigger call until the provider has dispatched (or dropped) the analysis request.
let scheduled = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const registerScoreRecalculationTrigger = (trigger: Trigger): (() => void) => {
  activeTrigger = trigger;
  notify();
  return () => {
    if (activeTrigger !== trigger) return;
    activeTrigger = null;
    notify();
  };
};

export const requestScoreRecalculation = (): boolean => {
  if (!activeTrigger) return false;
  activeTrigger();
  return true;
};

export const setScoreRecalculationScheduled = (value: boolean): void => {
  if (scheduled === value) return;
  scheduled = value;
  notify();
};

export const useScoreRecalculationAvailable = (): boolean =>
  useSyncExternalStore(subscribe, () => activeTrigger !== null);

export const useScoreRecalculationScheduled = (): boolean => useSyncExternalStore(subscribe, () => scheduled);
