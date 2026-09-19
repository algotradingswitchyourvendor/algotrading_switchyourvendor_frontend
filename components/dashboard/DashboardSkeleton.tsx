"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Columns3, Download, RotateCw } from "lucide-react";

export function MarketSummaryBarSkeleton() {
  return (
    <div style={{ display: "flex", gap: "var(--sp-4)", alignItems: "stretch", overflowX: "auto", paddingBottom: "var(--sp-2)" }}>
      {/* 4 StatCards */}
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />

      {/* Market Breadth */}
      <div
        style={{ 
          minWidth: 260, 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-lg)",
          padding: "var(--sp-4) var(--sp-5)",
          border: "1px solid var(--border-primary)",
          boxShadow: "var(--shadow-xs)",
          flex: 1
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Market Breadth
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <div style={{ width: "100%", height: 8, borderRadius: 4, display: "flex", gap: 4 }}>
            <Skeleton className="h-full w-[45%] rounded-l-md rounded-r-none" />
            <Skeleton className="h-full w-[25%] rounded-none" />
            <Skeleton className="h-full w-[30%] rounded-r-md rounded-l-none" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div 
      style={{ 
        minWidth: 200, 
        backgroundColor: "#ffffff",
        borderRadius: "var(--radius-lg)",
        padding: "var(--sp-4) var(--sp-5)",
        border: "1px solid var(--border-primary)",
        boxShadow: "var(--shadow-xs)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Skeleton className="w-2 h-2 rounded-full flex-shrink-0" />
        <Skeleton className="h-3 w-16" />
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div style={{ display: "block", marginTop: 8 }}>
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
        <Skeleton className="w-9 h-9 rounded-md" />
      </div>
    </div>
  );
}

export function ToolbarSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "var(--sp-3)",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", flexShrink: 0 }}>
        {/* SearchBox Skeleton */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", width: 260 }}>
          <Search size={16} style={{ position: "absolute", left: 12, color: "var(--text-muted)", pointerEvents: "none" }} />
          <div className="input" style={{ width: "100%", paddingLeft: 36, display: "flex", alignItems: "center" }}>
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Skeleton className="h-3 w-20" />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", flexShrink: 0 }}>
        {/* Column Selector Button */}
        <button className="btn btn-secondary" style={{ height: 32 }} disabled>
          <Columns3 size={14} />
          <Skeleton className="h-3 w-16 ml-1" />
        </button>
        {/* CSV Download Button */}
        <button className="btn btn-secondary" style={{ height: 32 }} disabled>
          <Download size={14} /> <span>CSV</span>
        </button>
        {/* Page Size Selector */}
        <div className="select" style={{ height: 32, display: "flex", alignItems: "center", paddingRight: 24, width: 60 }} >
          <Skeleton className="h-3 w-6" />
        </div>
        {/* Refresh Button */}
        <button className="btn btn-secondary btn-icon" style={{ height: 32, width: 32 }} disabled>
          <RotateCw size={14} />
        </button>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 15 }: { rows?: number }) {
  // Simulating default columns: Instrument (200), trading_symbol (120), Open (100), High (100), Low (100), Close (100), Volume (100)
  const columns = [
    { id: "Instrument", width: 200, align: "left" },
    { id: "trading_symbol", width: 120, align: "center" },
    { id: "Open", width: 100, align: "center" },
    { id: "High", width: 100, align: "center" },
    { id: "Low", width: 100, align: "center" },
    { id: "Close", width: 100, align: "center" },
    { id: "Volume", width: 100, align: "center" },
  ];

  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
      <div className="table-container" style={{ border: "none", borderRadius: "var(--radius-lg)", overflowX: "auto" }}>
        <table className="market-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
          <thead style={{ backgroundColor: "#ffffff" }}>
            <tr>
              {columns.map((col, idx) => (
                <th key={col.id} style={{ width: col.width, textAlign: col.align as any, position: idx < 2 ? "sticky" : "relative", left: idx === 0 ? 0 : idx === 1 ? 200 : undefined, zIndex: idx < 2 ? 15 : undefined, backgroundColor: idx < 2 ? "var(--bg-secondary)" : undefined }}>
                   <div style={{ display: "flex", alignItems: "center", justifyContent: col.align === "center" ? "center" : "flex-start", gap: 4 }}>
                      <Skeleton className="h-3 w-16" />
                   </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => {
                   let skeletonWidth = "w-16";
                   if (col.id === "Instrument") skeletonWidth = "w-32";
                   if (col.id === "trading_symbol") skeletonWidth = "w-16";
                   
                   return (
                    <td 
                      key={col.id} 
                      style={{ 
                        height: 44, 
                        textAlign: col.align as any,
                        position: colIdx < 2 ? "sticky" : "relative", 
                        left: colIdx === 0 ? 0 : colIdx === 1 ? 200 : undefined, 
                        zIndex: colIdx < 2 ? 5 : undefined, 
                        backgroundColor: colIdx < 2 ? "inherit" : undefined,
                        boxShadow: colIdx === 1 ? "4px 0 8px -4px rgba(0,0,0,0.1)" : undefined
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: col.align === "center" ? "center" : "flex-start" }}>
                        <Skeleton className={`h-4 ${skeletonWidth} ${col.id === "trading_symbol" ? "rounded-sm" : ""}`} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
