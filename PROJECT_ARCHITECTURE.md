# Ready2Go Emergency Dashboard - Project Architecture

## Project Overview

**Ready2Go** is a comprehensive emergency operations and preparedness platform built with **Next.js 16**, **React 19**, and **TypeScript**. It provides real-time situational awareness, alerts, and community response tools for emergency management with role-based access control.

---

## Technology Stack

```
Frontend:
├── Next.js 16.0.10 (React 19 Framework)
├── TypeScript
├── Tailwind CSS 4.1.9
├── React Hook Form
├── Radix UI (headless component library)
├── Recharts (data visualization)
├── Lucide React (icons)
└── Zod (schema validation)

Styling & UI:
├── PostCSS 8.5
├── Autoprefixer
├── Tailwind CSS Animation
├── Class Variance Authority
└── Tailwind Merge

Utilities:
├── Date-fns (date handling)
├── Embla Carousel
├── React Resizable Panels
├── Vaul (drawer component)
└── Sonner (notifications)
```

---

## Application Architecture

### Authentication & Authorization Flow

```
Public Routes (No Auth Required)
├── /login          (Login Page)
└── /signup         (Sign Up Page)

Protected Routes (Auth Required)
├── Middleware (middleware.ts)
│   └── Validates userRole cookie
│
├── Admin Routes
│   └── (admin)/ [requires userRole='admin']
│
├── User Routes
│   └── (user)/ [requires userRole='user']
│
└── Ready2Go Routes
    └── (ready2go)/ [requires userRole='ready2go']
```

### User Roles & Access Control

```
ROLES:
1. admin
   - Full access to admin dashboard
   - Can manage responders & agencies
   - Can activate virtual EOC mode
   - Can create & manage alerts
   - Access all emergency features

2. user
   - Access to user dashboard
   - Can view personal alerts & locations
   - Can access preparedness information
   - Limited to public information

3. ready2go
   - Access to Ready2Go portal
   - Lodging & essentials management
   - Weather & traffic updates
   - Emergency center information
```

---

## Directory Structure

```
/app
├── layout.tsx                          [Root Layout - Auth Provider, Theme]
├── globals.css                         [Global Styles, Responsive Utilities]
│
├── /login
│   └── page.tsx                        [Login Page]
│
├── /signup
│   └── page.tsx                        [Sign Up Page]
│
├── /(admin)                            [Admin Dashboard Group Layout]
│   ├── layout.tsx                      [Admin Layout - Sidebar, Header]
│   ├── page.tsx                        [Main Admin Dashboard]
│   ├── /emergency-events
│   │   └── page.tsx
│   ├── /alerts-communication
│   │   └── page.tsx
│   ├── /gis-mapping
│   │   └── page.tsx
│   ├── /responders-agencies
│   │   └── page.tsx
│   ├── /virtual-eoc-ai-center
│   │   └── page.tsx
│   ├── /after-action-review
│   │   └── page.tsx
│   ├── /emergency-plan
│   │   └── page.tsx
│   ├── /preparedness-information
│   │   └── page.tsx
│   ├── /virtual-eoc-settings
│   │   └── page.tsx
│   └── /eoc-mode-dashboard
│       └── page.tsx
│
├── /(user)                             [User Dashboard Group Layout]
│   ├── layout.tsx                      [User Layout - User Sidebar, Header]
│   ├── /user-dashboard
│   │   └── page.tsx
│   └── /user/
│       ├── /alerts
│       ├── /my-locations
│       ├── /emergency-plan
│       ├── /preparedness
│       ├── /weather
│       └── /news-updates
│
└── /(ready2go)                         [Ready2Go Dashboard Group Layout]
    ├── layout.tsx                      [Ready2Go Layout - Ready2Go Sidebar, Header]
    ├── /ready2go-dashboard
    │   └── page.tsx
    └── /ready2go/
        ├── /lodging-essentials
        ├── /emergency-center
        ├── /emergency-maintenance
        └── /weather-traffic

/components
├── header.tsx                          [Responsive Header - Mobile Menu, Search]
├── sidebar.tsx                         [Admin Sidebar Navigation]
├── user-sidebar.tsx                    [User Sidebar Navigation]
├── ready2go-sidebar.tsx                [Ready2Go Sidebar Navigation]
│
├── /providers
│   └── auth-provider.tsx               [Auth Context & Route Protection]
│
├── /modals
│   ├── activate-virtual-eoc-modal.tsx
│   ├── active-emergency-events-modal.tsx
│   ├── alert-detail-modal.tsx
│   ├── damage-report-modal.tsx
│   ├── gis-eoc-activated-modal.tsx
│   ├── notify-leaders-modal.tsx
│   ├── recovery-tools-modal.tsx
│   ├── safety-guide-modal.tsx
│   ├── schedule-call-modal.tsx
│   ├── send-community-alert-modal.tsx
│   └── situation-report-modal.tsx
│
├── /ui                                [Radix UI Component Library]
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── carousel.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── skeleton.tsx
│   ├── switch.tsx
│   ├── tabs.tsx
│   ├── tooltip.tsx
│   └── [... more UI components]
│
├── dashboard-stats.tsx                 [Dashboard Statistics Cards]
├── communications-center.tsx           [Communications Management]
├── first-responder-tools.tsx          [First Responder Utilities]
├── gis-map.tsx                        [GIS Mapping Component]
├── threat-detection.tsx               [Threat Detection Display]
├── post-event-recovery.tsx            [Post-Event Recovery Tools]
├── quick-action-buttons.tsx           [Quick Action Button Group]
├── virtual-eoc-operations.tsx         [Virtual EOC Operations Panel]
├── GuidanceProtocolSheet.tsx          [Guidance & Protocol Display]
└── theme-provider.tsx                 [Theme Provider Setup]

/hooks
├── use-mobile.ts                       [Mobile Breakpoint Hook]
└── use-toast.ts                        [Toast Notification Hook]

/lib
└── utils.ts                            [Utility Functions (cn, etc.)]

/public
├── logo.png                            [Ready2Go Logo]
├── icon.svg
├── icon-light-32x32.png
├── icon-dark-32x32.png
└── apple-icon.png

/styles
└── globals.css                         [Global Stylesheet (if separate)]

middleware.ts                           [NextJS Middleware - Route Protection]
```

