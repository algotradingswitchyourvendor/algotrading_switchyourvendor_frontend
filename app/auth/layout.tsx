import Navbar from "@/components/landing/Navbar";
import { BarChart2, LineChart, Shield, Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex w-full max-w-[1440px] mx-auto pt-14 pb-4">
        
        {/* Left Side: Marketing Hero */}
        <div className="hidden lg:flex flex-col justify-center w-[55%] px-12 xl:px-24 relative overflow-hidden h-[calc(100vh-100px)]">
          
          <div className="relative z-10 max-w-lg">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
              <span className="text-[12px] font-medium tracking-wide text-gray-700">
                Smarter Trading. Clearer Insights.
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[44px] xl:text-[56px] leading-[1.15] font-extrabold tracking-tight text-[#111827] mb-4">
              Track Markets.<br />
              Find Opportunities.<br />
              <span className="text-[#FF6B00]">Trade Smarter.</span>
            </h1>

            {/* Description */}
            <p className="text-[17px] text-[#64748b] leading-relaxed mb-8 max-w-[420px]">
              Real-time market data, intelligent scanners and powerful analytics — all in one place.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#fff3e6] flex items-center justify-center shrink-0">
                  <BarChart2 size={20} className="text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#111827]">Real-time Market Data</h3>
                  <p className="text-[14px] text-[#64748b] mt-0.5">Stay ahead with live market insights</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center shrink-0">
                  <Zap size={20} className="text-[#3b82f6]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#111827]">Advanced Stock Scanner</h3>
                  <p className="text-[14px] text-[#64748b] mt-0.5">Find high-potential opportunities</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center shrink-0">
                  <LineChart size={20} className="text-[#22c55e]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#111827]">In-depth Analytics</h3>
                  <p className="text-[14px] text-[#64748b] mt-0.5">Make data-driven decisions</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-8 pt-6 border-t border-gray-200/60 max-w-[420px]">
              <div className="flex gap-2">
                <span className="text-4xl text-gray-300 font-serif leading-none shrink-0">"</span>
                <div>
                  <p className="text-[14px] italic text-[#64748b] leading-relaxed mb-3">
                    MarketPulse has completely changed how I analyze the market. 
                    The scanners and real-time data are game changers.
                  </p>
                  <p className="text-[13px] font-medium text-[#94a3b8]">
                    — Active Trader
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Faint Decorative Chart Elements */}
          <div className="absolute bottom-0 right-0 left-0 h-[300px] pointer-events-none opacity-40 z-0">
            <svg viewBox="0 0 800 300" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="chart-fade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 250 Q 50 200 100 220 T 200 180 T 300 240 T 400 150 T 500 190 T 600 100 T 700 160 T 800 80 L 800 300 L 0 300 Z"
                fill="url(#chart-fade)"
              />
              <path
                d="M0 250 Q 50 200 100 220 T 200 180 T 300 240 T 400 150 T 500 190 T 600 100 T 700 160 T 800 80"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
            </svg>
          </div>

          {/* Floating Ticker Cards (Decorative) */}
          <div className="absolute right-[5%] bottom-[20%] bg-white/80 backdrop-blur border border-white shadow-sm rounded-lg p-3 z-0">
             <div className="text-[10px] font-bold text-gray-500 mb-1">NIFTY 50</div>
             <div className="flex gap-2 items-baseline">
                <span className="text-[14px] font-semibold text-gray-900 font-mono">24,813.45</span>
                <span className="text-[11px] font-bold text-green-600">+1.23% ▲</span>
             </div>
          </div>
          
          <div className="absolute right-[25%] bottom-[35%] bg-white/80 backdrop-blur border border-white shadow-sm rounded-lg p-3 z-0">
             <div className="text-[10px] font-bold text-gray-500 mb-1">BANKNIFTY</div>
             <div className="flex gap-2 items-baseline">
                <span className="text-[14px] font-semibold text-gray-900 font-mono">51,245.60</span>
                <span className="text-[11px] font-bold text-green-600">+0.92% ▲</span>
             </div>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="flex-1 lg:w-[45%] flex flex-col items-center justify-center p-6 md:p-12 relative z-10 lg:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDEwaDQwdjFINHoiIGZpbGw9InJnYmEoMzMsIDM3LCA0MSwgMC4wMSkiLz4KPHBhdGggZD0iTTEwIDB2NDBoLTFWMHoiIGZpbGw9InJnYmEoMzMsIDM3LCA0MSwgMC4wMSkiLz4KPC9zdmc+')] bg-cover">
          {children}
        </div>
      </div>
    </div>
  );
}
