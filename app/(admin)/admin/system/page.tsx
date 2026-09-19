"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants/api";
import { 
  RefreshCw, 
  LayoutGrid, 
  Box, 
  Calendar, 
  Activity, 
  Database, 
  FileText, 
  Monitor, 
  Users, 
  Bell,
  RefreshCcw,
  Trash2,
  DatabaseBackup,
  Play,
  Server,
  ChevronDown,
  Info,
  Loader2,
  TerminalSquare
} from "lucide-react";

export default function SystemHealthPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [logFilter, setLogFilter] = useState("all");
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  
  const queryClient = useQueryClient();

  // ── Queries ──────────────────────────────────────────────────────────────

  const { data: healthResp, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin_system_health"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/system/health`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load system health");
      const json = await res.json();
      return json.data;
    },
    refetchInterval: autoRefresh ? 30000 : false,
  });

  const { data: logsResp, isLoading: isLoadingLogs, refetch: refetchLogs } = useQuery({
    queryKey: ["admin_system_logs", logFilter],
    queryFn: async () => {
      let url = `${API_BASE_URL}/admin/system/logs?limit=50`;
      if (logFilter !== "all") {
        if (logFilter === "error") {
          url += `&level=error`;
        } else {
          url += `&service=${logFilter}`;
        }
      }
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load logs");
      const json = await res.json();
      return json.data.logs || [];
    },
    refetchInterval: autoRefresh ? 30000 : false,
  });

  // ── Mutations ────────────────────────────────────────────────────────────

  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/system/cache/clear`, {
        method: 'POST',
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to clear cache");
      return res.json();
    },
    onSuccess: (data) => {
      alert(`Cache cleared successfully. ${data.data?.cleared || 0} keys removed.`);
      queryClient.invalidateQueries({ queryKey: ["admin_system_health"] });
      setShowClearCacheModal(false);
    },
    onError: (err: any) => {
      alert(err.message || "Failed to clear cache");
      setShowClearCacheModal(false);
    }
  });

  const restartServiceMutation = useMutation({
    mutationFn: async (serviceName: string) => {
      const res = await fetch(`${API_BASE_URL}/admin/system/services/${serviceName}/restart`, {
        method: 'POST',
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to restart ${serviceName}`);
      return res.json();
    },
    onSuccess: () => {
      alert(`Service restarted successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin_system_health"] });
      refetchLogs();
    },
    onError: (err: any) => {
      alert(err.message || "Failed to restart service");
    }
  });


  // ── Render Helpers ───────────────────────────────────────────────────────

  if (isLoading && !healthResp) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-6 animate-pulse">
        <div className="h-20 bg-[var(--bg-secondary)] rounded-lg"></div>
        <div className="grid grid-cols-5 gap-4"><div className="h-24 bg-[var(--bg-secondary)] rounded-lg col-span-5"></div></div>
      </div>
    );
  }

  if (error && !healthResp) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Connection Unavailable</h2>
          <p>Failed to load system health. Ensure the backend is running and you have admin access.</p>
          <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-500/20 rounded hover:bg-red-500/30">Retry Connection</button>
        </div>
      </div>
    );
  }

  const isHealthy = 
    healthResp?.backend === "healthy" &&
    healthResp?.database === "connected" &&
    healthResp?.redis === "connected" &&
    healthResp?.upstox_ws === "connected";
  
  const systemStatus = isHealthy ? "Healthy" : "Degraded";
  const systemStatusDesc = isHealthy ? "All systems operational" : "One or more services offline";
  const isMarketLive = ["open", "live"].includes(healthResp?.market_status?.toLowerCase());

  const navTabs = [
    { name: 'Overview', icon: LayoutGrid },
    { name: 'Services', icon: Box },
    { name: 'Scheduler', icon: Calendar },
    { name: 'Data Pipeline', icon: Activity },
    { name: 'Storage', icon: Database },
    { name: 'Logs', icon: FileText },
    { name: 'Environment', icon: Monitor },
    { name: 'Users', icon: Users },
    { name: 'Alerts', icon: Bell },
  ];

  const getDotClass = (color: string) => {
    if (color === 'green') return 'bg-green-500';
    if (color === 'orange') return 'bg-orange-500';
    return 'bg-red-500';
  };
  const getTextClass = (color: string) => {
    if (color === 'green') return 'text-green-600';
    if (color === 'orange') return 'text-orange-500';
    return 'text-red-500';
  };

  const handleManualRefresh = () => {
    refetch();
    refetchLogs();
  };

  // Environment Info (real metrics where available)
  const env = process.env.NODE_ENV || "development";
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-accent)]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-8 pt-8 space-y-5 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] font-mono text-[var(--color-accent)] tracking-[0.2em] mb-2 font-semibold uppercase">01 / ADMIN / SYSTEM</div>
            <h1 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-2">System Health & Operations</h1>
            <p className="text-[var(--text-secondary)] text-sm">Monitor infrastructure, data pipelines, and live market systems in real time.</p>
          </div>
          <div className="text-right text-[var(--text-secondary)] text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed opacity-60 font-medium">
            <p>STABLE SYSTEMS.</p>
            <p>RELIABLE DATA.</p>
            <p>A STRONGER MARKETPULSE.</p>
          </div>
        </div>

        {/* Admin Tabs Bar */}
        <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-4 mt-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = tab.name === activeTab;
              return (
                <div 
                  key={tab.name} 
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-[var(--color-accent)]" : "text-[var(--text-secondary)] opacity-70"} />
                  {tab.name}
                </div>
              )
            })}
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleManualRefresh} className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-md text-[var(--text-secondary)] transition-colors" title="Manual Refresh">
              <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            </button>
            <div className="flex items-center gap-3 bg-white border border-[var(--border-subtle)] rounded-full px-3 py-1.5 shadow-sm">
              <span className="text-[11px] font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <RefreshCw size={12} className="opacity-70" />
                Auto Refresh
              </span>
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`w-7 h-4 rounded-full relative transition-colors ${autoRefresh ? 'bg-[var(--color-accent)]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-[2px] left-[2px] w-3 h-3 rounded-full bg-white transition-transform ${autoRefresh ? 'translate-x-3' : 'translate-x-0'}`}></span>
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white border border-[var(--border-subtle)] rounded-md px-3 py-1.5 shadow-sm">
              <span className="text-[11px] font-medium text-[var(--text-primary)]">30s</span>
              <ChevronDown size={14} className="text-[var(--text-secondary)]" />
            </div>
          </div>
        </div>

        {/* Top Health Cards Row (5 Cards) */}
        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-5 gap-4">
          
          {/* Card 1: System Status */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-lg p-4 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col justify-between h-[104px]">
            <div className="flex justify-between items-start">
              <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold">SYSTEM STATUS</div>
              <Activity size={14} className="text-[var(--text-secondary)] opacity-50" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{systemStatus}</div>
              </div>
              <div className="text-xs text-[var(--text-secondary)] truncate">{systemStatusDesc}</div>
            </div>
          </div>

          {/* Card 2: API SERVER */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-lg p-4 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col justify-between h-[104px]">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold">API SERVER (FASTAPI)</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${healthResp?.backend === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{healthResp?.backend === 'healthy' ? 'Online' : 'Offline'}</div>
              </div>
              <div className="text-[11px] font-mono text-[var(--text-secondary)] truncate">Uptime: Not available</div>
            </div>
          </div>

          {/* Card 3: PYTHON WORKER */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-lg p-4 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col justify-between h-[104px]">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold">SCHEDULER</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${healthResp?.scheduler === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{healthResp?.scheduler === 'running' ? 'Running' : 'Stopped'}</div>
              </div>
              <div className="text-[11px] font-mono text-[var(--text-secondary)] truncate">Status: Active</div>
            </div>
          </div>

          {/* Card 4: REDIS */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-lg p-4 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col justify-between h-[104px]">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold">REDIS CACHE</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${healthResp?.redis === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{healthResp?.redis === 'connected' ? 'Connected' : 'Offline'}</div>
              </div>
              <div className="text-[11px] font-mono text-[var(--text-secondary)] truncate">Namespace: mp:*</div>
            </div>
          </div>

          {/* Card 5: DATABASE */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-lg p-4 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col justify-between h-[104px]">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold">DATABASE (PG)</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${healthResp?.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{healthResp?.database === 'connected' ? 'Ready' : 'Error'}</div>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] truncate mt-1">Live schema active</div>
            </div>
          </div>

        </div>

        {/* Second Metrics Row (4 Cards) */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          
          {/* Card 1: Market Sessions */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-lg p-5 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col h-[130px]">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-4">MARKET SESSIONS</div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">NSE · BSE</div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isMarketLive ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                <div className={`text-[11px] font-bold font-mono tracking-wider ${isMarketLive ? 'text-green-600' : 'text-orange-500'}`}>
                  {healthResp?.market_status?.toUpperCase() || 'UNKNOWN'}
                </div>
              </div>
            </div>
            <div className="text-sm font-mono text-[var(--text-primary)] mb-3 opacity-90 font-medium">09:15 - 15:30 IST</div>
            <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden mt-auto">
               {isMarketLive && <div className="h-full bg-green-500 w-[50%] rounded-full"></div>}
            </div>
          </div>

          {/* Card 2: Data Pipeline */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-lg p-5 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col h-[130px]">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-3">DATA PIPELINE</div>
            <div className="mb-1 flex items-baseline gap-1">
              <span className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-none">{healthResp?.cache?.instruments?.toLocaleString() || 0}</span>
              <span className="text-[20px] font-medium text-[var(--text-secondary)]">/ {healthResp?.cache?.instruments?.toLocaleString() || 0}</span>
            </div>
            <div className="text-[13px] text-[var(--text-secondary)] mb-3 font-medium">Instruments Updated (Cache)</div>
            <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden mt-auto">
               <div className={`h-full ${healthResp?.cache?.populated ? 'bg-green-500 w-full' : 'bg-red-500 w-0'} rounded-full`}></div>
            </div>
          </div>

          {/* Card 3: Last Snapshot */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-lg p-5 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col relative h-[130px]">
            <div className="absolute top-5 right-5 text-[var(--color-accent)]/20">
              <Database size={24} />
            </div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-3">LAST SNAPSHOT</div>
            <div className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-1">#{healthResp?.cache?.snapshot_id || '—'}</div>
            <div className="text-[13px] text-[var(--text-secondary)] font-mono font-medium">
              {healthResp?.cache?.last_updated ? new Date(healthResp?.cache?.last_updated).toLocaleTimeString() : '—'}
            </div>
            <div className="text-[13px] text-[var(--text-secondary)] mt-auto font-medium">Data columns: {healthResp?.cache?.columns || 0}</div>
          </div>

          {/* Card 4: External Status */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-lg p-5 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col h-[130px]">
             <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-3">EXTERNAL CONNECTIONS</div>
             <div className="space-y-2 mt-1">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-semibold text-[var(--text-primary)] truncate pr-2">Upstox API/WS</span>
                  <span className={`text-[11px] font-mono font-bold tracking-wider shrink-0 ${healthResp?.upstox_ws === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                    {healthResp?.upstox_ws === 'connected' ? '+CONNECTED' : '-ERROR'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-semibold text-[var(--text-primary)] truncate pr-2">AWS S3 Storage</span>
                  <span className={`text-[11px] font-mono font-bold tracking-wider shrink-0 ${healthResp?.s3 === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                    {healthResp?.s3 === 'connected' ? '+CONNECTED' : '-ERROR'}
                  </span>
                </div>
             </div>
          </div>

        </div>

        {/* System Actions & Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          
          {/* Left Panel: Service Status & Actions */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[var(--border-subtle)] rounded-xl shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[var(--border-subtle)] flex justify-between items-center bg-white">
                <h3 className="font-bold text-[15px] text-[var(--text-primary)] tracking-tight">Service Status</h3>
                <span className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-sm uppercase tracking-widest ${isHealthy ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>
                  {isHealthy ? 'All Services Operational' : 'Services Degraded'}
                </span>
              </div>
              <div className="overflow-x-auto bg-white">
                <table className="w-full text-left text-[13px]">
                  <thead className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/30">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold">SERVICE</th>
                      <th className="px-6 py-3.5 font-semibold">STATUS</th>
                      <th className="px-6 py-3.5 font-semibold text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {[
                      { name: "Go API Server", id: "api", status: healthResp?.backend, icon: Server, restartable: false },
                      { name: "Scheduler", id: "scheduler", status: healthResp?.scheduler, icon: Activity, restartable: true },
                      { name: "Redis Cache", id: "redis", status: healthResp?.redis, icon: Database, restartable: false },
                      { name: "PostgreSQL", id: "postgres", status: healthResp?.database, icon: Database, restartable: false },
                    ].map(svc => {
                      const isPositive = ['healthy', 'connected', 'running'].includes(svc.status?.toLowerCase());
                      const dotColor = isPositive ? 'green' : 'red';
                      const Icon = svc.icon;
                      const isRestarting = restartServiceMutation.isPending && restartServiceMutation.variables === svc.id;
                      return (
                        <tr key={svc.name} className="hover:bg-[var(--bg-primary)]/40 transition-colors group">
                          <td className="px-6 py-4 font-semibold text-[var(--text-primary)] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                              <Icon size={14} strokeWidth={2} />
                            </div>
                            {svc.name}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getDotClass(dotColor)}`}></div>
                              <span className={`text-[12px] font-semibold tracking-wide ${getTextClass(dotColor)}`}>
                                {svc.status?.charAt(0).toUpperCase() + svc.status?.slice(1) || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {svc.restartable ? (
                              <button 
                                onClick={() => restartServiceMutation.mutate(svc.id)}
                                disabled={isRestarting}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] rounded text-[11px] font-medium text-[var(--text-secondary)] transition-colors disabled:opacity-50"
                              >
                                {isRestarting ? <Loader2 size={10} className="animate-spin" /> : <RefreshCcw size={10} />}
                                Restart
                              </button>
                            ) : (
                              <span className="text-[11px] text-[var(--text-secondary)] opacity-50">Not Supported</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Actions & Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-[var(--border-subtle)] rounded-xl p-5 shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-4">SYSTEM ACTIONS</div>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowClearCacheModal(true)}
                    className="w-full flex items-center gap-3 p-3 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] group-hover:bg-[var(--color-accent)]/10 flex items-center justify-center transition-colors">
                       <Trash2 size={14} className="text-[var(--text-secondary)] group-hover:text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-accent)]">Clear App Cache</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">Invalidate temporary keys</div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="bg-white border border-[var(--border-subtle)] rounded-xl p-5 shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest font-semibold mb-4">SYSTEM INFORMATION</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[var(--text-secondary)]">Environment</span>
                    <span className="font-medium text-[var(--text-primary)] capitalize">{env}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[var(--text-secondary)]">Version</span>
                    <span className="font-medium text-[var(--text-primary)]">{version}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[var(--text-secondary)]">Region</span>
                    <span className="font-medium text-[var(--text-primary)]">—</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[var(--text-secondary)]">Last Deploy</span>
                    <span className="font-medium text-[var(--text-primary)]">—</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: Recent Logs */}
          <div className="bg-white border border-[var(--border-subtle)] rounded-xl shadow-[0_2px_12px_rgb(0,0,0,0.03)] flex flex-col h-[550px] overflow-hidden">
             <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex justify-between items-center">
                <h3 className="font-bold text-[15px] text-[var(--text-primary)] tracking-tight">Recent Application Logs</h3>
                <TerminalSquare size={16} className="text-[var(--text-secondary)] opacity-50" />
             </div>
             
             {/* Log Filters */}
             <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/30 flex gap-1 overflow-x-auto">
               {[
                 { id: "all", label: "All" },
                 { id: "api", label: "API" },
                 { id: "worker", label: "Worker" },
                 { id: "scheduler", label: "Scheduler" },
                 { id: "error", label: "Error" },
               ].map(filter => (
                 <button
                   key={filter.id}
                   onClick={() => setLogFilter(filter.id)}
                   className={`px-3 py-1.5 rounded text-[11px] font-semibold transition-colors whitespace-nowrap ${
                     logFilter === filter.id 
                      ? 'bg-[var(--text-primary)] text-white' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                   }`}
                 >
                   {filter.label}
                 </button>
               ))}
             </div>

             {/* Log List */}
             <div className="flex-1 overflow-y-auto bg-[#fafafa] p-4 font-mono text-[11px] text-[var(--text-secondary)] space-y-2">
               {isLoadingLogs ? (
                 <div className="flex items-center justify-center h-full text-[var(--text-secondary)] opacity-50">
                    <Loader2 size={16} className="animate-spin mr-2" /> Loading logs...
                 </div>
               ) : !logsResp || logsResp.length === 0 ? (
                 <div className="flex items-center justify-center h-full text-[var(--text-secondary)] opacity-50">
                    No recent logs found.
                 </div>
               ) : (
                 logsResp.map((log: any, idx: number) => {
                   let levelColor = "text-gray-500";
                   if (log.level === "ERROR") levelColor = "text-red-500 font-bold";
                   if (log.level === "WARNING" || log.level === "WARN") levelColor = "text-orange-500 font-bold";
                   if (log.level === "INFO") levelColor = "text-blue-500";

                   return (
                     <div key={idx} className="flex gap-3 hover:bg-white p-1 rounded transition-colors break-all">
                       <span className="opacity-50 shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                       <span className={`shrink-0 w-12 ${levelColor}`}>{log.level}</span>
                       <span className="shrink-0 w-20 text-purple-600 truncate" title={log.service}>{log.service}</span>
                       <span className="text-[var(--text-primary)] whitespace-pre-wrap">{log.message}</span>
                     </div>
                   );
                 })
               )}
             </div>
          </div>

        </div>

        {/* Bottom Status Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest mt-8 pb-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={isHealthy ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>{isHealthy ? 'ALL SYSTEMS OPERATIONAL' : 'SYSTEM DEGRADED'}</span>
            </div>
            <span className="opacity-50">·</span>
            <span>LAST UPDATE {healthResp?.cache?.last_updated ? new Date(healthResp?.cache?.last_updated).toLocaleTimeString() : '—'}</span>
            <span className="opacity-50">·</span>
            <span>SNAPSHOT #{healthResp?.cache?.snapshot_id || '—'}</span>
          </div>
          <div className="opacity-70 font-semibold tracking-[0.2em]">
            MARKETPULSE · ADMIN · SYSTEM
          </div>
        </div>

        </>
        )}

        {/* Other Tabs Placeholder */}
        {activeTab !== 'Overview' && (
           <div className="mt-12 mb-20 flex flex-col items-center justify-center bg-white border border-[var(--border-subtle)] rounded-xl py-32 border-dashed shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
             <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center mb-5">
                <LayoutGrid className="text-[var(--text-secondary)] opacity-50" size={24} />
             </div>
             <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{activeTab} Module</h3>
             <p className="text-[var(--text-secondary)] text-sm max-w-md text-center">Detailed metrics and controls for {activeTab.toLowerCase()} are currently being provisioned. Please check back later or use the Overview dashboard.</p>
           </div>
        )}

      </div>

      {/* Clear Cache Modal */}
      {showClearCacheModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Clear Application Cache?</h3>
                <p className="text-sm text-gray-500 mt-1">This will invalidate temporary cache keys (mp:*). This operation is safe and will not destroy user sessions.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
              <button 
                onClick={() => setShowClearCacheModal(false)}
                disabled={clearCacheMutation.isPending}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => clearCacheMutation.mutate()}
                disabled={clearCacheMutation.isPending}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {clearCacheMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                {clearCacheMutation.isPending ? 'Clearing...' : 'Clear Cache'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
