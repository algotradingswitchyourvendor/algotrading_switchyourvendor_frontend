"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { DynamicTable, type DynamicTableRef } from "@/components/dashboard/DynamicTable";
import { Pagination } from "@/components/common/Pagination";
import { PageSizeSelector } from "@/components/dashboard/PageSizeSelector";
import { ColumnSelector } from "@/components/dashboard/ColumnSelector";
import { QueryBuilder } from "@/components/scanner/QueryBuilder";
import {
  EmptyState,
  SkeletonTable,
  ErrorState,
} from "@/components/common/States";
import { useColumnLTDStore } from "@/stores/columnsLTD";
import { useScannerLTDStore } from "@/stores/scannerLTD";
import { useWebSocketStore } from "@/stores/websocket";
import { useMarketStore } from "@/stores/market";
import { fetchScannerPresets, runScanner, fetchAvailableDates, fetchMetadata } from "@/services/data";
import type {
  ScannerCondition,
  ScannerPreset,
  ScannerRequest,
} from "@/types/scanner";
import type { StockRecord } from "@/types/stock";
import {
  ScanSearch,
  Plus,
  Trash2,
  Play,
  Bookmark,
  X,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Activity,
  Download,
  Radio,
  Square,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

/* ── Operators ───────────────────────────────────────────────── */

const OPERATORS = [">", "<", ">=", "<=", "=", "!=", "between", "contains"];
const NUMERIC_OPS = [">", "<", ">=", "<=", "between"];

const PRESET_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  default: Bookmark,
  bullish: TrendingUp,
  bearish: TrendingDown,
  volume: BarChart3,
  momentum: Zap,
  institutional: Activity,
};

/* ── Condition Row ───────────────────────────────────────────── */

function ConditionRow({
  condition,
  index,
  columns,
  onChange,
  onRemove,
  isOnly,
}: {
  condition: ScannerCondition;
  index: number;
  columns: { column: string; display_name: string; type: string }[];
  onChange: (
    index: number,
    field: keyof ScannerCondition,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
  isOnly: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--sp-2)",
        flexWrap: "wrap",
      }}
    >
      {/* Logical operator */}
      {index > 0 ? (
        <select
          className="select"
          value={condition.logical}
          onChange={(e) => onChange(index, "logical", e.target.value)}
          style={{ width: 64 }}
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      ) : (
        <div style={{ width: 64, fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
          WHERE
        </div>
      )}

      {/* Column */}
      <select
        className="select"
        value={condition.column}
        onChange={(e) => onChange(index, "column", e.target.value)}
        style={{ flex: 1, height: 32 }}
      >
        <option value="">Select column...</option>
        {columns.map((col) => (
          <option key={col.column} value={col.column}>
            {col.display_name}
          </option>
        ))}
      </select>

      {/* Operator */}
      <select
        className="select"
        value={condition.operator}
        onChange={(e) => onChange(index, "operator", e.target.value)}
        style={{ width: 80 }}
      >
        {OPERATORS.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      {/* Value */}
      <input
        type="text"
        className="input"
        value={String(condition.value)}
        onChange={(e) => onChange(index, "value", e.target.value)}
        placeholder="Value"
        style={{ width: 100, height: 32 }}
      />

      {/* Remove */}
      <button
        className="btn btn-ghost btn-icon"
        onClick={() => onRemove(index)}
        disabled={isOnly}
        style={{ opacity: isOnly ? 0.3 : 1 }}
        title="Remove condition"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

/* ── Preset Card ─────────────────────────────────────────────── */

function PresetCard({
  preset,
  onSelect,
}: {
  preset: ScannerPreset;
  onSelect: (preset: ScannerPreset) => void;
}) {
  const nameLower = preset.name.toLowerCase();
  let Icon = PRESET_ICONS.default;
  if (nameLower.includes("bull")) Icon = PRESET_ICONS.bullish;
  else if (nameLower.includes("bear")) Icon = PRESET_ICONS.bearish;
  else if (nameLower.includes("volume")) Icon = PRESET_ICONS.volume;
  else if (nameLower.includes("momentum")) Icon = PRESET_ICONS.momentum;
  else if (nameLower.includes("institution")) Icon = PRESET_ICONS.institutional;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(preset)}
      className="card"
      style={{
        padding: "var(--sp-3) var(--sp-4)",
        textAlign: "left",
        cursor: "pointer",
        minWidth: 160,
        flex: "0 0 auto",
        border: "1px solid var(--border-primary)",
        transition: "all var(--transition-fast)",
        background: "none",
        fontFamily: "var(--font-sans)",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(preset);
        }
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)";
        e.currentTarget.style.backgroundColor = "var(--color-accent-light)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "var(--border-primary)";
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--sp-2)",
          marginBottom: 4,
        }}
      >
        <Icon size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {preset.name}
        </span>
      </div>
      <p
        style={{
          fontSize: 11,
          color: "var(--text-tertiary)",
          lineHeight: 1.4,
        }}
      >
        {preset.description}
      </p>
      <span
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          marginTop: 4,
          display: "block",
        }}
      >
        {preset.conditions.length} condition
        {preset.conditions.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

/* ── Active Filter Chips ─────────────────────────────────────── */

function FilterChips({
  conditions,
  onRemove,
}: {
  conditions: ScannerCondition[];
  onRemove: (index: number) => void;
}) {
  const active = conditions.filter((c) => c.column && c.value !== "");
  if (!active.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-2)" }}>
      {conditions.map((c, idx) => {
        if (!c.column || c.value === "") return null;
        return (
          <span
            key={idx}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 24,
              padding: "0 8px",
              backgroundColor: "var(--color-accent-light)",
              border: "1px solid rgba(255,107,0,0.2)",
              borderRadius: "var(--radius-xs)",
              fontSize: 11,
              fontWeight: 500,
              color: "var(--color-accent)",
            }}
          >
            {idx > 0 && (
              <span style={{ opacity: 0.6, marginRight: 2 }}>
                {c.logical}
              </span>
            )}
            {c.column} {c.operator} {String(c.value)}
            <button
              onClick={() => onRemove(idx)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={10} />
            </button>
          </span>
        );
      })}
    </div>
  );
}

