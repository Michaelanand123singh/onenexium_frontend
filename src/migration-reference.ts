/**
 * OneNexium — Architecture & Feature Reference
 *
 * Purpose: Living document maintained with every feature change.
 * Captures the full app architecture, features, data model, routing, components,
 * and implementation patterns to assist with any future platform migration (e.g. Next.js).
 *
 * Last updated: 2026-04-07 — v157
 */

// ============================================================================
// 1. TECH STACK
// ============================================================================
//
// | Layer        | Current (Hercules)                     | Next.js Equivalent               |
// | ------------ | -------------------------------------- | -------------------------------- |
// | Framework    | Vite 7 + React 19                      | Next.js 15 (App Router)         |
// | Language     | TypeScript 5.9 (strict)                | TypeScript 5.x (strict)         |
// | Styling      | Tailwind CSS 4                         | Tailwind CSS 4                   |
// | UI Library   | shadcn/ui + Radix UI                   | shadcn/ui + Radix UI (same)      |
// | Routing      | react-router-dom v7 (declarative)      | Next.js App Router (file-based)  |
// | Backend      | Convex (serverless functions)          | Next.js API Routes / Server Actions + DB |
// | Database     | Convex (document-relational)           | PostgreSQL / Prisma / Drizzle    |
// | Auth         | Hercules Auth (OIDC)                   | NextAuth.js / Clerk / Auth.js    |
// | State        | Convex reactive queries (WebSocket)    | React Query / SWR + REST/tRPC    |
// | Animations   | motion (Framer Motion) v12             | motion (same)                    |
// | Icons        | lucide-react                           | lucide-react (same)              |
// | Toasts       | sonner v2                              | sonner (same)                    |
// | Theme        | next-themes                            | next-themes (same)               |
// | Forms        | react-hook-form + zod                  | react-hook-form + zod (same)     |
// | Charts       | recharts v2                            | recharts (same)                  |
// | 3D           | three.js + @react-three/fiber + drei   | three.js + R3F (same)            |

// ============================================================================
// 2. PROJECT STRUCTURE
// ============================================================================
//
// convex/                          # Backend (Convex serverless)
//   _generated/                    # Auto-generated (never edit)
//   auth.config.ts                 # OIDC auth configuration
//   schema.ts                      # Root schema (imports from schema/)
//   schema/
//     users.ts                     # Users table definition
//     projects.ts                  # Projects + ProjectMessages tables
//     waitlist.ts                  # Waitlist table
//     teamMembers.ts               # TeamMembers + TeamInvites tables
//   users.ts                       # User queries & mutations
//   projects.ts                    # Project queries & mutations
// public/                          # Static assets
// src/
//   components/
//     ui/                          # shadcn/ui primitives
//     providers/                   # Context providers
//       default.tsx                # Root provider composition
//       auth.tsx                   # OIDC auth provider
//       convex.tsx                 # Convex client provider
//       query-client.tsx           # React Query provider
//       theme.tsx                  # Theme (dark/light) provider
//     layouts/
//       marketing-layout.tsx       # Marketing pages layout
//     dashboard-layout.tsx         # Dashboard sidebar layout
//     dashboard-navbar.tsx         # Dashboard top navbar
//     site-header.tsx              # Marketing site header/navbar
//     site-footer.tsx              # Marketing site footer
//     team-dialog.tsx              # Team management dialog
//     particle.tsx                 # Particle animation
//     animated-background.tsx      # Animated background
//     floating-orb.tsx             # Floating orb animation
//   hooks/
//     use-auth.ts                  # Auth hook (re-exports @usehercules/auth)
//     use-debounce.ts              # Debounce hook
//   lib/
//     utils.ts                     # cn() utility
//     brand.ts                     # Brand constants (logo, name, colors)
//   pages/
//     Index.tsx                    # Landing / marketing homepage
//     NotFound.tsx                 # 404 page
//     auth/Callback.tsx            # OIDC auth callback handler
//     login/                       # Login page + components
//     signup/                      # Signup page + components
//     dashboard/                   # Dashboard, projects, create
//     project/                     # Project editor
//     templates/                   # Templates gallery
//     settings/                    # User settings
//     products/                    # Products marketing page
//     solutions/                   # Solutions marketing page
//     resources/                   # Resources marketing page
//     pricing/                     # Pricing marketing page
//   App.tsx                        # Root component + route definitions
//   index.css                      # Global CSS + theme variables
//   main.tsx                       # Entry point
// index.html                       # HTML template

