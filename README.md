# MarketPulse Frontend 📈

MarketPulse is a cutting-edge, real-time Indian equity market analytics platform. Built for performance and precision, it features institutional-grade data visualization, live dynamic screening, custom query parsing, and an intuitive dashboard—delivering powerful market intelligence directly to your browser.

---

## ✨ Key Features

- **Live Market Dashboard**: Real-time monitoring of indices, stock movements, and market atmosphere.
- **Advanced Dynamic Scanners (Standard & LTD)**: Filter stocks dynamically using a custom-built query language (e.g., `RSI > 70 AND MACD > Signal`).
- **Comprehensive Stock Analytics**: In-depth individual stock pages (`/stock/[symbol]`) featuring historical timelines, indicators, and live quotes.
- **Dynamic Data Tables**: Fully customizable, drag-and-drop sortable, and resizable data columns leveraging `@dnd-kit` and `@tanstack/react-table`.
- **Live WebSocket Integration**: Seamless, low-latency real-time ticks and market updates.
- **Admin Control Panel**: Dedicated administrative interface for managing users, subscriptions, payments, and system audit logs.
- **Sleek Marketing & Legal Pages**: High-conversion landing pages and structured public legal documentation (Privacy, Terms).
- **Modern UI/UX**: Built entirely on Next.js 16 (App Router), React 19, Tailwind CSS v4, and beautifully animated using Framer Motion (`motion/react`).

---

## 🛠️ Technology Stack

### Core Frameworks
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Motion / Framer Motion](https://motion.dev/)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/)

### State Management & Data Fetching
- **Client State**: [Zustand](https://zustand-demo.pmnd.rs/) (Modular stores for auth, market data, theme, and websockets)
- **Server State & Caching**: [TanStack React Query](https://tanstack.com/query/latest)

### Complex UI Utilities
- **Data Grids**: [TanStack React Table](https://tanstack.com/table/latest) & [TanStack Virtual](https://tanstack.com/virtual/latest)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Architecture & Folder Structure

The project strictly follows the Next.js App Router paradigm, neatly separating marketing content from authenticated application logic and administrative tools.

```text
frontend/
├── app/                        # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (admin)/                # Secure admin portal (users, subscriptions, payments)
│   ├── (app)/                  # Main authenticated application (dashboard, scanner, history, settings)
│   ├── (marketing)/            # Public landing page
│   ├── auth/                   # Authentication flows (sign-in, OAuth callbacks)
│   ├── privacy/ & terms/       # Public legal and compliance pages
│   └── contact-support/        # Customer support portal
├── components/                 # Reusable React UI Components
│   ├── admin/                  # Admin-specific layouts and charts
│   ├── common/ & ui/           # Shared generic UI (buttons, dialogs, inputs)
│   ├── dashboard/              # Market overview widgets
│   ├── landing/                # Landing page sections (hero, features, pricing)
│   ├── scanner/                # Complex query builders and data grids
│   └── legal/                  # Shared layouts for public legal documents
├── lib/                        # Core application logic and parsers
│   └── query-engine/           # Custom lexer/parser for the MarketPulse scanner query language
├── stores/                     # Zustand state modules (market.ts, websocket.ts, auth.ts, scanner.ts)
├── config/                     # Application configuration constants
├── hooks/                      # Custom React hooks (e.g., useWebSocket)
└── types/                      # Global TypeScript definitions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/algotradingswitchyourvendor/algotrading_switchyourvendor_frontend.git
cd algotrading_switchyourvendor_frontend/marketpulse-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the `.env.example` file to `.env` (or `.env.local`) and populate it:
```bash
cp .env.example .env
```
*(Ensure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` correctly point to your backend instances).*

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## ⚙️ Environment Variables

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API (e.g., `http://localhost:8000/api/v1`). |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL for live data streaming (e.g., `ws://localhost:8000/api/v1/ws`). |

*(Note: In development, Next.js rewrites may be configured via `next.config.ts` to bypass CORS issues).*

---

## 🧠 Advanced Subsystems

### The Query Engine (`lib/query-engine`)
MarketPulse features a bespoke, lightweight expression parser designed to interpret user-defined scanning strategies. It tokenizes, parses, and validates expressions (e.g., technical indicator comparisons) to construct complex scanner API requests, complete with caret position detection for intelligent autocomplete.

### Real-Time Pipeline (`stores/websocket.ts`)
A resilient, reconnecting WebSocket client managed via Zustand. It seamlessly distributes live tick data into the global `market.ts` store, causing hyper-efficient React re-renders only on localized components observing specific symbols.

### Dynamic Columns (`stores/columns.ts`)
User preferences for data tables (visible columns, ordering, widths) are persisted and handled through Zustand + `@dnd-kit`, allowing traders to craft their perfect analytical view and retain it across sessions.

---

## ⚡ Performance Optimizations

- **React Server Components (RSC)**: Public pages (`/privacy`, `/terms`, `/`) are heavily optimized as Server Components to ship zero unnecessary client-side JavaScript.
- **DOM Virtualization**: The advanced scanner tables utilize `@tanstack/react-virtual` to render thousands of stock rows smoothly without layout thrashing.
- **Client-Side Caching**: `@tanstack/react-query` prevents redundant fetching for historical data, deeply integrating with the App Router lifecycle.
- **Throttled Subscriptions**: High-frequency WebSocket ticks are effectively throttled to match the browser's display refresh rate, preventing main-thread blocking.

---

## 📄 License & Legal

For detailed operational terms and privacy commitments, please review our official documentation:
- [Privacy Policy](/privacy)
- [Terms of Service](/terms)

*(Ensure that appropriate placeholder emails/contacts in these documents are updated before commercial deployment).*

---

## 👷 Contributing

1. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
2. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
3. Push to the Branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request ensuring the linting (`npm run lint`) passes.