/* ── Summary Cards ───────────────────────────────────────────── */

function formatNumberCompact(num: number): string {
  if (num < 1000) return num.toString();
  if (num >= 1000000) {
    return (num / 1000000).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + "M";
  }
  return (num / 1000).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + "K";
}

function ScanSummary({
  results,
  totalScanned,
  totalMatched,
  isLive,
  liveUpdateCount,
  lastUpdated,
  meta,
}: {
  results: StockRecord[];
  totalScanned: number;
  totalMatched: number;
  isLive: boolean;
  liveUpdateCount: number;
  lastUpdated: Date | null;
  meta: any;
}) {
  const bullish = meta?.bullish_count ?? results.filter(
    (s) => typeof s.day_change_pct === "number" && (s.day_change_pct as number) > 0
  ).length;
  const bearish = meta?.bearish_count ?? results.filter(
    (s) => typeof s.day_change_pct === "number" && (s.day_change_pct as number) < 0
  ).length;

  return (
    <div style={{ display: "flex", gap: "var(--sp-3)", flexWrap: "wrap" }}>
      <div className="card-compact" style={{ minWidth: 120 }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
          Scanned
        </span>
        <span className="font-tabular" style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }} title={totalScanned.toLocaleString("en-IN")}>
          {formatNumberCompact(totalScanned)}
        </span>
      </div>
      <div className="card-compact" style={{ minWidth: 120 }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
          Matched
        </span>
        <span className="font-tabular" style={{ fontSize: 18, fontWeight: 700, color: "var(--color-accent)" }} title={totalMatched.toLocaleString("en-IN")}>
          {formatNumberCompact(totalMatched)}
        </span>
      </div>
      <div className="card-compact" style={{ minWidth: 120 }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
          Bullish
        </span>
        <span className="font-tabular" style={{ fontSize: 18, fontWeight: 700, color: "var(--color-positive)" }}>
          {bullish.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="card-compact" style={{ minWidth: 120 }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
          Bearish
        </span>
        <span className="font-tabular" style={{ fontSize: 18, fontWeight: 700, color: "var(--color-negative)" }}>
          {bearish.toLocaleString("en-IN")}
        </span>
      </div>
      {isLive && (
        <div className="card-compact" style={{ minWidth: 140 }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--color-live)",
                boxShadow: "0 0 6px var(--color-live-glow)",
                animation: "pulse-live 2s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            Live Updates
          </span>
          <span className="font-tabular" style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
            {liveUpdateCount} cycles
            {lastUpdated && (
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 6 }}>
                {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────── */

const DEFAULT_CONDITION: ScannerCondition = {
  column: "",
  operator: ">",
  value: "",
  logical: "AND",
};

export default function ScannerLTDPage() {
  const { metadata, pageSize, setMetadata } = useColumnLTDStore();
  const [conditions, setConditions] = useState<ScannerCondition[]>([
    { ...DEFAULT_CONDITION },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryBuilderOpen, setQueryBuilderOpen] = useState(false);
  const [sorting, setSorting] = useState<import("@tanstack/react-table").SortingState>([{ id: "day_change_pct", desc: true }]);
  const tableRef = useRef<DynamicTableRef>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");

  const datesQuery = useQuery({
    queryKey: ["history-dates"],
    queryFn: async () => {
      const res = await fetchAvailableDates();
      return res.data || [];
    },
  });

  useEffect(() => {
    if (datesQuery.data && datesQuery.data.length > 0 && !selectedDate) {
      setSelectedDate(datesQuery.data[0]);
    }
  }, [datesQuery.data, selectedDate]);

  const metadataQuery = useQuery({
    queryKey: ["metadata", "history", selectedDate],
    queryFn: async () => {
      if (!selectedDate) return null;
      const res = await fetchMetadata("history", selectedDate);
      if (!res.success) throw new Error(res.error?.message);
      return res.data;
    },
    enabled: !!selectedDate,
  });

  useEffect(() => {
    if (metadataQuery.data) {
      setMetadata(metadataQuery.data.columns, metadataQuery.data.groups);
    }
  }, [metadataQuery.data, setMetadata]);

  // Scanner store for results and live state
  const {
    results,
    meta,
    isLive,
    hasRun,
    isLoading: scannerLoading,
    liveUpdateCount,
    lastUpdated,
    setResults,
    setActiveConditions,
    setLive,
    setLoading,
    setError,
    reset: resetScanner,
  } = useScannerLTDStore();

  const { stocks } = useMarketStore();

  // Use the store's sendMessage to send WS subscription messages
  // without creating a second WebSocket connection
  const sendMessage = (msg: any) => { };

  const handleDownloadCSV = () => {
    tableRef.current?.downloadCSV(
      `marketpulse_scan_${selectedDate || new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const filterableColumns = metadata
    .filter((m) => m.filterable)
    .map((m) => ({ column: m.column, display_name: m.display_name, type: m.type }));

  const presetsQuery = useQuery({
    queryKey: ["scanner-presets"],
    queryFn: async () => {
      const res = await fetchScannerPresets();
      return res.data || [];
    },
  });

  // Request ID ref for preventing race conditions
  const requestIdRef = useRef(0);

  const scanMutation = useMutation({
    mutationFn: async (request: ScannerRequest) => {
      const reqId = ++requestIdRef.current;
      const res = await runScanner(request);
      return { data: res.data || [], meta: (res as any).meta, reqId };
    },
    onSuccess: (result) => {
      if (result.reqId !== requestIdRef.current) return;

      const totalScanned = result.meta?.total || result.data.length;
      setResults(result.data, result.meta || {
        total: result.data.length,
        page: 1,
        page_size: result.data.length,
        total_pages: 1,
        conditions_applied: 0,
      });
      setCurrentPage(1);

      // Only historical queries on LTD page - no websocket subscription needed
      const validConditions = conditions.filter((c) => c.column && c.value !== "");
      if (validConditions.length > 0) {
        setActiveConditions(validConditions);
      }
    },
  });

  const handleConditionChange = useCallback(
    (index: number, field: keyof ScannerCondition, value: string | number) => {
      setConditions((prev) => {
        const next = [...prev];
        if (field === "value" && NUMERIC_OPS.includes(next[index].operator)) {
          const num = Number(value);
          next[index] = { ...next[index], [field]: isNaN(num) ? value : num };
        } else {
          next[index] = { ...next[index], [field]: value };
        }
        return next;
      });
    },
    []
  );

  const addCondition = () =>
    setConditions((prev) => [...prev, { ...DEFAULT_CONDITION }]);

  const removeCondition = (index: number) =>
    setConditions((prev) => prev.filter((_, i) => i !== index));

  const resetConditions = () => {
    setConditions([{ ...DEFAULT_CONDITION }]);
    resetScanner();
  };

  const stopLive = () => {
    setLive(false);
  };

  const runScan = () => {
    const valid = conditions.filter((c) => c.column && c.value !== "");
    if (!valid.length) return;
    setLoading(true);
    scanMutation.mutate({
      mode: "history", date: selectedDate,
      conditions: valid,
      sort_by: sorting[0]?.id || "day_change_pct",
      sort_order: sorting[0]?.desc ? "desc" : "asc",
      page: 1,
      page_size: 5000, // No artificial limit — return all matching records
    });
  };

  const applyPreset = (preset: ScannerPreset) => {
    setConditions(preset.conditions);
    setLoading(true);
    scanMutation.mutate({
      mode: "history", date: selectedDate,
      conditions: preset.conditions,
      sort_by: sorting[0]?.id || "day_change_pct",
      sort_order: sorting[0]?.desc ? "desc" : "asc",
      page: 1,
      page_size: 5000,
    });
  };

  // Unsubscribe on unmount - not needed for historical page
  useEffect(() => {
    return () => {};
  }, []);

  // Trigger runScan when sorting changes if it has run before
  useEffect(() => {
    if (hasRun && !isLive) {
      runScan();
    }
  }, [sorting]);

  const hasValidConditions = conditions.some(
    (c) => c.column && c.value !== ""
  );

  const totalScanned = meta?.total_scanned || meta?.total || results.length;
  const totalMatched = meta?.total || results.length;

  const queryMutation = useMutation({
    mutationFn: async (request: import("@/types/scanner").UnifiedQueryRequest) => {
      const reqId = ++requestIdRef.current;
      const { runQuery } = await import("@/services/data");
      const res = await runQuery(request);
      return { data: res.data || [], meta: (res as any).meta, reqId };
    },
    onSuccess: (result) => {
      if (result.reqId !== requestIdRef.current) return;

      setResults(result.data, result.meta || {
        total: result.data.length,
        total_scanned: result.data.length,
        page: 1,
        page_size: result.data.length,
        total_pages: 1,
        conditions_applied: 0,
      });
      setCurrentPage(1);
    },
  });

  const handleQueryBuilderExecute = useCallback(
    (queryText: string, target: "live" | "history", date?: string) => {
      queryMutation.mutate({
        query_text: queryText,
        execution_target: target,
        date: date || selectedDate,
        page: 1,
        page_size: 5000,
      });
    },
    [queryMutation, selectedDate]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <TopNavigation title="Life Till Day Scanner" />

      {/* Query Builder Modal */}
      <QueryBuilder
        isOpen={queryBuilderOpen}
        onClose={() => setQueryBuilderOpen(false)}
        onExecute={handleQueryBuilderExecute}
        hideTargetSelector={true}
        storeHook={useColumnLTDStore}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="app-content"
        style={{ padding: "var(--sp-6)" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
          {/* Presets */}
          {presetsQuery.data && presetsQuery.data.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "var(--sp-3)",
                }}
              >
                Quick Presets
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: "var(--sp-3)",
                  overflowX: "auto",
                  paddingBottom: "var(--sp-1)",
                }}
              >
                {presetsQuery.data.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                    onSelect={applyPreset}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Condition Builder */}
          <div className="card" style={{ padding: "var(--sp-5)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--sp-4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                <ScanSearch size={16} style={{ color: "var(--color-accent)" }} />
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  Build Conditions
                </h3>
                {isLive && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      height: 20,
                      padding: "0 8px",
                      backgroundColor: "rgba(0,200,83,0.1)",
                      border: "1px solid rgba(0,200,83,0.3)",
                      borderRadius: "var(--radius-xs)",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--color-live)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <Radio size={8} />
                    LIVE
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexShrink: 0 }}>
                {datesQuery.data && (
                  <select
                    className="select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ height: 26, fontSize: 12, padding: "0 8px" }}
                  >
                    <option value="" disabled>Select Date</option>
                    {datesQuery.data.map((date) => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                )}
                {isLive && (
                  <button
                    className="btn btn-ghost"
                    onClick={stopLive}
                    title="Stop live updates"
                    style={{ color: "var(--color-negative)" }}
                  >
                    <Square size={12} />
                    Stop Live
                  </button>
                )}
                <button
                  className="btn btn-ghost"
                  onClick={resetConditions}
                  title="Reset all"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={addCondition}
                >
                  <Plus size={14} />
                  Add Condition
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setQueryBuilderOpen(true)}
                  title="Open advanced query builder"
                >
                  <Sparkles size={13} />
                  Create Screener
                </button>
                <button
                  className="btn btn-primary"
                  onClick={runScan}
                  disabled={scanMutation.isPending || !hasValidConditions}
                >
                  <Play size={13} />
                  {scanMutation.isPending ? "Scanning..." : "Run Scan"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
              {conditions.map((condition, idx) => (
                <ConditionRow
                  key={idx}
                  condition={condition}
                  index={idx}
                  columns={filterableColumns}
                  onChange={handleConditionChange}
                  onRemove={removeCondition}
                  isOnly={conditions.length === 1}
                />
              ))}
            </div>
          </div>

          {/* Active filter chips */}
          <FilterChips conditions={conditions} onRemove={removeCondition} />

          {/* Results */}
          {hasRun && meta?.truncated && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--sp-2)",
                padding: "var(--sp-3)",
                backgroundColor: "rgba(255,165,0,0.1)",
                border: "1px solid rgba(255,165,0,0.3)",
                borderRadius: "var(--radius-sm)",
                color: "#d97706",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <AlertTriangle size={14} />
              Showing first 5,000 matching records. Please refine your query for more specific results.
            </div>
          )}

          {hasRun && results.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <ScanSummary
                results={results}
                totalScanned={totalScanned}
                totalMatched={totalMatched}
                isLive={isLive}
                liveUpdateCount={liveUpdateCount}
                lastUpdated={lastUpdated}
                meta={meta}
              />

              <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", flexShrink: 0 }}>
                <ColumnSelector storeHook={useColumnLTDStore} />
                <button
                  className="btn btn-secondary"
                  style={{ height: 32 }}
                  onClick={handleDownloadCSV}
                  title="Download current view as CSV"
                >
                  <Download size={14} />
                  <span>CSV</span>
                </button>
                <PageSizeSelector options={[25, 50, 100, 250, 1000]} storeHook={useColumnLTDStore} />
              </div>
            </div>
          )}

          {/* State rendering */}
          {scanMutation.isPending || queryMutation.isPending ? (
            <SkeletonTable rows={10} cols={8} />
          ) : scanMutation.isError || queryMutation.isError ? (
            <ErrorState
              title="Scan Failed"
              message="The scanner encountered an error. Please check your conditions and try again."
              onRetry={runScan}
            />
          ) : hasRun && results.length === 0 ? (
            <EmptyState
              icon={ScanSearch}
              title="No stocks matched"
              message="Try adjusting your filters or selecting a different preset."
            />
          ) : results.length > 0 ? (
            <>
              <DynamicTable
                ref={tableRef}
                data={results}
                globalFilter=""
                pagination={{
                  pageIndex: currentPage - 1,
                  pageSize: pageSize,
                }}
                sorting={sorting}
                onSortingChange={setSorting}
                manualSorting={true}
                storeHook={useColumnLTDStore}
              />
              <Pagination
                currentPage={currentPage}
                totalItems={totalMatched}
                maxItems={5000}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={() => { }}
              />
            </>
          ) : hasRun ? (
            <EmptyState
              icon={ScanSearch}
              title="No stocks matched"
              message="No stocks currently satisfy the selected conditions. Try adjusting your filters."
              action="Reset Conditions"
              onAction={resetConditions}
            />
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