// ============================================================================
// 3. ROUTING
// ============================================================================
//
// All routes defined in src/App.tsx using react-router-dom v7 declarative mode.
//
// | Path                    | Component           | Layout           | Auth Required |
// | ----------------------- | ------------------- | ---------------- | ------------- |
// | /auth/callback          | AuthCallback        | None             | No            |
// | /login                  | LoginPage           | None             | No            |
// | /signup                 | SignupPage           | None             | No            |
// | /                       | Index               | MarketingLayout  | No            |
// | /products               | ProductsPage        | MarketingLayout  | No            |
// | /solutions              | SolutionsPage       | MarketingLayout  | No            |
// | /resources              | ResourcesPage       | MarketingLayout  | No            |
// | /pricing                | PricingPage         | MarketingLayout  | No            |
// | /dashboard              | DashboardPage       | DashboardLayout  | Yes (AuthGate)|
// | /dashboard/projects     | ProjectsPage        | DashboardLayout  | Yes (AuthGate)|
// | /dashboard/create       | CreateProjectPage   | DashboardLayout  | Yes (AuthGate)|
// | /templates              | TemplatesPage       | DashboardLayout  | Yes (AuthGate)|
// | /settings               | SettingsPage        | DashboardLayout  | Yes (AuthGate)|
// | /project/:projectId     | ProjectEditorPage   | None (standalone)| Yes (inline)  |
// | *                       | NotFound            | None             | No            |
//
// AuthGate wraps dashboard routes: renders skeleton (AuthLoading), sign-in (Unauthenticated), or content (Authenticated)
// Next.js: Use middleware for auth checks + layout.tsx for shared layouts

// ============================================================================
// 4. LAYOUTS
// ============================================================================
//
// MarketingLayout (src/components/layouts/marketing-layout.tsx)
//   - Wraps: /, /products, /solutions, /resources, /pricing
//   - Contains: SiteHeader (fixed top navbar) + <Outlet /> + SiteFooter
//   - Full-width, min-h-screen, flex column
//
// DashboardLayout (src/components/dashboard-layout.tsx)
//   - Wraps: /dashboard, /dashboard/projects, /dashboard/create, /templates, /settings
//   - Full-width navbar at top (h-14, sticky)
//   - Below: sidebar (animated 72px<->256px collapse) + main content area
//   - Sidebar: New Project button, nav items (Dashboard, Projects, Templates, Settings), user profile, sign-out
//   - Sidebar has animated dot-grid canvas background
//   - Navbar: sidebar toggle, dynamic page title, search, notifications, user avatar
//
// Next.js: app/(marketing)/layout.tsx and app/(dashboard)/layout.tsx

// ============================================================================
// 5. DATABASE SCHEMA
// ============================================================================

