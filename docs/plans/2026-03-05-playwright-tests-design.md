# Playwright E2E Tests Design

## Scope
E2E tests for critical user flows: auth, trip CRUD, itinerary management, flight search.

## Approach
- Real dev server + database (no API mocking except Amadeus)
- Auth fixture: login once, reuse cookie storage state
- Each suite manages its own test data (create/cleanup)
- Amadeus API mocked via `page.route()` interception

## Test Suites

### 1. Auth (auth.spec.ts)
- Route protection: unauthenticated user redirected to /login
- Wrong password shows error
- Successful login redirects to dashboard
- Logout clears session, redirects to /login

### 2. Trip CRUD (trips.spec.ts)
- Create trip with valid data, appears in grid
- Date validation: end < start shows error
- Delete trip with confirmation
- Empty state shown when no trips

### 3. Itinerary (itinerary.spec.ts)
- Day tabs render from trip date range
- Add activity to specific day
- Delete activity with confirmation
- Activity form validation (title required)

### 4. Flight Search (flights.spec.ts)
- Search form submits with IATA codes
- Results display with flight details
- Add flight creates activity with flight metadata
- Mocked Amadeus responses

## Parallelization
- Branch `test/auth-and-trips`: Auth + Trip CRUD
- Branch `test/itinerary-and-flights`: Itinerary + Flight Search
- Shared setup (config, fixtures) done first on base branch

## Tech
- Playwright with Chromium
- `webServer` config to auto-start dev server
- Storage state auth fixture
- Test timeout: 30s
