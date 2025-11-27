# Product Requirements Document: scratchspace.dev v1.0

**Project**: scratchspace.dev Landing Page & Admin System
**Owner**: Rex Kirshner / RBK Strategies
**Version**: 1.0
**Status**: In Progress (43% Complete - Phases 0-2)
**Created**: 2025-11-27
**Last Updated**: 2025-11-27
**Target Launch**: TBD

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Implementation Status](#implementation-status)
3. [Project Goals](#project-goals)
4. [Technical Architecture](#technical-architecture)
5. [Data Models](#data-models)
6. [User Flows](#user-flows)
7. [Implementation Phases](#implementation-phases)
8. [Testing Strategy](#testing-strategy)
9. [Security Requirements](#security-requirements)
10. [Future Considerations](#future-considerations)

---

## Executive Summary

**Purpose**: scratchspace.dev is a landing page showcasing experimental open-source projects deployed to `*.scratchspace.dev` subdomains. It provides a clean, developer-focused interface for public visitors and includes an admin CMS for managing project visibility and metadata.

**Key Features**:
- Minimal landing page with project list
- Public/private project visibility control
- Admin authentication and CRUD operations
- Manual project ordering
- RBK Strategies attribution

**Target Users**:
- **Public Visitors**: Developers and stakeholders viewing experimental projects
- **Admin Users**: Rex Kirshner (expandable to multiple admins)

---

## Implementation Status

**Last Updated**: 2025-11-27
**Sprint**: 003 (In Progress)
**Overall Progress**: 70% (4.6 of 7 phases complete)

### Completed Phases

#### ✅ Phase 0: Project Setup & Infrastructure (100%)
- **Duration**: 1 day
- **Status**: Complete
- **Checkpoints**: 5/5 verified

**Deliverables**:
- Next.js 15 with App Router, TypeScript, Tailwind CSS
- Docker Compose for PostgreSQL (port 5435)
- Prisma ORM with User + Project schema
- Vitest + React Testing Library
- ESLint + Prettier configuration
- Git repository initialized

**Key Decisions**:
- Port 5435 for PostgreSQL (5432 in use)
- JetBrains Mono font for developer aesthetic
- Dark theme by default (#0a0a0a background)
- Security headers configured in next.config.js

#### ✅ Phase 1: Database & Auth Foundation (100%)
- **Duration**: 2 days
- **Status**: Complete
- **Checkpoints**: 7/7 verified
- **Tests**: 13/13 passing

**Deliverables**:
- Prisma schema with User + Project models
- Password hashing utilities (bcrypt, cost factor 12)
- Admin user seed script with environment variable support
- NextAuth.js with Credentials provider
- Session management (JWT, 7-day expiry)
- Auth middleware for /admin routes (src/middleware.ts)
- Sign-in page with error handling
- Comprehensive password utility tests

**Key Decisions**:
- Bcrypt cost factor 12 (~300ms hash time)
- Minimum password length 12 characters
- JWT sessions over database sessions
- Email/password authentication (no OAuth for v1)
- Single admin user (expandable to roles)
- Middleware must be in src/ directory for Next.js 15

**Issues Discovered & Fixed**:
1. **Middleware Location**: Must be in `src/middleware.ts` not root `middleware.ts` for Next.js 15 with src/ structure
2. **Middleware Matcher**: Pattern `/admin/:path*` didn't match `/admin` itself - fixed with `['/admin', '/admin/:path*']`
3. **NEXTAUTH_URL Port**: Was set to 3000 but server runs on 3002 - caused session issues
4. **Admin Password**: Seed script didn't load .env.local - fixed by passing env vars explicitly
5. **Server Component Events**: Add Project button was in Server Component - extracted to Client Component

#### ✅ Phase 2: Data Access Layer (100%)
- **Duration**: 1 day
- **Status**: Complete
- **Checkpoints**: 8/8 verified
- **Tests**: 17/17 passing

**Deliverables**:
- Zod validation schemas for Project model
- ProjectService with full CRUD operations
- Comprehensive unit tests
- URL format validation (http/https required)
- Field length constraints enforced
- Atomic reordering with transactions

**Service Methods Implemented**:
```typescript
getPublicProjects()     // Returns PUBLIC projects, ordered
getAllProjects()        // Returns all projects (admin view)
getProjectById(id)      // Single project lookup
createProject(data)     // Validates + assigns order
updateProject(id, data) // Partial updates with validation
deleteProject(id)       // Hard delete
reorderProject(id, dir) // Atomic swap with adjacent project
```

**Key Decisions**:
- Hard delete (not soft delete) for simplicity
- Auto-incrementing order for new projects
- Atomic reordering with Prisma transactions
- Validation on both client and server
- Optional GitHub URL field

#### ✅ Phase 3: Public Landing Page (100%)
- **Duration**: 2 days
- **Status**: Complete
- **Checkpoints**: 8/8 verified
- **Tests**: 7 tests passing (ProjectCard component)

**Deliverables**:
- Landing page route with public project display
- ProjectCard component (name, description, links, GitHub icon)
- ProjectList component (maps over projects)
- Hardcoded site description
- RBK Strategies attribution link
- Responsive layout (mobile + desktop)
- Empty state handling
- Component tests

**Design Decisions**:
- **Accent Color**: Green (#10b981 - Tailwind green-500) for developer aesthetic
- **Layout**: Vertical list (not grid) for easy scanning
- **Typography**: JetBrains Mono monospace font
- **Spacing**: Generous (py-16, mb-12) for readability
- **Max Width**: 4xl (896px) for optimal line length
- **Links**: All open in new tab with security attributes

**Landing Page Copy**:
> "A collection of experimental open-source projects and prototypes. This is where new ideas are tested, features are explored, and innovative solutions take their first steps."

#### ✅ Phase 4: Admin Dashboard UI (100%)
- **Duration**: 2 days
- **Status**: Complete
- **Checkpoints**: 7/7 verified

**Deliverables**:
- Admin layout with header and navigation
- Admin dashboard page with project table
- ProjectTable component (displays all projects)
- ReorderControls component (up/down arrows)
- AddProjectButton component (Client Component)
- Logout button in header
- Stats cards (total, public, private counts)

**UI Features**:
- Table with columns: Order, Name, URL, Visibility, Actions
- Visibility badges (green for PUBLIC, gray for PRIVATE)
- Reorder controls with disabled states
- Edit and Delete buttons per row
- Loading states during operations
- Responsive design

**Accessibility**:
- Proper ARIA labels on buttons
- Keyboard navigation support
- Disabled states with visual feedback
- Semantic HTML

### In Progress

#### 🔄 Phase 5: Admin CRUD Operations (60%)
- **Duration**: 3 days (in progress)
- **Status**: Partial - Delete & Reorder complete, Add/Edit forms pending
- **Checkpoints**: 5/12 verified

**Completed**:
- ✅ DELETE /api/projects/[id] endpoint
- ✅ PATCH /api/projects/[id] endpoint
- ✅ PATCH /api/projects/[id]/reorder endpoint
- ✅ Delete functionality with confirmation
- ✅ Reorder functionality (atomic swaps)

**Pending**:
- ⏳ POST /api/projects endpoint
- ⏳ ProjectForm component (create/edit)
- ⏳ Modal component for form display
- ⏳ Wire up "Add Project" button
- ⏳ Wire up "Edit" buttons
- ⏳ Form validation (client + server)
- ⏳ Success/error feedback

**Next Steps**: Complete Add/Edit form implementation

### Upcoming Phases

#### ⏳ Phase 6: Production Deployment (0%)
- **Dependencies**: Phase 5 complete
- **Estimated Duration**: 1 day

#### ⏳ Phase 7: Testing & Polish (0%)
- **Dependencies**: Phase 6 complete
- **Estimated Duration**: 2 days

### Test Coverage

**Unit Tests**: 37/37 passing (100%)
- Password utilities: 13 tests
- ProjectService: 17 tests
- ProjectCard component: 7 tests

**Integration Tests**: 0 (planned for Phase 7)
**E2E Tests**: 0 (planned for Phase 7)

### Technical Debt

**Low Priority**:
- Address 4 moderate npm vulnerabilities
- Separate test database from development
- Create formal Prisma migrations (currently using db push)
- Remove obsolete version field from docker-compose.yml

**Medium Priority**:
- Rate limiting on login endpoint
- Structured logging
- Error monitoring setup

**High Priority** (before launch):
- Security audit of auth flow
- Accessibility audit
- Performance testing (Lighthouse)
- Cross-browser testing

### Open Issues

1. **Test Database Strategy**: Currently tests run against dev database
   - Risk: Tests modify real data
   - Decision: Keep current approach for solo dev, revisit if team grows

2. **Migration Strategy**: Used `db push` instead of migrations
   - Plan: Create formal migrations before Phase 6 deployment

3. **Design Preferences**: Need user input for Phase 3
   - Landing page description text
   - Accent color
   - Project card layout

### Repository Info

- **Location**: `scratch-space/scratchspace-website/`
- **Remote**: https://github.com/rexkirshner/scratch-space
- **Branch**: main
- **Commits**: 13 (not pushed yet)
- **Latest Commit**: "Fix: Move middleware to src directory for Next.js 15"
- **Sprint Reports**: sprint-001-report.md, sprint-002-report.md (in docs/development/)

### Recent Decisions Log

1. **2025-11-27**: PostgreSQL port 5435 (avoid conflict with port 5432)
2. **2025-11-27**: Bcrypt cost factor 12 for production-grade security
3. **2025-11-27**: JWT sessions with 7-day expiry (balance of security/UX)
4. **2025-11-27**: Hard delete for projects (keep v1 simple)
5. **2025-11-27**: Optional GitHub URL (not all projects are open source)
6. **2025-11-27**: Atomic reordering with transactions (prevent race conditions)

---

## Project Goals

### Primary Goals
1. **Discoverability**: Provide a human-readable hub for experimental projects
2. **Control**: Enable admin to show/hide projects without redeploying
3. **Professionalism**: Present a clean, developer-focused brand for scratchspace.dev
4. **Maintainability**: Build modular, testable architecture for future expansion

### Non-Goals (v1.0)
- Analytics or usage tracking
- Project comments or feedback system
- GitHub API integration (stars, activity, etc.)
- Multi-language support
- Public user registration

---

## Technical Architecture

### Tech Stack

**Frontend**:
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS

**Backend**:
- Next.js API Routes (Server Actions + Route Handlers)
- NextAuth.js (email/password authentication)
- Prisma ORM

**Database**:
- PostgreSQL 15+
- Docker Compose (local development)
- Vercel Postgres with Prisma Accelerate (production)

**Hosting**:
- Vercel (automatic deployments from main branch)

**Testing**:
- Vitest (unit tests)
- React Testing Library (component tests)

### Architecture Principles

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data access
2. **Server-First**: Leverage React Server Components, minimize client-side JavaScript
3. **Type Safety**: End-to-end TypeScript from database to UI
4. **Security by Default**: Server-side validation, authenticated API routes
5. **Modular Components**: Reusable, testable UI components

### Directory Structure

```
scratchspace-dev/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/             # Public routes (landing page)
│   │   │   └── page.tsx
│   │   ├── (authenticated)/      # Protected routes
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   └── projects/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/               # React components
│   │   ├── landing/
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectList.tsx
│   │   ├── admin/
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── ProjectTable.tsx
│   │   │   └── ReorderControls.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       └── Toast.tsx
│   ├── lib/                      # Business logic
│   │   ├── auth/
│   │   │   ├── auth.config.ts
│   │   │   └── password.ts
│   │   ├── db/
│   │   │   └── prisma.ts
│   │   ├── services/
│   │   │   ├── project.service.ts
│   │   │   └── user.service.ts
│   │   └── validations/
│   │       └── project.schema.ts
│   └── types/                    # TypeScript types
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── tests/
│   ├── unit/
│   └── integration/
├── docker-compose.yml
└── package.json
```

---

## Data Models

### Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  role          UserRole  @default(ADMIN)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

enum UserRole {
  ADMIN
  EDITOR
  VIEWER
}

model Project {
  id          String    @id @default(cuid())
  name        String
  url         String
  description String
  githubUrl   String?
  visibility  Visibility @default(PRIVATE)
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("projects")
  @@index([visibility, order])
}

enum Visibility {
  PUBLIC
  PRIVATE
}
```

### Data Constraints

**User Table**:
- `email`: Valid email format, unique, required
- `passwordHash`: bcrypt hash, min 12 characters (plain text), required
- `role`: ADMIN | EDITOR | VIEWER (for future role expansion)

**Project Table**:
- `name`: 1-100 characters, required
- `url`: Valid URL format (http/https), required
- `description`: 1-500 characters, required
- `githubUrl`: Valid URL format, optional
- `visibility`: PUBLIC | PRIVATE, default PRIVATE
- `order`: Integer for manual sorting, default 0

---

## User Flows

### Flow 1: Public Visitor Views Landing Page

**Actors**: Unauthenticated public visitor

**Steps**:
1. Visitor navigates to `https://scratchspace.dev`
2. System fetches all PUBLIC projects, sorted by `order` ASC
3. System renders landing page:
   - Brief site description (hardcoded)
   - Link to RBK Strategies (`https://rbkstrategies.com`)
   - List of public projects (name, description, URL, GitHub link)
4. If no public projects exist, show only description + RBK link

**Exit Conditions**:
- Visitor clicks project URL → External project site
- Visitor clicks GitHub link → GitHub repository
- Visitor clicks RBK link → RBK Strategies website

---

### Flow 2: Admin Logs In

**Actors**: Admin user (Rex Kirshner)

**Steps**:
1. Admin navigates to `/admin`
2. System detects unauthenticated session → Redirects to `/auth/signin`
3. Admin enters email + password
4. System validates credentials:
   - **Valid**: Creates session (7-day expiry), redirects to `/admin`
   - **Invalid**: Shows error, prompts retry
5. Admin views admin dashboard with all projects (public + private)

**Error Conditions**:
- Invalid email format → "Please enter a valid email"
- Wrong password → "Invalid credentials"
- Account doesn't exist → "Invalid credentials" (same message for security)

---

### Flow 3: Admin Creates New Project

**Actors**: Authenticated admin

**Preconditions**: Admin is logged in at `/admin`

**Steps**:
1. Admin clicks "Add Project" button
2. System displays project form modal/page
3. Admin fills in fields:
   - Name (required)
   - URL (required)
   - Description (required)
   - GitHub URL (optional)
   - Visibility: Public or Private (default: Private)
4. Admin clicks "Save"
5. System validates input:
   - **Valid**: Creates project, assigns `order = MAX(order) + 1`, shows success toast, refreshes list
   - **Invalid**: Shows inline validation errors
6. New project appears at bottom of list

**Validation Rules**:
- Name: 1-100 chars
- URL: Valid HTTP/HTTPS format
- Description: 1-500 chars
- GitHub URL: Valid HTTP/HTTPS format OR empty

---

### Flow 4: Admin Edits Existing Project

**Actors**: Authenticated admin

**Preconditions**: Admin is logged in, at least one project exists

**Steps**:
1. Admin clicks "Edit" button next to project
2. System displays pre-filled project form
3. Admin modifies fields
4. Admin clicks "Save"
5. System validates and updates project
6. System shows success toast, refreshes list

---

### Flow 5: Admin Deletes Project

**Actors**: Authenticated admin

**Preconditions**: Admin is logged in, at least one project exists

**Steps**:
1. Admin clicks "Delete" button next to project
2. System shows confirmation dialog: "Delete [Project Name]? This cannot be undone."
3. Admin confirms
4. System permanently deletes project from database
5. System shows success toast, refreshes list

---

### Flow 6: Admin Reorders Projects

**Actors**: Authenticated admin

**Preconditions**: Admin is logged in, at least two projects exist

**Steps**:
1. Admin views project list with up/down arrow buttons
2. Admin clicks "Move Up" on Project B (order: 1)
3. System swaps order values:
   - Project A (order: 0) → order: 1
   - Project B (order: 1) → order: 0
4. System re-renders list in new order
5. Change persists across sessions

**Edge Cases**:
- "Move Up" disabled on first item
- "Move Down" disabled on last item

---

## Implementation Phases

### Phase 0: Project Setup & Infrastructure
**Duration**: 1 day
**Dependencies**: None

#### Deliverables
- [ ] Initialize Next.js project with TypeScript + Tailwind
- [ ] Configure ESLint + Prettier
- [ ] Set up Docker Compose for local PostgreSQL
- [ ] Configure Prisma with schema
- [ ] Create `.env.local` template
- [ ] Set up Vitest + React Testing Library
- [ ] Initialize Git repository

#### Verification Checkpoints
✅ **CP-0.1**: Run `npm run dev` → Next.js starts on `localhost:3000`
✅ **CP-0.2**: Run `docker-compose up` → PostgreSQL accessible on port 5432
✅ **CP-0.3**: Run `npx prisma db push` → Schema synced to database
✅ **CP-0.4**: Run `npm test` → Test suite runs (0 tests passing)
✅ **CP-0.5**: Commit to Git, verify `.env.local` in `.gitignore`

---

### Phase 1: Database & Auth Foundation
**Duration**: 2 days
**Dependencies**: Phase 0

#### Deliverables
- [ ] Complete Prisma schema (User + Project models)
- [ ] Create database migrations
- [ ] Implement password hashing utilities (bcrypt)
- [ ] Create seed script for initial admin user
- [ ] Configure NextAuth.js with Credentials provider
- [ ] Implement session management (7-day expiry)
- [ ] Create auth middleware for protected routes

#### Verification Checkpoints
✅ **CP-1.1**: Run `npx prisma migrate dev` → Migrations applied, tables created
✅ **CP-1.2**: Run `npm run seed` → Admin user created in database
✅ **CP-1.3**: Verify admin user in DB: `email`, `passwordHash`, `role=ADMIN`
✅ **CP-1.4**: Unit test: `hashPassword()` + `verifyPassword()` functions pass
✅ **CP-1.5**: Navigate to `/admin` while logged out → Redirects to `/auth/signin`
✅ **CP-1.6**: Submit valid credentials → Session created, redirected to `/admin`
✅ **CP-1.7**: Submit invalid credentials → Error message shown, no redirect

**Files Created**:
- `prisma/schema.prisma`
- `prisma/migrations/*`
- `prisma/seed.ts`
- `src/lib/auth/password.ts`
- `src/lib/auth/auth.config.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `tests/unit/password.test.ts`

---

### Phase 2: Data Access Layer
**Duration**: 1 day
**Dependencies**: Phase 1

#### Deliverables
- [ ] Create Prisma client singleton
- [ ] Implement `ProjectService` with CRUD methods:
  - `getPublicProjects()` → Returns PUBLIC projects ordered by `order`
  - `getAllProjects()` → Returns all projects (admin only)
  - `createProject(data)` → Validates and creates project
  - `updateProject(id, data)` → Validates and updates project
  - `deleteProject(id)` → Hard deletes project
  - `reorderProjects(id, direction)` → Swaps order with adjacent project
- [ ] Implement input validation schemas (Zod)
- [ ] Write unit tests for all service methods

#### Verification Checkpoints
✅ **CP-2.1**: Unit test: `getPublicProjects()` returns only PUBLIC projects
✅ **CP-2.2**: Unit test: `getAllProjects()` returns PUBLIC + PRIVATE projects
✅ **CP-2.3**: Unit test: `createProject()` with invalid URL → Throws validation error
✅ **CP-2.4**: Unit test: `createProject()` with valid data → Project created, `order` assigned
✅ **CP-2.5**: Unit test: `updateProject()` modifies existing project
✅ **CP-2.6**: Unit test: `deleteProject()` removes project from DB
✅ **CP-2.7**: Unit test: `reorderProjects()` swaps order values correctly
✅ **CP-2.8**: All validation schemas reject invalid inputs (name too long, invalid URL, etc.)

**Files Created**:
- `src/lib/db/prisma.ts`
- `src/lib/services/project.service.ts`
- `src/lib/validations/project.schema.ts`
- `tests/unit/project.service.test.ts`

---

### Phase 3: Public Landing Page
**Duration**: 2 days
**Dependencies**: Phase 2

#### Deliverables
- [ ] Create landing page route (`src/app/(public)/page.tsx`)
- [ ] Implement `ProjectCard` component (name, description, links)
- [ ] Implement `ProjectList` component (maps over projects)
- [ ] Add hardcoded site description
- [ ] Add RBK Strategies link
- [ ] Style with Tailwind (developer-focused aesthetic)
- [ ] Handle empty state (no public projects)
- [ ] Make page responsive (mobile + desktop)

#### Verification Checkpoints
✅ **CP-3.1**: Seed 3 public projects, navigate to `/` → All 3 projects displayed
✅ **CP-3.2**: Verify project order matches `order` field ASC
✅ **CP-3.3**: Click project URL → Opens in new tab
✅ **CP-3.4**: Click GitHub link → Opens in new tab
✅ **CP-3.5**: Click RBK Strategies link → Opens `https://rbkstrategies.com`
✅ **CP-3.6**: Set all projects to PRIVATE → Landing page shows only description + RBK link
✅ **CP-3.7**: Test on mobile viewport (375px) → Layout responsive, no horizontal scroll
✅ **CP-3.8**: Component test: `ProjectCard` renders all props correctly

**Files Created**:
- `src/app/(public)/page.tsx`
- `src/components/landing/ProjectCard.tsx`
- `src/components/landing/ProjectList.tsx`
- `src/app/globals.css` (Tailwind styles)
- `tests/unit/ProjectCard.test.tsx`

**Design Notes**:
- **Color Scheme**: Dark mode preferred (dark bg, light text, accent color)
- **Typography**: Monospace font for code feel (e.g., JetBrains Mono, Fira Code)
- **Layout**: Centered content, max-width 800px, generous spacing
- **Links**: Underlined on hover, distinct color for visited

---

### Phase 4: Admin Dashboard UI
**Duration**: 2 days
**Dependencies**: Phase 1, Phase 2

#### Deliverables
- [ ] Create admin layout (`src/app/(authenticated)/admin/layout.tsx`)
- [ ] Create admin dashboard page (`src/app/(authenticated)/admin/page.tsx`)
- [ ] Implement `ProjectTable` component:
  - Displays all projects (public + private)
  - Shows name, URL, visibility badge, order
  - Edit/Delete buttons per row
  - Up/Down arrow buttons for reordering
- [ ] Implement "Add Project" button
- [ ] Add logout button in header
- [ ] Style with Tailwind (table layout)

#### Verification Checkpoints
✅ **CP-4.1**: Navigate to `/admin` while logged out → Redirects to `/auth/signin`
✅ **CP-4.2**: Log in, navigate to `/admin` → Dashboard loads with project table
✅ **CP-4.3**: Seed 2 public + 2 private projects → All 4 visible in admin table
✅ **CP-4.4**: Verify visibility badge shows "Public" (green) or "Private" (gray)
✅ **CP-4.5**: Click "Logout" → Session destroyed, redirected to landing page
✅ **CP-4.6**: Verify "Move Up" disabled on first project, "Move Down" disabled on last
✅ **CP-4.7**: Component test: `ProjectTable` renders correct number of rows

**Files Created**:
- `src/app/(authenticated)/admin/layout.tsx`
- `src/app/(authenticated)/admin/page.tsx`
- `src/components/admin/ProjectTable.tsx`
- `src/components/admin/ReorderControls.tsx`
- `src/components/shared/Header.tsx`

---

### Phase 5: Admin CRUD Operations
**Duration**: 3 days
**Dependencies**: Phase 4

#### Deliverables
- [ ] Create API route: `POST /api/projects` (create)
- [ ] Create API route: `PATCH /api/projects/[id]` (update)
- [ ] Create API route: `DELETE /api/projects/[id]` (delete)
- [ ] Create API route: `PATCH /api/projects/[id]/reorder` (move up/down)
- [ ] Implement `ProjectForm` component (create/edit modal or page)
- [ ] Add form validation (client + server-side)
- [ ] Implement toast notification system
- [ ] Wire up all buttons in `ProjectTable`
- [ ] Add loading states during API calls
- [ ] Add optimistic UI updates

#### Verification Checkpoints
✅ **CP-5.1**: Click "Add Project" → Form appears
✅ **CP-5.2**: Fill valid data, click "Save" → Project created, appears in table, success toast
✅ **CP-5.3**: Fill invalid data (empty name), click "Save" → Validation error shown, no API call
✅ **CP-5.4**: Submit invalid URL → Server returns 400, error toast shown
✅ **CP-5.5**: Click "Edit" on existing project → Form pre-filled with current data
✅ **CP-5.6**: Modify project, click "Save" → Project updated, table refreshes
✅ **CP-5.7**: Click "Delete", confirm → Project removed from table, success toast
✅ **CP-5.8**: Click "Move Up" on Project 2 → Swaps with Project 1, order persists
✅ **CP-5.9**: Click "Move Down" on Project 1 → Swaps with Project 2
✅ **CP-5.10**: Refresh admin page → Order changes persist
✅ **CP-5.11**: Set project to PUBLIC, check landing page → Project now visible
✅ **CP-5.12**: Set project to PRIVATE, check landing page → Project hidden

**Files Created**:
- `src/app/api/projects/route.ts` (POST)
- `src/app/api/projects/[id]/route.ts` (PATCH, DELETE)
- `src/app/api/projects/[id]/reorder/route.ts` (PATCH)
- `src/components/admin/ProjectForm.tsx`
- `src/components/shared/Toast.tsx`
- `src/lib/hooks/useToast.ts`

**API Request/Response Examples**:

```typescript
// POST /api/projects
Request: {
  name: "Experiment 1",
  url: "https://exp1.scratchspace.dev",
  description: "First experiment",
  githubUrl: "https://github.com/user/exp1",
  visibility: "PUBLIC"
}
Response: {
  id: "clx...",
  name: "Experiment 1",
  order: 3,
  ...
}

// PATCH /api/projects/[id]/reorder
Request: { direction: "up" | "down" }
Response: { success: true }
```

---

### Phase 6: Production Deployment
**Duration**: 1 day
**Dependencies**: Phase 5

#### Deliverables
- [ ] Create Vercel project
- [ ] Configure environment variables in Vercel
- [ ] Set up Vercel Postgres database
- [ ] Configure Prisma Accelerate
- [ ] Run migrations on production database
- [ ] Seed initial admin user in production
- [ ] Configure custom domain (`scratchspace.dev`)
- [ ] Set up automatic deployments from `main` branch
- [ ] Test production deployment end-to-end

#### Verification Checkpoints
✅ **CP-6.1**: Push to `main` branch → Vercel automatically deploys
✅ **CP-6.2**: Navigate to `https://scratchspace.dev` → Landing page loads
✅ **CP-6.3**: Log in with production admin credentials → Authentication works
✅ **CP-6.4**: Create test project in production → Persists in Vercel Postgres
✅ **CP-6.5**: Check landing page → New project visible (if public)
✅ **CP-6.6**: Run production migration: `npx prisma migrate deploy` → No errors
✅ **CP-6.7**: Verify HTTPS certificate valid, no mixed content warnings
✅ **CP-6.8**: Test on mobile device → Site loads correctly

**Environment Variables (Vercel)**:
```bash
DATABASE_URL="postgres://..."
NEXTAUTH_URL="https://scratchspace.dev"
NEXTAUTH_SECRET="<generated-secret>"
ADMIN_EMAIL="rex@rbkstrategies.com"
ADMIN_PASSWORD="<secure-password>"
```

---

### Phase 7: Testing & Polish
**Duration**: 2 days
**Dependencies**: Phase 6

#### Deliverables
- [ ] Write integration tests for auth flows
- [ ] Write integration tests for CRUD operations
- [ ] Add loading skeletons for async data
- [ ] Improve error messages (user-friendly)
- [ ] Add favicon and meta tags (SEO)
- [ ] Test cross-browser (Chrome, Firefox, Safari)
- [ ] Accessibility audit (keyboard navigation, ARIA labels)
- [ ] Performance audit (Lighthouse score)
- [ ] Security audit (CSP headers, XSS prevention)
- [ ] Documentation: README with setup instructions

#### Verification Checkpoints
✅ **CP-7.1**: All unit tests pass (`npm test`)
✅ **CP-7.2**: Integration test: Full auth flow passes
✅ **CP-7.3**: Integration test: Create → Edit → Delete project passes
✅ **CP-7.4**: Lighthouse score: Performance >90, Accessibility >90
✅ **CP-7.5**: Keyboard navigation: Tab through all interactive elements, Enter to submit
✅ **CP-7.6**: Test with screen reader: All elements properly labeled
✅ **CP-7.7**: Test in Firefox, Safari → No visual regressions
✅ **CP-7.8**: Verify CSP headers prevent inline scripts
✅ **CP-7.9**: Test SQL injection on project form → Prisma parameterizes queries
✅ **CP-7.10**: Test XSS in project description → React escapes HTML
✅ **CP-7.11**: README includes: Setup, env vars, seed command, deployment steps

**Files Created**:
- `tests/integration/auth.test.ts`
- `tests/integration/projects.test.ts`
- `README.md`
- `public/favicon.ico`
- `src/app/layout.tsx` (meta tags)

---

## Testing Strategy

### Unit Tests (Vitest)

**Coverage Targets**:
- `src/lib/services/`: 100% (all CRUD logic)
- `src/lib/auth/password.ts`: 100% (critical security function)
- `src/lib/validations/`: 100% (all validation schemas)
- `src/components/`: 80% (UI components)

**Key Test Cases**:
1. Password hashing produces valid bcrypt hash
2. Password verification correctly accepts/rejects passwords
3. `getPublicProjects()` filters out PRIVATE projects
4. `createProject()` rejects invalid URLs
5. `reorderProjects()` correctly swaps adjacent items
6. Form validation catches all invalid inputs

### Integration Tests

**Critical Flows**:
1. **Auth Flow**: Login with valid credentials → Session created → Access admin → Logout
2. **Create Project**: Submit form → Validate → Save to DB → Appear in UI
3. **Update Project**: Edit existing → Validate → Update DB → Reflect in UI
4. **Delete Project**: Click delete → Confirm → Remove from DB → Remove from UI
5. **Reorder Project**: Move up → Swap DB order → UI updates → Persist across refresh

### Manual Testing Checklist

**Pre-Launch**:
- [ ] Create 3 test projects with real data
- [ ] Verify all links open correctly
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Verify email/password login from fresh browser
- [ ] Test logout, verify cannot access `/admin`
- [ ] Verify public landing page shows only public projects
- [ ] Verify GitHub link formatting (https://, no trailing slash)

---

## Security Requirements

### Authentication
- **Password Storage**: bcrypt with cost factor 12
- **Session Management**: 7-day expiry, secure HTTPOnly cookies
- **Credential Validation**: Rate limiting on login endpoint (future: add after v1)

### Authorization
- **Route Protection**: All `/admin/*` routes require valid session
- **API Protection**: All mutation endpoints check `req.auth.user`
- **CSRF Protection**: NextAuth handles CSRF tokens automatically

### Input Validation
- **Client-Side**: Zod schemas validate before API calls (UX)
- **Server-Side**: Zod schemas validate in API routes (security)
- **SQL Injection**: Prisma parameterizes all queries (safe by default)
- **XSS Prevention**: React escapes all user content automatically

### Data Protection
- **Secrets Management**: All secrets in environment variables (never committed)
- **Database Access**: Vercel Postgres requires TLS connections
- **API Exposure**: No raw database credentials or admin emails in client code

### Security Headers
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }
];
```

---

## Future Considerations

### Roadmap (Post-v1.0)

**Phase 8: Multi-Admin Support**
- Add user management UI (create/edit/delete users)
- Implement role-based permissions (ADMIN, EDITOR, VIEWER)
- Add audit log for admin actions

**Phase 9: Enhanced Project Metadata**
- Tech stack tags (Next.js, React, PostgreSQL)
- Status badges (Active, Archived, Deprecated)
- Last updated timestamp
- View count tracking

**Phase 10: GitHub Integration**
- Fetch repository stars/forks from GitHub API
- Display last commit date
- Show build status badge (if CI configured)

**Phase 11: Search & Filter**
- Search projects by name/description
- Filter by tech stack tags
- Sort by date added, name, stars

### Architecture Considerations

**Modularity**:
- `ProjectService` abstraction allows swapping Prisma for another ORM
- Component-based UI allows theming changes without logic rewrites
- API routes follow REST conventions for predictable expansion

**Scalability**:
- Prisma Accelerate handles connection pooling
- Server Components minimize client JS bundle
- Static generation possible for landing page (ISR every 60s)

**Extensibility**:
- User roles architected for future RBAC expansion
- Project schema supports additional fields without breaking changes
- Toast system ready for multi-type notifications (info, warning, error, success)

---

## Appendix

### Glossary
- **CRUD**: Create, Read, Update, Delete
- **CSP**: Content Security Policy
- **ISR**: Incremental Static Regeneration
- **RBAC**: Role-Based Access Control
- **XSS**: Cross-Site Scripting

### References
- Next.js App Router: https://nextjs.org/docs/app
- NextAuth.js: https://next-auth.js.org
- Prisma: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres

---

**Document Status**: ✅ Ready for Implementation
**Next Steps**: Begin Phase 0 - Project Setup & Infrastructure