export const DATABASE_SCHEMA = {
  users: {
    fields: {
      tokenIdentifier: "string (unique OIDC identifier)",
      name: "optional string",
      email: "optional string",
      avatarUrl: "optional string",
      hasCompletedOnboarding: "boolean",
    },
    indexes: {
      by_token: ["tokenIdentifier"],
    },
    systemFields: ["_id: Id<'users'>", "_creationTime: number (ms)"],
    nextJsEquivalent: "Prisma User model with UUID pk, OAuth account relation",
  },
  projects: {
    fields: {
      userId: "Id<'users'> (FK -> users)",
      name: "string",
      description: "string",
      status: "'generating' | 'active' | 'archived'",
      prompt: "string",
      visibility: "'public' | 'private'",
      lastEditedAt: "string (ISO 8601)",
    },
    indexes: {
      by_user: ["userId"],
    },
    nextJsEquivalent: "Prisma Project model with userId foreign key",
  },
  projectMessages: {
    fields: {
      projectId: "Id<'projects'> (FK -> projects)",
      role: "'user' | 'assistant'",
      content: "string",
      sentAt: "string (ISO 8601)",
    },
    indexes: {
      by_project: ["projectId"],
    },
    nextJsEquivalent: "Prisma ProjectMessage model with projectId foreign key",
  },
  waitlist: {
    fields: {
      email: "string",
    },
    indexes: {
      by_email: ["email"],
    },
    nextJsEquivalent: "Prisma Waitlist model with unique email",
  },
  teamMembers: {
    fields: {
      projectId: "Id<'projects'> (FK -> projects)",
      userId: "Id<'users'> (FK -> users)",
      role: "'owner' | 'editor' | 'viewer'",
      invitedBy: "Id<'users'> (FK -> users)",
      joinedAt: "string (ISO 8601)",
    },
    indexes: {
      by_project: ["projectId"],
      by_user: ["userId"],
      by_project_and_user: ["projectId", "userId"],
    },
    nextJsEquivalent: "Prisma TeamMember model with composite unique (projectId, userId)",
  },
  teamInvites: {
    fields: {
      projectId: "Id<'projects'> (FK -> projects)",
      email: "string",
      role: "'editor' | 'viewer'",
      invitedBy: "Id<'users'> (FK -> users)",
      status: "'pending' | 'accepted' | 'declined'",
      invitedAt: "string (ISO 8601)",
    },
    indexes: {
      by_project: ["projectId"],
      by_email: ["email"],
      by_project_and_email: ["projectId", "email"],
    },
    nextJsEquivalent: "Prisma TeamInvite model with composite unique (projectId, email)",
  },
} as const;

// ============================================================================
// 6. BACKEND FUNCTIONS (API)
// ============================================================================

export const BACKEND_FUNCTIONS = {
  "users.ts": {
    updateCurrentUser: {
      type: "mutation",
      args: "(none)",
      description: "Upserts user on login using OIDC identity",
      nextJs: "Server Action or API route POST /api/auth/callback",
    },
    getCurrentUser: {
      type: "query",
      args: "(none)",
      description: "Returns current authenticated user doc",
      nextJs: "Server Action or API route GET /api/users/me",
    },
    updateProfile: {
      type: "mutation",
      args: "{ name: string }",
      description: "Updates user display name",
      nextJs: "Server Action or API route PATCH /api/users/me",
    },
    deleteAccount: {
      type: "mutation",
      args: "(none)",
      description: "Cascading delete: user + projects + messages",
      nextJs: "Server Action or API route DELETE /api/users/me",
    },
    completeOnboarding: {
      type: "mutation",
      args: "{ displayName, role, goal }",
      description: "Sets onboarding complete, updates name",
      nextJs: "Server Action or API route POST /api/users/onboarding",
    },
  },
  "projects.ts": {
    create: {
      type: "mutation",
      args: "{ name, description, prompt, visibility }",
      description: "Creates new project for authenticated user",
      nextJs: "Server Action or API route POST /api/projects",
    },
    listByUser: {
      type: "query",
      args: "(none)",
      description: "Lists owned + shared projects, sorted by lastEditedAt",
      nextJs: "Server Action or API route GET /api/projects",
    },
    getById: {
      type: "query",
      args: "{ projectId }",
      description: "Gets project with access control (owner or team)",
      nextJs: "Server Action or API route GET /api/projects/[id]",
    },
    rename: {
      type: "mutation",
      args: "{ projectId, name }",
      description: "Renames a project (owner only)",
      nextJs: "Server Action or API route PATCH /api/projects/[id]",
    },
    remove: {
      type: "mutation",
      args: "{ projectId }",
      description: "Deletes a project (owner only)",
      nextJs: "Server Action or API route DELETE /api/projects/[id]",
    },
  },
} as const;