---

## Component Hierarchy & Data Flow

```
RootLayout (app/layout.tsx)
│
└─ AuthProvider
   │
   ├─ /login (PublicLayout)
   └─ /signup (PublicLayout)
   
   ├─ AdminLayout (app/(admin)/layout.tsx)
   │  ├─ Sidebar (menuItems)
   │  ├─ Header (responsive mobile menu)
   │  └─ Page Content
   │     ├─ DashboardStats
   │     ├─ GISMap
   │     ├─ ThreatDetection
   │     ├─ FirstResponderTools
   │     ├─ CommunicationsCenter
   │     ├─ VirtualEOCOperations
   │     ├─ PostEventRecovery
   │     ├─ QuickActionButtons
   │     └─ Modals (SendCommunityAlert, etc.)
   │
   ├─ UserLayout (app/(user)/layout.tsx)
   │  ├─ UserSidebar (userMenuItems)
   │  ├─ Header (responsive mobile menu)
   │  └─ Page Content
   │     └─ UserDashboard
   │
   └─ Ready2GoLayout (app/(ready2go)/layout.tsx)
      ├─ Ready2GoSidebar (ready2goMenuItems)
      ├─ Header (responsive mobile menu)
      └─ Page Content
         └─ Ready2GoDashboard
```

---

## Authentication Flow

```
START
  │
  ├─ User visits app
  │  └─ middleware.ts checks cookies
  │     │
  │     ├─ If public route → allow (/login, /signup)
  │     └─ If protected & no userRole → redirect /login
  │
  ├─ Login/Signup Page
  │  └─ Form submission
  │     │
  │     ├─ Set localStorage (userRole, userName, userEmail)
  │     ├─ Set cookie (userRole)
  │     └─ Redirect to role-based dashboard
  │
  ├─ AdminLayout / UserLayout / Ready2GoLayout
  │  └─ useEffect verifies userRole
  │     │
  │     ├─ if (role !== expected) → redirect back
  │     └─ if (role === expected) → render dashboard
  │
  └─ Protected Dashboard
     └─ AuthProvider enforces route access
```

---

## Responsive Design Breakpoints

```
Mobile-First Approach (Tailwind CSS v4)

sm  (640px)  ─ Small phones
md  (768px)  ─ Tablets & larger phones
lg  (1024px) ─ Desktop
xl  (1280px) ─ Large desktop
2xl (1536px) ─ Extra large desktop

Key Responsive Features:
├─ Header
│  ├─ Mobile: hamburger menu (md:hidden), search toggle icon
│  └─ Desktop: full search bar, visible user menu
│
├─ Sidebar
│  ├─ Mobile: off-canvas drawer (md:hidden)
│  └─ Desktop: fixed 288px sidebar (w-72)
│
├─ Grids & Cards
│  ├─ Mobile: grid-cols-1 (full width)
│  ├─ Tablet: grid-cols-2 (md:grid-cols-2)
│  └─ Desktop: grid-cols-3 or grid-cols-4 (lg:grid-cols-3/4)
│
└─ Typography
   ├─ Mobile: smaller font sizes, tighter spacing
   └─ Desktop: larger titles, more breathing room
```

---

## Key Features by Role

