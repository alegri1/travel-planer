---
name: react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Use when writing, reviewing, or refactoring React/Next.js components, pages, data fetching, or bundle optimization. TRIGGER when creating or modifying React components, Next.js pages/routes, or reviewing for performance.
---

# Vercel React Best Practices

Comprehensive performance optimization guide for React and Next.js applications. Contains 58 rules across 8 categories, prioritized by impact.

## When to Apply

Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

## Critical Rules Summary

### 1. Eliminating Waterfalls (CRITICAL)
- Move `await` into branches where actually used (defer-await)
- Use `Promise.all()` for independent operations
- Use Suspense boundaries to stream content
- Start promises early, await late in API routes

### 2. Bundle Size (CRITICAL)
- Import directly from modules, avoid barrel files
- Use `next/dynamic` for heavy components
- Load analytics/third-party after hydration
- Load modules only when feature is activated

### 3. Server-Side Performance (HIGH)
- Authenticate server actions like API routes
- Use `React.cache()` for per-request deduplication
- Avoid duplicate serialization in RSC props
- Minimize data passed to client components
- Restructure components to parallelize fetches
- Use `after()` for non-blocking operations

### 4. Re-render Optimization (MEDIUM)
- Derive state during render, not in effects
- Use functional `setState` for stable callbacks
- Use `useRef` for transient frequent values
- Extract expensive work into memoized components
- Don't wrap simple primitive expressions in `useMemo`

### 5. Rendering Performance (MEDIUM)
- Use ternary, not `&&` for conditional rendering
- Prefer `useTransition` over manual loading states
- Hoist static JSX outside components
- Use `content-visibility` for long lists

## Full Reference

For detailed code examples (incorrect vs correct) for all 58 rules, read `AGENTS.md` in this skill's directory.