// ============================================================================
// 7. AUTHENTICATION
// ============================================================================
//
// Current: Hercules Auth (managed OIDC)
// Flow: SignInButton click -> Hercules Auth page -> /auth/callback -> /
// Methods: Google, Microsoft, Email OTP
// Frontend hook: useAuth() from @/hooks/use-auth.ts
// Backend: ctx.auth.getUserIdentity() returns { tokenIdentifier, name, email, profileUrl }
// Auto-upsert on login: updateCurrentUser mutation
// Components: <Authenticated>, <Unauthenticated>, <AuthLoading>, <SignInButton>
//
// Visual auth pages (display only):
//   /login: email + password fields (not functional), social login buttons
//   /signup: email + password + phone (optional), email OTP dialog
//
// Next.js:
//   Replace with NextAuth.js or Clerk
//   Replace tokenIdentifier with session user ID
//   Replace <Authenticated> wrappers with middleware or getServerSession()
//   Replace <SignInButton> with NextAuth signIn()/signOut()

// ============================================================================
// 8. PROVIDERS & CONTEXT
// ============================================================================
//
// Provider tree (src/components/providers/default.tsx):
//   AuthProvider         <- OIDC auth
//     ConvexProvider     <- Convex client (reactive WebSocket)
//       QueryClient      <- React Query
//         TooltipProvider <- Radix tooltip
//           ThemeProvider <- next-themes (dark/light/system)
//             Toaster    <- sonner toasts
//               {children}
//
// Next.js: Keep ThemeProvider, TooltipProvider, Toaster, QueryClient.
// Replace AuthProvider + ConvexProvider with NextAuth SessionProvider + DB client.

// ============================================================================
// 9. PAGES & FEATURES
// ============================================================================

export const PAGES = {
  marketing: {
    "/": "Homepage: hero with animated gradient, prompt input, features grid, how-it-works, social proof, CTA, AI prompt examples",
    "/products": "Product features showcase with feature cards and icons",
    "/solutions": "Solution categories: Startups, Agencies, Enterprise, Freelancers",
    "/resources": "Documentation, blog, community links",
    "/pricing": "Pricing tiers and comparison",
    "/login": "Light theme, display-only email/password, social buttons (Google, GitHub, Apple), actual auth via redirect",
    "/signup": "Light theme, email/password/phone(opt), email OTP dialog, social buttons",
  },
  dashboard: {
    "/dashboard": "Overview cards (total projects, active, generated), recent projects list",
    "/dashboard/projects": "Full project list with search, filter, sort. Status, team role, last edited",
    "/dashboard/create": "Multi-step project creation: name, description, prompt, visibility",
    "/templates": "Template gallery for quick project starts",
    "/settings": "Profile editing (name, avatar), onboarding status, account deletion",
    "/project/:projectId": "Project workspace with messaging (user/assistant), team dialog",
  },
  onboarding: "Multi-step flow when hasCompletedOnboarding=false: display name -> role -> goal. Calls completeOnboarding mutation.",
} as const;

// ============================================================================
// 10. SHARED COMPONENTS
// ============================================================================

export const SHARED_COMPONENTS = {
  navigation: {
    SiteHeader: "Fixed top marketing navbar: logo, nav links (Products, Solutions, Resources, Pricing), auth state buttons",
    SiteFooter: "4-column footer (Product, Solutions, Resources, Company), logo, copyright",
    DashboardNavbar: "Sticky top bar: sidebar toggle, dynamic page title, search, notifications, user avatar",
    DashboardSidebar: "Collapsible (72px<->256px), dot-grid bg, New Project button, nav items, user profile, sign-out",
  },
  decorative: {
    Particle: "Canvas-based particle animation",
    FloatingOrb: "Animated floating orb effect",
    AnimatedBackground: "Background animation wrapper",
    SidebarDotGrid: "Animated dot grid canvas for sidebar",
  },
  dialogs: {
    TeamDialog: "Team member management: invite by email, role selection, member list",
    OtpDialog: "Email OTP verification UI in signup (display only)",
  },
} as const;

