# SEO Audit: scratchspace.dev

**Audit ID:** 01
**Date:** 2025-12-20
**Auditor:** Claude (Senior SEO Engineer)
**Codebase:** scratchspace-website
**Framework:** Next.js 15.5.9 (App Router)
**Target Query:** "Rex Kirshner"

---

## Implementation Status

**Last Updated:** 2025-12-20

| Recommendation | Status | Priority |
|----------------|--------|----------|
| Add "Rex Kirshner" to page content | 🔲 Not started | P0 Critical |
| Add Person schema for Rex Kirshner | 🔲 Not started | P0 Critical |
| Add sameAs links (LinkedIn, GitHub, etc.) | 🔲 Not started | P0 Critical |
| Add "Rex Kirshner" to meta keywords | 🔲 Not started | P1 High |
| Add Person author to metadata | 🔲 Not started | P1 High |
| Remove duplicate robots.txt | 🔲 Not started | P2 Medium |
| Add web app manifest | 🔲 Not started | P2 Medium |
| Add 404 page | 🔲 Not started | P3 Low |
| Add favicon.ico fallback | 🔲 Not started | P3 Low |
| Add Google Search Console verification | 🔲 Not started | P1 High |

**Summary:** 0 of 10 recommendations implemented. Critical personal branding issues identified.

---

## 1. Executive Summary

### Overall Assessment: CRITICAL (for target query)

The site has **excellent technical SEO infrastructure** but **completely lacks personal branding** for "Rex Kirshner". The name does not appear anywhere in the codebase - not in content, metadata, structured data, or alt text.

### Primary Finding

**🚨 "Rex Kirshner" appears ZERO times in the entire codebase.**

This is the single biggest issue preventing the site from ranking for personal name searches.

### What's Working Well

| Area | Status | Notes |
|------|--------|-------|
| Meta tags | ✅ Excellent | Title, description, OG, Twitter cards configured |
| Structured data | ✅ Good | WebSite, Organization, CollectionPage schemas |
| Semantic HTML | ✅ Good | Proper use of header, main, footer, article, section |
| Robots/Sitemap | ✅ Good | Dynamic generation with appropriate rules |
| Performance | ✅ Good | ISR enabled, font preloading, image optimization |
| Microdata | ✅ Good | ProjectCard uses SoftwareSourceCode schema |

### What's Missing for "Rex Kirshner" Ranking

| Issue | Impact | Current State |
|-------|--------|---------------|
| No name in visible content | Critical | Site says "RBK Strategies" only |
| No Person schema | Critical | Only Organization schema present |
| No sameAs links | High | Empty array in Organization schema |
| No name in keywords | High | Keywords focus on tech terms only |
| No author attribution | Medium | Author is "RBK Strategies", not personal name |

---

## 2. Technical SEO Findings

### 2.1 Robots.txt Conflict

**Location:**
- `public/robots.txt` (static)
- `src/app/robots.ts` (dynamic)

**Problem:** Both files exist. Next.js App Router will use `robots.ts` and ignore the static file, but having both is confusing and could cause issues during development/deployment.

