# AI Client Onboarding System — Extended

> An autonomous AI discovery agent for digital agencies: adaptive client interviews, strategic risk analysis, cost estimation, and project sync.

This project is a modified, extended version of [**AI Client Onboarding System**](https://github.com/Ismail-2001/AI-Client-Onboarding-System) by **Ismail Sajid** ([@Ismail-2001](https://github.com/Ismail-2001)), used and redistributed here under the terms of its MIT License. The original author's copyright notice is preserved unmodified in [LICENSE](LICENSE).

**This repository does not claim to be the original creation of its maintainer.** It is a derivative work: the base React/TypeScript application, the three onboarding flows, the local "AI Agency Brain" scoring logic, and the DeepSeek/ClickUp integrations are Ismail Sajid's; the items listed below are additions built on top of that base.

---

## What This Project Does

A branded, multi-step interview wizard that replaces manual client discovery calls for digital agencies: adaptive questions per service type (Website / Branding / Automation), automatic risk detection, an AI-generated project analysis and cost estimate, and a one-click sync to ClickUp.

## What Was Changed vs. the Original

### 1. Real PDF export (`src/utils/pdfGenerator.ts`)
The original's "Print / Save PDF" button was just `window.print()` — whatever the browser's print dialog happened to render, with no control over layout. This fork adds a real, branded PDF generator (via `jsPDF`) that produces a structured discovery brief (client profile, scope, risks, strategic insights, next steps) as an actual downloadable `.pdf` file. This was an explicitly unimplemented item on the original's own roadmap ("Phase 2: PDF Export").

### 2. Real email delivery (`netlify/functions/send-summary-email.js`, `src/services/emailApiService.ts`)
The original's `emailService.ts` only built a `mailto:` link — it required the user's own email client to be configured and open, and did not actually send anything. This fork adds a genuine send path: a new Netlify Function proxies to the [Resend](https://resend.com) API (API key stays server-side, same security pattern as the existing `deepseek-agent.js`/`clickup-sync.js` functions) so summaries can be delivered directly to the agency team with one click, with an error message on the button if delivery fails. The mailto: option is kept as-is alongside it.

### 3. Test suite (`src/utils/*.test.ts`)
The original had no automated tests. This fork adds a Vitest suite covering the two "intelligence" modules — `aiAgencyBrain` (confidence scoring, insight generation) and `summaryGenerator` (risk detection) — plus the new PDF section-building logic. The PDF renderer itself is split into a pure data-shaping function (`buildBriefSections`, tested directly) and a thin `jsPDF`-calling wrapper, so tests don't need a canvas/DOM environment.

### 4. `.env.example` added
The original README documented a `cp .env.example .env` setup step, but no `.env.example` file actually existed in the repository. This fork adds one, including the new `RESEND_*`/`AGENCY_TEAM_EMAIL` variables.

### Not carried over
`PROGRESS.md` and `project_requirements.md` from the source repo were internal build-session logs and specification drafts rather than user-facing documentation, so they weren't copied into this repository.

---

## Tech Stack

React 19, TypeScript, Vite, Netlify Functions, DeepSeek AI, ClickUp API, Resend (new), jsPDF (new), Vitest (new).

## Installation & Setup

```bash
git clone <this-repo-url>
cd ai-client-onboarding-extended/client-onboarding
npm install
cp .env.example .env
```

Fill in `.env` with your own API keys (DeepSeek required for AI features; ClickUp and Resend optional for local dev — the corresponding buttons will show a configuration error if unset).

```bash
npm run dev        # http://localhost:5173
```

To exercise the Netlify Functions locally (ClickUp sync, DeepSeek proxy, email send):

```bash
npm install -g netlify-cli
netlify dev
```

## Testing

```bash
npm test
```

## Building

```bash
npm run build
```

## Deployment

Deploys to Netlify exactly as documented for the original project — set **Base directory** to `client-onboarding`, and add `VITE_DEEPSEEK_API_KEY`, `VITE_CLICKUP_API_KEY`, `VITE_CLICKUP_LIST_ID`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `AGENCY_TEAM_EMAIL` as environment variables in Site Settings.

## License

MIT License — see [LICENSE](LICENSE). Original work by Ismail Sajid. Modifications in this repository are made available under the same license.

## Attribution

- **Original project & architecture:** [Ismail Sajid](https://github.com/Ismail-2001) — [AI-Client-Onboarding-System](https://github.com/Ismail-2001/AI-Client-Onboarding-System)
- **Extended by:** [Sami123d](https://github.com/Sami123d)