// ============================================================================
// 11. STYLING & THEME
// ============================================================================
//
// Approach:
//   - Tailwind CSS 4 with CSS custom properties
//   - Black and white / grayscale theme throughout
//   - Semantic color variables (no hardcoded colors)
//   - Dark mode via next-themes (class-based .dark)
//
// Key CSS variables (src/index.css):
//   Light: --background: white, --foreground: near-black, --primary: near-black
//   Dark: inverted pattern
//   All using oklch(L 0 0) for pure grayscale
//
// Fonts:
//   - Body: Outfit
//   - Heading: Bricolage Grotesque
//   - Mono: DM Mono
//   - Serif: Noto Serif
//
// Next.js: Copy CSS vars directly. Use next/font instead of Google Fonts @import.

// ============================================================================
// 12. BRAND CONFIGURATION
// ============================================================================

export const BRAND = {
  gradient: "linear-gradient(135deg, #0a0a0a, #333333)",
  colors: {
    primary: "#0a0a0a",
    secondary: "#333333",
    dark: "#0a0a0a",
    lightBg: "#fafafa",
    surfaceBg: "#f5f5f5",
  },
  logoUrl: "https://hercules-cdn.com/file_OozkkE04E2bCbm9mfUvCKNdw",
  appName: "OneNexium",
} as const;

// ============================================================================
// 13. THIRD-PARTY LIBRARIES
// ============================================================================

export const DEPENDENCIES = {
  core: {
    react: "^19.2.4 — UI framework",
    "react-dom": "^19.2.4 — React DOM renderer",
    "react-router-dom": "^7.13.1 — Client-side routing (replace with Next.js file routing)",
    convex: "^1.32.0 — Backend client reactive (replace with Prisma/Drizzle + tRPC/REST)",
    "oidc-client-ts": "^3.4.1 — OIDC auth (replace with NextAuth)",
    "react-oidc-context": "^3.3.0 — React OIDC hooks (replace with NextAuth)",
    "@usehercules/auth": "^1.0.40 — Hercules Auth wrapper (replace with NextAuth)",
  },
  frameworkAgnostic: {
    motion: "^12.34.3 — Animations",
    "lucide-react": "^0.575.0 — Icons",
    sonner: "^2.0.7 — Toast notifications",
    "next-themes": "^0.4.6 — Theme switching",
    "react-hook-form": "^7.71.2 — Form handling",
    "@hookform/resolvers": "^5.2.2 — Validation resolvers",
    zod: "^3.25.76 — Schema validation",
    recharts: "2.15.4 — Charts",
    three: "^0.183.2 — 3D rendering",
    "@react-three/fiber": "^9.5.0 — React Three.js",
    "@react-three/drei": "^10.7.7 — R3F helpers",
    "@tanstack/react-query": "^5.90.21 — Data fetching",
    "date-fns": "^4.1.0 — Date utilities",
    "use-debounce": "^10.1.0 — Debounce hook",
    "input-otp": "^1.4.2 — OTP input",
    cmdk: "^1.1.1 — Command palette",
    "embla-carousel-react": "^8.6.0 — Carousel",
    "react-day-picker": "^9.13.2 — Date picker",
    "react-resizable-panels": "^3.0.6 — Resizable panels",
    vaul: "^1.1.2 — Drawer component",
    "class-variance-authority": "^0.7.1 — Variant system",
    clsx: "^2.1.1 — Class names",
    "tailwind-merge": "^3.5.0 — Tailwind merging",
  },
  radixUI: [
    "accordion", "alert-dialog", "aspect-ratio", "avatar", "checkbox",
    "collapsible", "context-menu", "dialog", "dropdown-menu", "hover-card",
    "label", "menubar", "navigation-menu", "popover", "progress",
    "radio-group", "scroll-area", "select", "separator", "slider",
    "slot", "switch", "tabs", "toggle", "toggle-group", "tooltip",
  ],
} as const;

