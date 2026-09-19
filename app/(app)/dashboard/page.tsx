"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { MarketSummaryBar } from "@/components/dashboard/MarketSummaryBar";
import { DynamicTable, type DynamicTableRef } from "@/components/dashboard/DynamicTable";
import { ColumnSelector } from "@/components/dashboard/ColumnSelector";
import { SearchBox } from "@/components/dashboard/SearchBox";
import { Pagination } from "@/components/common/Pagination";
import { PageSizeSelector } from "@/components/dashboard/PageSizeSelector";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  MarketClosedBanner,
} from "@/components/common/States";
import {
  MarketSummaryBarSkeleton,
  ToolbarSkeleton,
  TableSkeleton,
} from "@/components/dashboard/DashboardSkeleton";
import { useMarketStore } from "@/stores/market";
import { useColumnStore } from "@/stores/columns";
import { useEntitlements } from "@/hooks/use-entitlements";
import { RotateCw, Download, SearchX } from "lucide-react";

export default function DashboardPage() {
  const { canAccess } = useEntitlements();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { pageSize } = useColumnStore();
  const tableRef = useRef<DynamicTableRef>(null);
  const { stocks, isLoading: storeLoading, marketStatus, error, lastUpdated } = useMarketStore();
  const loading = storeLoading;
  
  const refetch = () => {
    window.location.reload();
  };

  // Filter stocks by search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery) return stocks;
    const search = searchQuery.toLowerCase();
    return stocks.filter((s) => {
      const symbol = String(s.trading_symbol || "").toLowerCase();
      const instrument = String(s.Instrument || "").toLowerCase();
      const company = String(s.company_name || "").toLowerCase();
      return (
        symbol.includes(search) ||
        instrument.includes(search) ||
        company.includes(search)
      );
    });
  }, [stocks, searchQuery]);


  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const isClosed = !(marketStatus?.is_open ?? false);

  // Download CSV
  const handleDownloadCSV = () => {
    if (!canAccess("csv_export")) {
      alert("CSV Export requires the PRO plan. Please upgrade to use this feature.");
      window.location.href = "/settings?tab=plans&feature=csv_export&returnTo=/dashboard";
      return;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredStocks.slice(startIndex, endIndex);
    
    const dataToExport = paginatedData.length > 0 ? paginatedData : [];
    
    if (dataToExport.length === 0) return;

    const csvContent = [
      Object.keys(dataToExport[0] || {}).join(","),
      ...dataToExport.map((row) => Object.values(row).join(",")),
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `market_data_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="bg-market-grid-fine"
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100%",
        backgroundColor: "#FAFBFC",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ 
          padding: "var(--sp-12) var(--sp-8)",
          maxWidth: 1600,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-8)"
        }}
      >
        {/* Editorial Header */}
        {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div 
              style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: "var(--color-accent)", 
                letterSpacing: "0.1em",
                marginBottom: "var(--sp-3)"
              }}
            >
              01 / LIVE MARKET
            </div>
            <h1 
              style={{ 
                fontSize: 42, 
                fontWeight: 700, 
                color: "var(--text-primary)", 
                letterSpacing: "-0.03em",
                marginBottom: "var(--sp-2)",
                lineHeight: 1.1
              }}
            >
              The market, at a glance.
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 600 }}>
              Live prices, breadth and the full listed universe — updating as the session unfolds.
            </p>
          </div>
          
          <div 
            style={{ 
              textAlign: "right",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-tertiary)",
              letterSpacing: "0.1em",
              lineHeight: 1.6
            }}
          >
            REAL-TIME DATA.<br />
            REAL INSIGHTS.<br />
            A MORE FOCUSED VIEW.
          </div>
        </div> */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-6)",
          }}
        >
          {/* Market Closed Banner */}
          {isClosed && stocks.length > 0 && (
            <MarketClosedBanner />
          )}

          {/* Market Summary Cards */}
          {loading && !stocks.length ? (
            <MarketSummaryBarSkeleton />
          ) : (
            <MarketSummaryBar />
          )}

          {/* Toolbar */}
          {loading && !stocks.length ? (
            <ToolbarSkeleton />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "var(--sp-3)",
              }}
            >
              {/* Left */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--sp-3)",
                  flexShrink: 0,
                }}
              >
                <SearchBox
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="font-tabular"
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {filteredStocks.length.toLocaleString("en-IN")} stocks
                  </span>
                  {isClosed ? (
                    <span style={{ fontSize: 13, color: "var(--color-closed)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-closed)" }} />
                      Market Closed
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--color-live)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="live-dot" style={{ width: 6, height: 6 }} />
                      Live updates
                    </span>
                  )}
                </div>
              </div>

              {/* Right */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--sp-3)",
                  flexShrink: 0,
                }}
              >
                <ColumnSelector />
                <button
                  className="btn btn-secondary"
                  style={{ height: 32 }}
                  onClick={handleDownloadCSV}
                  title="Download current view as CSV"
                >
                  <Download size={14} />
                  <span>CSV</span>
                </button>
                <PageSizeSelector />
                <button
                  className="btn btn-secondary btn-icon"
                  style={{ height: 32, width: 32 }}
                  onClick={() => refetch()}
                  title="Refresh data"
                >
                  <RotateCw size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Table Header Section */}
            <div style={{ marginBottom: "var(--sp-3)" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: "0.1em" }}>
                MARKET UNIVERSE · {isClosed ? "SNAPSHOT" : "LIVE"}
              </span>
            </div>

            {/* Table + Pagination */}
            {loading && !stocks.length ? (
              <TableSkeleton />
            ) : error && !stocks.length ? (
              <ErrorState
                title={error.includes("Market data not yet available") ? "Starting Up" : "Backend Offline"}
                message={error || "Unable to connect to the data server. Attempting to reconnect..."}
                onRetry={() => refetch()}
              />
            ) : filteredStocks.length === 0 && searchQuery ? (
              <EmptyState
                icon={SearchX}
                title="No stocks found"
                message={`No results for "${searchQuery}". Try a different symbol or company name.`}
                action="Clear Search"
                onAction={() => handleSearchChange("")}
              />
            ) : (
              <>
                <div style={{ backgroundColor: "#ffffff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
                  <DynamicTable
                    ref={tableRef}
                    data={filteredStocks}
                    globalFilter=""
                    pagination={{
                      pageIndex: currentPage - 1,
                      pageSize: pageSize,
                    }}
                  />
                </div>
                <div style={{ marginTop: "var(--sp-6)", display: "flex", justifyContent: "center" }}>
                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredStocks.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={() => {}}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer / System Status */}
        <div 
          style={{ 
            marginTop: "var(--sp-12)",
            paddingTop: "var(--sp-4)", 
            borderTop: "1px solid var(--border-primary)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: isClosed ? "var(--color-closed)" : "var(--color-live)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: "0.05em" }}>
              {isClosed ? "WEBSOCKET DISCONNECTED" : "WEBSOCKET CONNECTED"}
              {lastUpdated && ` · LAST UPDATE ${new Date(lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} IST`}
            </span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: "0.05em" }}>
            NSE · BSE · EQUITIES · {isClosed ? "SNAPSHOT DATA" : "LIVE DATA"}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
