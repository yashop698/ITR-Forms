# ITR Filing Guide — Project Instructions

This document is the single source of truth for how this project is structured,
how it builds, and how it deploys. Read this before making any changes.

---

## 1. Two-Branch Architecture (CRITICAL)

This project uses **two separate branches** with completely different purposes.
Confusing them is the #1 source of deployment failures.

| Branch | Purpose | What lives here |
|--------|---------|-----------------|
| `main` | Source code | All `.jsx`, `.json`, `.css`, config files |
| `gh-pages` | Deployed build output | Only `index.html`, `assets/`, `favicon.svg` |

**GitHub Pages is configured to serve from `gh-pages`, not `main`.**
Changes pushed only to `main` will not appear on the live site until a build+deploy runs.

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is the bridge:
it builds from `main` and writes the output to `gh-pages` automatically on every push to `main`.

```
main (source)
  └── push triggers GitHub Actions
        └── npm run build  →  dist/
              └── dist/ contents pushed to  →  gh-pages (live site)
```

---

## 2. Local Development

```bash
# Install dependencies (first time or after package.json changes)
npm install

# Start dev server (hot reload, runs at http://localhost:5173/ITR-Forms/)
npm run dev

# Production build (output goes to dist/)
npm run build

# Preview the production build locally
npm run preview
```

The `index.html` at the repo root must always contain:
```html
<script type="module" src="/src/main.jsx"></script>
```
**Never commit the built version of `index.html`** (the one with hashed asset paths like
`/ITR-Forms/assets/index-abc123.js`) to `main`. That breaks the build.
The GitHub Actions bot writes the built `index.html` only to `gh-pages`.

---

## 3. Project Structure

```
ITR-Forms/
├── src/
│   ├── main.jsx                        # React entry point
│   ├── App.jsx                         # Router + top-level layout
│   ├── index.css                       # Tailwind + custom CSS tokens
│   ├── components/
│   │   ├── layout/                     # Navbar, Sidebar, Footer, Layout
│   │   └── ui/                         # Accordion, Breadcrumb, Callout, Tabs, SearchModal
│   ├── pages/
│   │   ├── HomePage.jsx                # Landing page / form grid
│   │   ├── DecisionTreePage.jsx        # ITR Selector wizard
│   │   ├── DownloadsPage.jsx           # Offline utility downloads
│   │   ├── forms/
│   │   │   └── FormPage.jsx            # Single form detail (5 tabs)
│   │   ├── guides/
│   │   │   ├── IncomePage.jsx
│   │   │   └── DeductionsPage.jsx
│   │   ├── procedures/ProceduresPage.jsx
│   │   └── reference/ReferencePage.jsx
│   ├── hooks/
│   │   └── useDataLoader.js
│   └── utils/
│       └── formatters.js
│
├── data/                               # All content — JSON only, no logic
│   ├── forms/
│   │   ├── itr1/
│   │   │   ├── overview.json           # Eligibility, exclusions, FY changes
│   │   │   ├── schedules.json          # Schedule list + key fields
│   │   │   ├── scenarios.json          # Worked examples with tax computation
│   │   │   └── red-flags.json          # Common errors + validation failures
│   │   ├── itr2/  itr3/  itr4/  itr5/  itr6/  itr7/   # Same structure
│   ├── income-guides/
│   ├── deduction-guides/
│   ├── procedures/
│   ├── reference/
│   ├── decision-tree/
│   └── meta/
│
├── .github/
│   └── workflows/
│       └── deploy.yml                  # CI/CD — builds main, deploys to gh-pages
│
├── index.html                          # Source entry (always uses /src/main.jsx)
├── vite.config.js                      # base: '/ITR-Forms/'
├── tailwind.config.js
└── package.json
```

---

## 4. How FormPage Works (the 5-tab form detail)

`src/pages/forms/FormPage.jsx` is the most complex component. It:

1. Reads `:formId` from the URL (e.g. `itr1`, `itr2`).
2. Dynamically imports four JSON files:
   ```js
   import(`../../../data/forms/${formId}/overview.json`)
   import(`../../../data/forms/${formId}/schedules.json`)
   import(`../../../data/forms/${formId}/scenarios.json`)
   import(`../../../data/forms/${formId}/red-flags.json`)
   ```
3. Vite code-splits these at build time into separate chunk files
   (`overview-abc.js`, `schedules-xyz.js`, etc.) that are lazy-loaded per form.
4. Renders five tabs: **Overview · Applicability · Schedules Guide · Worked Examples · Red Flags**

### Adding a new form