**Current Static (public/robots.txt):**
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /auth/
Disallow: /auth/*
Disallow: /api/

Sitemap: https://scratchspace.dev/sitemap.xml
```

**Current Dynamic (src/app/robots.ts):**
```typescript
rules: [
  {
    userAgent: '*',
    allow: '/',
    disallow: ['/admin', '/admin/*', '/auth/', '/auth/*', '/api/'],
  },
],
sitemap: `${SITE_URL}/sitemap.xml`,
```

**Fix:** Delete `public/robots.txt`. The dynamic version is sufficient and more maintainable.

**Impact:** Low | **Complexity:** Low

---

### 2.2 Sitemap Scope

**Location:** `src/app/sitemap.ts`

**Current State:** Only includes homepage:
```typescript
const staticPages: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  },
];
```

**Assessment:** This is actually correct for this site. Project URLs are external (different domains) and shouldn't be in the sitemap. The comment in the code confirms this was intentional.

**Status:** ✅ Correct

---

### 2.3 Missing Web App Manifest

**Problem:** No `manifest.json` or `src/app/manifest.ts` exists.

**Impact:**
- PWA installability not available
- Mobile home screen icon not optimized
- Minor SEO signal missing

**Fix:** Add `src/app/manifest.ts`:
```typescript
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'scratchspace.dev - Rex Kirshner',
    short_name: 'scratchspace',
    description: 'Experimental open-source projects by Rex Kirshner',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
```

**Impact:** Low | **Complexity:** Low

---

### 2.4 Missing 404 Page

**Location:** `src/app/not-found.tsx` does not exist.

**Problem:** Uses Next.js default 404 page instead of branded custom page.

**Impact:**
- Missed opportunity for SEO internal linking
- Poor user experience
- Missed brand reinforcement

**Fix:** Create custom 404 with links to homepage and projects.

**Impact:** Low | **Complexity:** Low

---

### 2.5 Favicon Configuration

**Location:** `public/favicon.svg`

**Current State:**
- Only SVG favicon exists
- No `.ico` fallback for older browsers
- No multiple sizes for different devices

**Assessment:** SVG is modern and scalable. The current setup is acceptable for a tech-focused site where visitors likely have modern browsers.

**Recommendation:** Consider adding `favicon.ico` as fallback:
```bash
# Using ImageMagick
convert -background none favicon.svg -resize 32x32 favicon.ico
```

**Impact:** Low | **Complexity:** Low

---

### 2.6 Google Search Console Not Verified

**Location:** `src/app/layout.tsx:88-92`

**Current State:**
```typescript
verification: {
  // Add your verification codes when available
  // google: 'your-google-site-verification',
},
```

**Problem:** Cannot access Search Console data, submit sitemaps, or see indexing status.

**Fix:**
1. Go to Google Search Console
2. Add property for `scratchspace.dev`
3. Choose "HTML tag" verification method
4. Add the meta tag to the verification object

**Impact:** High | **Complexity:** Low

---

## 3. Personal Branding Findings (Critical)

### 3.1 No "Rex Kirshner" in Page Content

**Location:** `src/app/page.tsx`

**Current Content:**
```jsx
<h1 className="text-4xl font-bold mb-4 text-white">
  scratchspace.dev
</h1>
<p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
  A collection of experimental open-source projects and prototypes.
  This is where new ideas are tested, features are explored, and
  innovative solutions take their first steps.
</p>
```

**Problem:** The name "Rex Kirshner" appears nowhere. Search engines need visible text content to associate this site with the person.

**Fix Options:**

**Option A - Subtitle approach:**
```jsx
<h1 className="text-4xl font-bold mb-2 text-white">
  scratchspace.dev
</h1>
<p className="text-lg text-green-400 mb-4">
  by Rex Kirshner
</p>
```

**Option B - Footer attribution:**
```jsx
<footer className="mt-16 pt-8 border-t border-gray-800">
  <p className="text-sm text-gray-500">
    Created by{' '}
    <a href="https://linkedin.com/in/rexkirshner" ...>
      Rex Kirshner
    </a>
    {' '}| A property of{' '}
    <a href="https://rbkstrategies.com" ...>
      RBK Strategies
    </a>
  </p>
</footer>
```

**Option C - About section (recommended):**
```jsx
<section className="mb-12">
  <h2 className="text-xl font-semibold text-gray-300 mb-3">About</h2>
  <p className="text-gray-400">
    Hi, I'm <strong className="text-white">Rex Kirshner</strong>,
    a software engineer and founder of RBK Strategies.
    This is my experimental playground where I build and share
    open-source projects exploring AI, web development, and developer tools.
  </p>
</section>
```

**Impact:** Critical | **Complexity:** Low

---

### 3.2 Missing Person Schema

**Location:** `src/app/page.tsx:39-81`

**Current State:** Has WebSite, Organization, and CollectionPage schemas but no Person schema.

**Problem:** Google's Knowledge Graph cannot associate this site with "Rex Kirshner" as a person.

**Fix:** Add Person schema to the JSON-LD graph:
```typescript
{
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Rex Kirshner',
  url: SITE_URL,
  jobTitle: 'Software Engineer & Founder',
  worksFor: {
    '@id': `${SITE_URL}/#organization`,
  },
  sameAs: [
    'https://linkedin.com/in/rexkirshner',
    'https://github.com/rexkirshner',
    'https://twitter.com/rexkirshner', // if exists
  ],
  image: `${SITE_URL}/rex-kirshner.jpg`, // if available
},
```

And update the Organization to reference the person:
```typescript
{
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'RBK Strategies',
  url: 'https://rbkstrategies.com',
  founder: {
    '@id': `${SITE_URL}/#person`,
  },
  // ...rest
},
```

**Impact:** Critical | **Complexity:** Low

---

### 3.3 Empty sameAs Array

**Location:** `src/app/page.tsx:63`

**Current State:**
```typescript
{
  '@type': 'Organization',
  ...
  sameAs: [],  // Empty!
},
```

**Problem:** Social profiles are a major signal for entity recognition. Google uses sameAs to verify and link entities across platforms.

**Fix:** Add social profiles:
```typescript
sameAs: [
  'https://linkedin.com/company/rbkstrategies',
  'https://github.com/rbkstrategies',
  'https://twitter.com/rbkstrategies', // if exists
],
```

**Impact:** High | **Complexity:** Low

---

### 3.4 Author Metadata Missing Personal Name

**Location:** `src/app/layout.tsx:48-50`

**Current State:**
```typescript
authors: [{ name: 'RBK Strategies', url: 'https://rbkstrategies.com' }],
creator: 'RBK Strategies',
publisher: 'RBK Strategies',
```

**Problem:** Only business name, no personal attribution.

**Fix:**
```typescript
authors: [
  { name: 'Rex Kirshner', url: 'https://linkedin.com/in/rexkirshner' },
  { name: 'RBK Strategies', url: 'https://rbkstrategies.com' },
],
creator: 'Rex Kirshner',
publisher: 'RBK Strategies',
```

**Impact:** High | **Complexity:** Low

---

### 3.5 Keywords Missing Personal Name

**Location:** `src/app/layout.tsx:35-47`

**Current State:**
```typescript
keywords: [
  'open source',
  'experimental projects',
  'web development',
  'developer tools',
  'prototypes',
  'Next.js',
  'TypeScript',
  'React',
  'AI tools',
  'podcast framework',
  'Ethereum education',
],
```

**Problem:** "Rex Kirshner" not in keywords.

**Fix:**
```typescript
keywords: [
  'Rex Kirshner',
  'Rex Kirshner projects',
  'RBK Strategies',
  'open source',
  'experimental projects',
  // ... rest
],
```

**Impact:** Medium | **Complexity:** Low

---

## 4. Semantic HTML & Accessibility

### 4.1 Heading Hierarchy

**Status:** ✅ Good

| Page | h1 | h2 | h3 | Status |
|------|----|----|----|----|
| Homepage | "scratchspace.dev" | "Public Projects" | Project names | ✅ |
| Admin | "Manage Projects" | N/A | Project names | ✅ |

### 4.2 ARIA Labels

**Status:** ✅ Good

ProjectCard includes proper aria-labels:
```jsx
aria-label={`Visit ${project.name} project website`}
aria-label={`View ${project.name} source code on GitHub`}
```

### 4.3 Microdata

**Status:** ✅ Good

ProjectCard uses Schema.org microdata:
```jsx
<article itemScope itemType="https://schema.org/SoftwareSourceCode">
  <span itemProp="name">{project.name}</span>
  <p itemProp="description">{project.description}</p>
  <a itemProp="url" ...>
  <a itemProp="codeRepository" ...>
</article>
```

---

## 5. Performance Impact on SEO

### 5.1 Core Web Vitals

**Status:** ✅ Good (based on implementation review)

| Signal | Implementation | Expected Impact |
|--------|----------------|-----------------|
| LCP | ISR caching, font preloading | Fast |
| FID | Minimal JavaScript, server components | Fast |
| CLS | Fixed dimensions, font-display: swap | Stable |

### 5.2 Caching Strategy

**Status:** ✅ Excellent

- ISR with 60-second revalidation
- On-demand revalidation via `revalidatePath('/')`
- Static assets in public folder

---

## 6. Prioritized Actions

| Priority | Recommendation | Impact | Complexity | Location |
|----------|----------------|--------|------------|----------|
| **P0** | Add "Rex Kirshner" to visible page content | Critical | Low | `src/app/page.tsx` |
| **P0** | Add Person schema for Rex Kirshner | Critical | Low | `src/app/page.tsx` |
| **P0** | Add sameAs links (LinkedIn, GitHub) | Critical | Low | `src/app/page.tsx` |
| **P1** | Add "Rex Kirshner" to meta keywords | High | Low | `src/app/layout.tsx` |
| **P1** | Add Person author to metadata | High | Low | `src/app/layout.tsx` |
| **P1** | Set up Google Search Console | High | Low | GSC + `layout.tsx` |
| **P2** | Remove duplicate `public/robots.txt` | Medium | Low | Delete file |
| **P2** | Add web app manifest | Medium | Low | `src/app/manifest.ts` |
| **P3** | Add custom 404 page | Low | Low | `src/app/not-found.tsx` |
| **P3** | Add favicon.ico fallback | Low | Low | `public/favicon.ico` |

---

## 7. Implementation Guide

### Quick Win: Add Personal Branding (30 minutes)

**Step 1:** Update `src/app/page.tsx` - Add "by Rex Kirshner" subtitle:
```jsx
<header className="mb-12">
  <h1 className="text-4xl font-bold mb-2 text-white">
    scratchspace.dev
  </h1>
  <p className="text-lg text-green-400 mb-4">
    by Rex Kirshner
  </p>
  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
    A collection of experimental open-source projects and prototypes...
  </p>
</header>
```

**Step 2:** Update JSON-LD in `src/app/page.tsx` - Add Person schema:
```typescript
{
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Rex Kirshner',
  url: SITE_URL,
  jobTitle: 'Software Engineer',
  worksFor: {
    '@id': `${SITE_URL}/#organization`,
  },
  sameAs: [
    'https://linkedin.com/in/rexkirshner',
    'https://github.com/rexkirshner',
  ],
},
```

**Step 3:** Update `src/app/layout.tsx` - Add to keywords and authors:
```typescript
keywords: [
  'Rex Kirshner',
  'Rex Kirshner projects',
  // ...existing keywords
],
authors: [
  { name: 'Rex Kirshner', url: 'https://linkedin.com/in/rexkirshner' },
  { name: 'RBK Strategies', url: 'https://rbkstrategies.com' },
],
creator: 'Rex Kirshner',
```

---

## Appendix A: File Inventory

| File | SEO Role | Status |
|------|----------|--------|
| `src/app/layout.tsx` | Root metadata, viewport, OG tags | ✅ Comprehensive |
| `src/app/page.tsx` | Homepage content, JSON-LD | ⚠️ Missing personal branding |
| `src/app/robots.ts` | Dynamic robots.txt | ✅ Correct |
| `public/robots.txt` | Static robots.txt (unused) | ⚠️ Should remove |
| `src/app/sitemap.ts` | Dynamic sitemap | ✅ Correct |
| `public/favicon.svg` | Site icon | ✅ Modern |
| `public/og-image.png` | Open Graph image | ✅ Present |
| `src/components/landing/ProjectCard.tsx` | Microdata | ✅ Correct |

---

## Appendix B: Structured Data Validation

**Current Schemas:**
- ✅ WebSite
- ✅ Organization (needs sameAs)
- ✅ CollectionPage
- ✅ SoftwareSourceCode (per project)
- ❌ Person (missing - critical)

**Test URL:** https://search.google.com/test/rich-results

---

## Appendix C: Competitor Analysis

To rank for "Rex Kirshner", consider what currently ranks:
1. LinkedIn profile (almost always #1 for personal names)
2. Company websites
3. GitHub profiles
4. Personal blogs/portfolios

**Strategy:** Link `scratchspace.dev` from all these profiles and ensure consistent NAP (Name-Association-Profile) across all.

---

**End of Audit**