### 🏢 Admin Dashboard
- **Real-time Dashboard**: Active incidents, statistics, system status
- **Emergency Events**: Create, manage, and track emergency events
- **Alerts & Communication**: Send and manage community alerts
- **GIS Mapping**: Map-based incident visualization
- **Responders & Agencies**: Manage personnel and agency access
- **Virtual EOC**: Activate emergency operations center mode
- **After Action Review**: Post-event analysis and reporting
- **Emergency Planning**: Create and manage emergency plans
- **Preparedness**: Community preparedness information
- **Virtual EOC AI Center**: AI-powered analysis & suggestions
- **Settings**: System configuration

### 👤 User Dashboard
- **Personal Alerts**: View alerts relevant to user location
- **My Locations**: Manage important locations
- **Emergency Plans**: Access personal emergency plans
- **Preparedness**: Preparedness resources & guidance
- **Weather Feed**: Real-time weather updates
- **News & Updates**: Emergency-related news

### 🚀 Ready2Go Portal
- **Dashboard**: Quick overview & stats
- **Lodging & Essentials**: Find emergency shelter & supplies
- **Emergency Center**: Centralized emergency information
- **Emergency Maintenance**: Report facility maintenance needs
- **Weather & Traffic**: Real-time updates & advisories

---

## State Management & Data Handling

```
Local Storage:
├─ userRole: 'admin' | 'user' | 'ready2go'
├─ userName: string
└─ userEmail: string

Cookies:
└─ userRole (used by middleware)

Component State (useState):
├─ Modal visibility states
├─ Form data
├─ Sidebar/menu open/close
└─ Page-specific data (alerts, incidents, users)

Future Considerations:
├─ API integration (replace localStorage)
├─ Context/Redux for complex state
└─ Real-time updates (WebSocket/SSE)
```

---

## Modal Components & Interactions

```
Modal System:
├─ SendCommunityAlertModal
├─ ActiveEmergencyEventsModal
├─ AlertDetailModal
├─ DamageReportModal
├─ GISEOCActivatedModal
├─ NotifyLeadersModal
├─ RecoveryToolsModal
├─ SafetyGuideModal
├─ ScheduleCallModal
├─ SituationReportModal
└─ ActivateVirtualEOCModal

Pattern:
└─ useState(showModal) → Button triggers → Modal opens
   └─ Form submission → Modal closes → Optional callback
```

---

## Responsive Improvements (Already Implemented)

✅ **Viewport Meta Tag** - Added to root layout
✅ **Responsive Header** - Mobile hamburger menu & search toggle
✅ **Mobile Navigation Drawer** - Off-canvas menu for mobile
✅ **Global Responsive Utilities** - Container, sr-only, full-height root
✅ **Responsive Padding** - Header & sections adjust for mobile/desktop
✅ **Menu Exports** - Navigation arrays reused across components

---

## Deployment & Build

```
Development:
$ pnpm dev           # Start dev server (localhost:3000)

Production Build:
$ pnpm build         # Next.js production build
$ pnpm start         # Run production server

Linting:
$ pnpm lint          # ESLint check

Hosting:
├─ Vercel (recommended for Next.js)
├─ Docker deployment
└─ Self-hosted Node.js server
```

---

## Next Steps & Recommendations

1. **Complete Responsive Updates**
   - [ ] Make all dashboard pages responsive (grids → flex-col md:flex-row)
   - [ ] Ensure modals are full-width on mobile
   - [ ] Test touch targets (min 44x44px)

2. **Backend Integration**
   - [ ] Replace localStorage with API calls
   - [ ] Add real authentication (JWT, OAuth)
   - [ ] Database for persistent data

3. **Real-time Features**
   - [ ] WebSocket connection for live alerts
   - [ ] Server-Sent Events (SSE) for notifications
   - [ ] Real-time incident updates

4. **Performance**
   - [ ] Code splitting & lazy loading
   - [ ] Image optimization
   - [ ] Caching strategies

5. **Testing**
   - [ ] Unit tests (Jest, Vitest)
   - [ ] E2E tests (Cypress, Playwright)
   - [ ] Accessibility testing (WCAG 2.1)

---

## Quick Reference: Login Credentials

```
Admin User:
├─ Email: admin@gmail.com
└─ Password: admin123

Test User:
├─ Email: test@yopmail.com
└─ Password: test123

Ready2Go User:
├─ Email: test1@yopmail.com
└─ Password: test123
```

---

## File Size & Performance Notes

- **Total Dependencies**: ~80 packages (Radix UI, Recharts, React Hook Form, etc.)
- **Bundle Strategy**: Tailwind CSS with tree-shaking optimizes unused styles
- **Image Optimization**: Next.js Image component for automatic optimization
- **Code Splitting**: Route-based code splitting via Next.js

---

*Last Updated: February 5, 2026*