// ============================================================================
// 14. ENVIRONMENT VARIABLES
// ============================================================================
//
// Frontend (Vite VITE_ prefix):
//   VITE_CONVEX_URL              — Convex deployment URL
//   VITE_HERCULES_OIDC_AUTHORITY — OIDC authority URL
//   VITE_HERCULES_OIDC_CLIENT_ID — OIDC client ID
//
// Backend (Convex process.env):
//   HERCULES_OIDC_AUTHORITY      — OIDC authority for backend
//   HERCULES_OIDC_CLIENT_ID      — OIDC client ID for backend
//
// Next.js: Use .env.local. NEXT_PUBLIC_ prefix for client vars.

// ============================================================================
// 15. MIGRATION PATTERN REPLACEMENTS
// ============================================================================

export const MIGRATION_PATTERNS = {
  routing: {
    "react-router <Route>": "Next.js file-based routing (app/ directory)",
    "<Outlet />": "{children} in layout.tsx",
    "useNavigate()": "useRouter() from next/navigation",
    "useLocation()": "usePathname() from next/navigation",
    '<Link to="">': '<Link href="">',
    "useParams()": "useParams() (same API in Next.js)",
  },
  backend: {
    "useQuery(api.x.y, args)": "useQuery({ queryFn: () => fetch('/api/...') })",
    "useMutation(api.x.y)": "Server Action or useMutation(() => fetch(...))",
    "usePaginatedQuery()": "Custom cursor pagination with React Query",
    "ConvexError({ code, message })": "Custom error class or HTTP status codes",
    "v.string() / v.number()": "z.string() / z.number() (Zod)",
    'v.id("table")': "z.string().uuid()",
    'ctx.db.query("table").withIndex()': "prisma.table.findMany({ where })",
    'ctx.db.insert("table", data)': "prisma.table.create({ data })",
    "ctx.db.patch(id, data)": "prisma.table.update({ where: { id }, data })",
    "ctx.db.delete(id)": "prisma.table.delete({ where: { id } })",
  },
  auth: {
    "ctx.auth.getUserIdentity()": "getServerSession(authOptions) (NextAuth)",
    "tokenIdentifier": "session.user.id",
    "<Authenticated>/<Unauthenticated>": "middleware.ts or getServerSession() checks",
    "<SignInButton>": "NextAuth signIn()/signOut() or Clerk <SignInButton>",
  },
  providers: {
    AuthProvider: "NextAuth SessionProvider or Clerk ClerkProvider",
    ConvexProvider: "Remove (not needed with Prisma/REST)",
    ThemeProvider: "Keep (next-themes works with Next.js)",
    TooltipProvider: "Keep (Radix is framework-agnostic)",
    QueryClientProvider: "Keep (React Query works with Next.js)",
    Toaster: "Keep (sonner works with Next.js)",
  },
} as const;

// ============================================================================
// 16. CHANGE LOG
// ============================================================================

export const CHANGE_LOG = [
  {
    date: "2026-04-07",
    version: "v159",
    changes: [
      "Dashboard stripped to flat minimal view — all cards removed.",
      "Layout: greeting header with project count + 'New' button, then a flat 'Recent' project list with rows (avatar, name, time ago, status badge, hover arrow).",
      "Empty state: centered icon + text + Create button.",
      "Removed: BentoCard, WelcomeCard, StatCard, QuickActionCard, RecentProjectsCard, WorkspaceCard, DashboardDotGrid.",
    ],
  },
  {
    date: "2026-04-07",
    version: "v158",
    changes: [
      "Dashboard UI redesigned with bento grid layout (subsequently removed in v159).",
    ],
  },
  {
    date: "2026-04-07",
    version: "v157",
    changes: [
      "Initial document creation. Full architecture documented.",
      "Features: Landing page, auth (OIDC), dashboard, projects CRUD, onboarding flow, team collaboration, settings, marketing pages (products, solutions, resources, pricing), templates gallery, project editor with messaging.",
      "Theme: Black and white / grayscale throughout.",
      "Login/Signup: Light theme with display-only email/password/phone fields, email OTP dialog, social login buttons.",
      "Layout: Marketing layout (header+footer) + Dashboard layout (full-width navbar + collapsible sidebar + dot-grid background).",
    ],
  },
] as const;
