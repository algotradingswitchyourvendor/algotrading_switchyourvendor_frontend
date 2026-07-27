/**
 * Scanner Store — Manages scanner results and live query state.
 *
 * When a query is active and "live", the backend sends scanner_update
 * messages via WebSocket on every new LiveCache snapshot. This store
 * receives those updates and keeps the scanner results current without
 * requiring a page refresh.
 */

import { create } from "zustand";
import type { StockRecord } from "@/types/stock";
import type { ScannerCondition } from "@/types/scanner";

interface ScannerMeta {
  total: number;
  total_scanned?: number;
  matched_count?: number;
  page: number;
  page_size: number;
  total_pages: number;
  conditions_applied: number;
  truncated?: boolean;
  bullish_count?: number;
  bearish_count?: number;
}

interface ScannerState {
  // Data
  results: StockRecord[];
  meta: ScannerMeta | null;

  // Query state
  activeConditions: ScannerCondition[];
  isLive: boolean;
  hasRun: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  liveUpdateCount: number;

  // Actions
  setResults: (results: StockRecord[], meta: ScannerMeta) => void;
  updateFromWebSocket: (results: StockRecord[], meta: ScannerMeta) => void;
  setActiveConditions: (conditions: ScannerCondition[]) => void;
  setLive: (isLive: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  results: [],
  meta: null,
  activeConditions: [],
  isLive: false,
  hasRun: false,
  isLoading: false,
  error: null,
  lastUpdated: null,
  liveUpdateCount: 0,

  setResults: (results, meta) =>
    set({
      results,
      meta,
      hasRun: true,
      isLoading: false,
      error: null,
      lastUpdated: new Date(),
      liveUpdateCount: 0,
    }),

  updateFromWebSocket: (results, meta) =>
    set((state) => ({
      results,
      meta,
      lastUpdated: new Date(),
      liveUpdateCount: state.liveUpdateCount + 1,
    })),

  setActiveConditions: (conditions) =>
    set({ activeConditions: conditions }),

  setLive: (isLive) => set({ isLive }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () =>
    set({
      results: [],
      meta: null,
      activeConditions: [],
      isLive: false,
      hasRun: false,
      isLoading: false,
      error: null,
      lastUpdated: null,
      liveUpdateCount: 0,
    }),
}));