1. Create `data/forms/itrX/overview.json` — must have at minimum: `formId`, `shortDescription`, `fyApplicable`, `ayApplicable`, `legalReference`, `eligibilityCriteria[]`, `exclusionCriteria[]`.
2. Create `schedules.json`, `scenarios.json`, `red-flags.json` (can be `{}` stubs initially).
3. Add the form to the sidebar list in `src/components/layout/Sidebar.jsx`.
4. Add it to the form grid on `src/pages/HomePage.jsx`.
5. Run `npm run build` — Vite auto-discovers the new JSON files via the dynamic import glob.

### Key icon import rule

`FormPage.jsx` uses icons from `lucide-react`. Every icon used in JSX **must** be listed
in the import at the top of the file. Missing icons cause a silent `ReferenceError` in
the production bundle which blanks out the affected tab entirely.

```js
// CORRECT — both User and Users are imported
import { ..., User, Users, ... } from 'lucide-react'
```

---

## 5. GitHub Actions Deploy Workflow

File: `.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [main]     # triggers on every push to main
```

**What it does, step by step:**

1. Checks out `main`.
2. Runs `npm ci` + `npm run build` → produces `dist/`.
3. Fetches the `gh-pages` branch.
4. Switches to `gh-pages`.
5. Deletes the old `assets/`, `index.html`, `favicon.svg`.
6. Copies fresh from `dist/`.
7. Commits and pushes to `gh-pages` with `[skip ci]` in the message
   (prevents an infinite trigger loop).

**Why `rm -rf assets` before copying is mandatory:**
`cp -rf dist/assets assets` on Linux, when `assets/` already exists,
copies *inside* it → `assets/assets/`. The `index.html` then references
`/ITR-Forms/assets/index-XYZ.js` but the file is at `assets/assets/index-XYZ.js` → 404 → blank page.

---

## 6. Manual Emergency Deploy

Use this when the live site is broken and you can't wait for CI.

```bash
# 1. Make sure you're on main and it's clean
git checkout main
git pull origin main

# 2. Restore index.html to source form (if it got overwritten)
#    It must have <script type="module" src="/src/main.jsx"></script>
#    NOT the hashed asset paths

# 3. Build
npm run build

# 4. Switch to gh-pages and deploy
git fetch origin gh-pages
git checkout gh-pages
rm -rf assets index.html favicon.svg
cp -rf dist/assets assets
cp -f dist/index.html index.html
cp -f dist/favicon.svg favicon.svg
git add assets/ index.html favicon.svg
git commit -m "Deploy: emergency manual deploy [skip ci]"
git push origin gh-pages

# 5. Return to main
git checkout main
```

After pushing, GitHub Pages CDN can take **1–5 minutes** to propagate.
Use **Cmd+Shift+R** (hard refresh) in the browser to bypass the local cache.

---

## 7. Routing

The app uses `HashRouter` (`#` in URLs) because GitHub Pages serves everything from
a single `index.html` and does not support server-side rewriting of clean URLs.

```
https://yashop698.github.io/ITR-Forms/#/           → HomePage
https://yashop698.github.io/ITR-Forms/#/forms/itr1 → FormPage (ITR-1)
https://yashop698.github.io/ITR-Forms/#/select      → DecisionTreePage
https://yashop698.github.io/ITR-Forms/#/downloads   → DownloadsPage
```

Do **not** switch to `BrowserRouter` — it will cause 404s on page refresh on GitHub Pages.

---

## 8. Vite Base Path

`vite.config.js` sets `base: '/ITR-Forms/'`. This means:
- All asset URLs in the built output are prefixed `/ITR-Forms/assets/...`
- The dev server runs at `http://localhost:5173/ITR-Forms/`
- This must match the GitHub Pages repo path (`/ITR-Forms/`)

If the repo is ever renamed, update `base` in `vite.config.js` before building.

---

## 9. Data File Schema Reference

### `overview.json` (minimum required fields)
```jsonc
{
  "formId": "ITR-1",
  "popularName": "Sahaj",
  "shortDescription": "...",
  "longDescription": "...",
  "fyApplicable": "2025-26",
  "ayApplicable": "2026-27",
  "legalReference": "Rule 12, Income-tax Rules 1962",
  "assesseeTypes": ["Resident Individual"],
  "mandatoryEfiling": true,
  "filingDeadline": "July 31, 2026",
  "incomeLimitTotal": 5000000,
  "hufApplicable": false,
  "hufNote": "...",
  "officialFormLink": "https://...",
  "residencyNote": "...",
  "eligibilityCriteria": [
    { "id": "EC-1", "criterion": "...", "detail": "...", "isInclusion": true }
  ],
  "exclusionCriteria": [
    { "id": "EX-1", "criterion": "...", "detail": "...", "consequence": "Use ITR-2" }
  ],
  "incomeHeadsAllowed": [
    { "head": "Salary/Pension", "section": "Sec 17", "details": "...", "schedule": "Schedule S" }
  ],
  "commonMisconceptions": ["..."],
  "fy202526Changes": [
    { "summary": "...", "detail": "...", "isNewForFY202526": true }
  ]
}
```

### `schedules.json`
```jsonc
{
  "formId": "ITR-1",
  "totalSchedules": 7,
  "note": "...",
  "schedules": [
    {
      "scheduleId": "Schedule S",
      "scheduleName": "Details of Income from Salary",
      "isCompulsory": true,
      "compulsoryCondition": "Always — for salaried taxpayers",
      "description": "...",
      "keyFields": [
        { "fieldId": "S1", "fieldName": "Gross Salary", "fieldType": "Amount", "notes": "..." }
      ],
      "crossReferences": ["Schedule TDS1"],
      "commonMistakes": ["..."]
    }
  ]
}
```

### `scenarios.json`
```jsonc
{
  "formId": "ITR-1",
  "scenarios": [
    {
      "scenarioId": "SC-1",
      "title": "Salaried employee, new regime",
      "complexity": "basic",
      "tags": ["salaried", "new-regime"],
      "taxpayerProfile": {
        "name": "Priya Sharma", "age": 32, "status": "Individual",
        "occupation": "Software Engineer", "regimeChoice": "New Regime",
        "incomes": { "grossSalary": 800000 }
      },
      "schedulesToFill": [
        { "scheduleId": "Schedule S", "compulsory": true, "notes": "..." }
      ],
      "taxComputation": {
        "regime": "new",
        "grossTotalIncome": 800000,
        "deductions": 0,
        "taxableIncome": 800000,
        "taxBreakdown": [
          { "slabFrom": 0, "slabTo": 400000, "rate": 0, "taxAmount": 0 },
          { "slabFrom": 400000, "slabTo": 800000, "rate": 5, "taxAmount": 20000 }
        ],
        "totalBaseTax": 20000,
        "surcharge": 0,
        "cess": 800,
        "grossTaxLiability": 20800,
        "rebate87A": 20800,
        "rebate87AApplicable": true,
        "netTaxAfterRebate": 0,
        "tdsCredited": 0,
        "advanceTaxPaid": 0,
        "netPayableOrRefund": 0
      },
      "redFlagsInScenario": ["..."],
      "commonMistakesToAvoid": ["..."]
    }
  ]
}
```

### `red-flags.json`
```jsonc
{
  "formId": "ITR-1",
  "redFlags": [
    {
      "id": "RF-1",
      "title": "Mismatch between Form 16 and AIS",
      "severity": "critical",
      "description": "...",
      "consequence": "Defective return notice u/s 139(9)",
      "correction": "...",
      "howToDetect": "...",
      "howToAvoid": "...",
      "legalReference": "Section 139(9)"
    }
  ],
  "validationErrors": [
    {
      "errorCode": "ERR-001",
      "errorMessage": "...",
      "cause": "...",
      "resolution": "..."
    }
  ]
}
```

---

## 10. Known Pitfalls — Do Not Repeat

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Missing lucide-react icon import | Specific tab blank, `ReferenceError: X is not defined` in console | Add the icon name to the `import { ... } from 'lucide-react'` line in `FormPage.jsx` |
| Built `index.html` committed to `main` | `npm run build` fails: "Rollup failed to resolve import `/ITR-Forms/assets/index-XYZ.js`" | Restore `index.html` to use `<script type="module" src="/src/main.jsx">` |
| `cp -rf dist/assets assets` without `rm -rf assets` first | Entire page blank, 404 on JS bundle | Always `rm -rf assets` before the `cp` — Linux nests the dir inside itself if it already exists |
| Pushing fixes to `main` thinking it deploys | Live site unchanged | Changes to source only go live after GitHub Actions completes AND pushes to `gh-pages` |
| Stale `index.html` cached by browser | Page loads old bundle even after deploy | Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows) |
| Switching to `BrowserRouter` | 404 on direct URL or refresh | Must use `HashRouter` for GitHub Pages; no server-side rewrite is available |

---

## 11. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Routing | react-router-dom v6 (HashRouter) |
| Styling | Tailwind CSS v3 + custom CSS tokens in `index.css` |
| Icons | lucide-react |
| Data | Static JSON files, Vite dynamic imports (code-split per form) |
| Deployment | GitHub Pages (gh-pages branch) via GitHub Actions |
| Node | 20 (specified in deploy workflow) |
