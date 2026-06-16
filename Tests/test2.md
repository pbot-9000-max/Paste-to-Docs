# **Faraday Acquisition Demo: Plan, Sub-goals, Flow and Engineering Requirements**

**Goal:** Acquire ChangelogAI (a $2,100 MRR B2B SaaS) at **1.5× ARR** and grow it to **$5,000+ MRR within 14 weeks**, with a **$42,500 total all-in budget** (acquisition + operating costs)

**Timeline note:** Weeks 1–2 cover the full acquisition lifecycle: listing screening, due diligence, negotiation, and deal close. Asset transfer and stabilization run through Weeks 3–4. The 90-day growth clock starts at deal close (end of Week 2). The base case reaches $4,600 MRR by Week 14; the stretch target of $5,000+ MRR is achievable by Week 13 in the optimistic scenario.

**The product:** ChangelogAI is a B2B SaaS tool that connects to a GitHub repository and auto-generates user-facing changelogs and release notes from commit history and PR descriptions. It publishes these to a hosted public changelog page and sends a weekly digest email to that page's subscribers. The founder — a solo developer — built it 19 months ago, acquired 47 paying customers entirely through organic word-of-mouth on HackerNews and GitHub discussions, and has made zero deliberate marketing effort since. Monthly gross margin is 87% (infrastructure cost: ~$270/month on Vercel). The listing has been on TrustMRR for 68 days. Stripe-verified MRR is $2,100. Asking price is $38,000.

 

## **1\. Plan**

### **The Acquisition Thesis**

ChangelogAI is textbook distressed micro-SaaS. The rubric scores it 74/100 Overall (Acquirability: 72, Demo Suitability: 76) — the top-ranked candidate from a universe of 1,746 live TrustMRR listings.

* **Sound product, zero distribution:** 47 customers on word-of-mouth alone is proof of genuine product-market fit. Every one of them sought ChangelogAI out unprompted. No marketing has ever been attempted.

* **Pricing arbitrage:** $45/month is significantly below market. Beamer, Headway, and Changemap — all direct competitors — charge $49–$79/month. New customers will accept $69/month with no measurable drop in conversion.

* **Free money in the dunning gap:** The founder never configured Stripe Billing retry logic. Approximately $200–250/month in MRR is leaking to failed payments with zero retry attempts. This is recoverable within the first week post-close with no engineering work.

* **One obvious feature backlog item:** 12 of the 47 existing customers have requested a Slack digest notification — a formatted Slack message sent to a team channel whenever a changelog is published. It unlocks team-level product adoption within existing orgs. It has sat unbuilt for 6 months. Faraday's Engineering Agent ships it in Week 9.

* **Clean technical stack:** Next.js 14, PostgreSQL via Prisma, Vercel — the optimal architecture for autonomous AI agent feature development, CI/CD deployment, and programmatic SEO page generation.

 

### **Unit Economics**

**Pre-acquisition (ChangelogAI today):**

* Active subscribers: **47** at $45/month
* Verified MRR: **$2,100**
* Monthly gross margin: **87%** (infrastructure cost ~$270/month)
* Estimated monthly gross churn: ~3.5% (~1.6 customers/month lost)
* Estimated involuntary churn share: ~22% of cancellations are failed payments with no retry logic
* LTV at current churn rate: 28.6 months × $45 = **$1,286 per customer**

**Post-acquisition target:**

* MRR target: **$5,000+ (stretch)** / **$4,600 (base case)** by Week 14
* Blended ARPU target: ~$62 (mix of grandfathered $45, new at $69, Pro tier at $149)
* Active subscriber target: ~80 (stretch) / ~74 (base case)
* Monthly churn target: **<3%** with dunning and lifecycle emails active by Week 5

**Budget breakdown:**

| Item | Amount |
| :---- | :---- |
| Acquisition price (held via Escrow.com; 15% holdback released at Day 60) | $38,000 |
| Infrastructure — Vercel, Postgres (14 weeks) | $380 |
| Tooling — Ahrefs API, Apify, Instantly, ActiveCampaign, PostHog | $900 |
| Growth spend — outbound data enrichment, Apollo credits, Product Hunt prep | $2,400 |
| Legal — APA template review (standardized boilerplate) | $400 |
| Contingency (Orchestrator allocates at Week 9 ROI review) | $420 |
| **Total** | **$42,500** |

 

### **ICP**

| Priority | Segment | Why |
| :---- | :---- | :---- |
| Primary | Engineering leads and CTOs at seed–Series B B2B SaaS companies (10–100 employees) with active GitHub repos and customer-facing product releases | Highest willingness to pay, strong "we ship but customers never know" pain, highly targetable via GitHub API-sourced company data enriched with decision-maker emails |
| Secondary | Developer tools and API-first companies who release updates to external developers and need structured, versioned changelogs | High ARPU potential (API changelog = near-compliance need), respond well to technical demo content, concentrated in developer communities |
| Tertiary | Indie developers and solopreneurs who shipped a SaaS product and want to retain users by communicating product progress | Large addressable pool, very active on HackerNews and r/SaaS, low CAC via organic community engagement |

Core pain point across all three segments: engineering teams ship features that customers never hear about, leading to churn from users who think the product is stagnant — even when the team is shipping weekly. Outreach copy leads with this.

 

### **Channel Strategy and Budget**

| Channel | Budget | Mechanism | Target New MRR |
| :---- | :---- | :---- | :---- |
| Cold email outbound | $1,200 | Apify scrapes GitHub for B2B SaaS repos (active commits, 5–100 contributors); Apollo enriches with decision-maker emails; Instantly runs 3-email developer-focused sequence, scaling from 200/day (W7) to 1,000/day (W10+) | $1,400 |
| Developer community organic | $0 | HackerNews Show HN relaunch with meta-narrative angle, 5 high-value replies/day on r/devtools and r/SaaS, GitHub Discussions engagement, X developer audience (3 posts/week) | $600 |
| Product Hunt launch | $0 | Full PH launch with assets, maker Q&A, 2-week community warm-up pre-launch. Target: 200+ upvotes | $400 |
| SEO comparison content | $400 | 15 "ChangelogAI vs [Beamer/Headway/Changemap/LaunchNotes]" pages + 10 long-tail "how to write release notes for X" pages generated and deployed programmatically. Bottom-of-funnel, high-intent searches | $300 |
| Dunning recovery | $0 | Stripe Billing retry logic configured on Day 1 post-close — recovers ~$200–250/month in MRR currently leaking to failed payments with no retry | +$225 (recovered MRR) |
| Contingency | $400 | Orchestrator allocates at Week 9 ROI review to best-performing channel | TBD |
| **Total** | **$2,000** | | **~$2,900 new MRR** |

**Budget constraints:**

* Outbound data enrichment is capped at $1,200 total across the growth sprint
* Any single spend decision above $500 requires human approval before execution
* The contingency $420 is not pre-committed; Orchestrator allocates it at the Week 9 ROI review based on CPA and conversion rate data across channels

 

### **Week-by-Week MRR Trajectory**

Monthly churn of ~3% (0.75%/week) applied to the existing retained base at the end of each period. Transition churn of ~7% modeled in Weeks 3–4 due to ownership announcement. Dunning recovery of ~$225/month credited as recovered MRR from Week 3. New customers acquired in a given period are not yet subject to churn.

| Period | Event | New MRR Added | Churn From Base | Retained MRR |
| :---- | :---- | :---- | :---- | :---- |
| W1–2 | Acquisition phase — no growth ops active | $0 | −$74 (natural) | $2,027 |
| W3–4 | Asset transfer, stabilization, dunning live | +$225 (dunning recovery) | −$142 (transition churn ~7%) | $2,110 |
| W5–6 | Pricing live ($69 new), lifecycle emails active, outbound infra building | +$207 (3 new at $69) | −$63 | $2,254 |
| W7–8 | Cold outbound live, Product Hunt launch | +$828 (12 new at $69) | −$68 | $3,014 |
| W9–10 | Full outbound velocity, Slack digest feature ships | +$966 (14 new at $69) | −$90 | $3,890 |
| W11–12 | Pro tier launches ($149/mo), SEO traffic emerging | +$746 (6 Pro upgrades + 4 new at $69) | −$117 | $4,519 |
| W13–14 | Sustained operations, upsell campaigns | +$620 (9 new, mix of tiers) | −$136 | $5,003 |

Total gross new MRR added in growth sprint (Weeks 3–14): **$3,592**. After cumulative churn: **$5,003 MRR** (stretch scenario). Base case — moderate transition churn (12%), slower outbound ramp: **$4,600 MRR by Week 14**.

 

### **Contingency Triggers**

**Week 4:** If transition churn exceeds 12% of the subscriber base (more than 6 customers cancel within 14 days of the ownership announcement), Orchestrator immediately activates a "grandfathered pricing lock" campaign: a personal plain-text email from the new owner offering a 1:1 product call and reaffirming that pricing is locked forever. If churn stays below 7%, the standard lifecycle sequence proceeds without escalation.

**Week 7 (Pricing Gate):** The trial-to-paid conversion rate at the $69 price point is the primary financial go/no-go gate. If conversion falls below 8% by the end of Week 7, Orchestrator reverts the new-customer price to $55/month (a softer step-up) and recalculates the MRR trajectory accordingly. If conversion holds above 12%, the $420 contingency is allocated to double outbound data enrichment volume.

**Week 9 (Channel ROI Review):** Full cross-channel ROI report produced. Orchestrator allocates contingency budget to the best-performing channel:

* If cold email CPA is below $140: scale daily send volume to 1,200/day with an additional Instantly sending domain
* If Product Hunt organic tail is strong (>$500 MRR from PH-attributed signups in the 30 days post-launch): submit to BetaList and commission 5 additional HackerNews-targeted posts
* If SEO comparison pages are ranking on Page 1 for any target keyword: commission 10 additional long-tail pages

Any contingency reallocation above $500 is escalated to the human operator for approval before execution.

 

## **2\. Sub-goals**

Sub-goals are organized across five workstreams spanning two macro-phases: **Acquisition** (Weeks 1–4) and **Growth** (Weeks 5–14). Each sub-goal is atomic: one channel, one function, or one phase of a loop. Faraday may create additional sub-goals during execution as conditions arise; these 26 are the pre-defined representative set. Growth workstream sub-goals are blocked from activating until SG06 (APA Execution) is marked complete by the human operator.

**Type definitions:**

* **Outcome:** Has a clear target or completion condition. Shows a progress bar toward a metric.
* **Ongoing:** A continuous loop with no end state. Shows health indicators.

**Workstreams:** Acquisition (teal), Stabilization (orange), Growth (blue), Product (purple), Support (green)

 

### **Sub-goal Table**

| \# | Sub-goal | Type | Workstream | KPI / Done When | Owning Agents | Depends On | Start |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **SG01** | Target Universe Screening | Outcome | Acquisition | Rubric applied to 1,700+ TrustMRR listings; shortlist of 5 candidates ranked by Overall Score produced and presented to user; ChangelogAI approved as primary target | Acquisition Agent | None | W1 |
| **SG02** | Primary Target Outreach | Outcome | Acquisition | Personalized outreach email sent to ChangelogAI founder via Acquire.com inbox; response received; NDA executed via DocuSign | Acquisition Agent | SG01 | W1 |
| **SG03** | Financial Due Diligence | Outcome | Acquisition | Stripe MRR verified via read-only Sigma API (net of paused, past-due, canceled); verified MRR within 5% of listed amount; refund rate <0.5% confirmed; involuntary churn rate and dunning gap documented | Due Diligence Agent | SG02 | W1–2 |
| **SG04** | Technical Due Diligence | Outcome | Acquisition | GitHub codebase audit complete: npm audit shows 0 critical CVEs; GitHub Actions CI/CD pipeline active; test coverage >40%; infrastructure cost verified via Vercel billing export at ~$270/month; 3 undocumented environment variables flagged for APA seller support provision | Due Diligence Agent | SG02 | W1–2 |
| **SG05** | Valuation Model and LOI | Outcome | Acquisition | ARR multiple confirmed at 1.5× ($38,000); LOI drafted with 15% holdback clause ($5,700 held 60 days), 15-hour asynchronous seller support provision, and standard indemnification; LOI dispatched after human approval | Acquisition Agent, Orchestrator | SG03, SG04 | W2 |
| **SG06** | APA Negotiation and Execution | Outcome | Acquisition | APA reviewed and signed by human operator; Escrow.com funded ($32,300 immediate + $5,700 holdback); deal confirmed closed | Human (mandatory gate) | SG05 | W2 |
| **SG07** | Asset Transfer — GitHub and Vercel | Outcome | Acquisition | GitHub repository ownership transferred to buyer account; CI/CD pipeline tested and verified on buyer's Vercel project; Engineering Agent confirms clean deployment | Transfer Agent | SG06 | W3 |
| **SG08** | Asset Transfer — Stripe Subscriptions | Outcome | Acquisition | 47 active subscriptions migrated to buyer Stripe account via API batch script using `billing_mode=flexible`; all 47 statuses confirmed `active` post-production run; no double-charges; legacy webhooks disabled | Transfer Agent (human approval gate on production run) | SG06 | W3 |
| **SG09** | Asset Transfer — DNS and Hosting | Outcome | Acquisition | DNS transferred to buyer Cloudflare account; Vercel deployment live and confirmed healthy; downtime window <4 hours; BetterUptime pinging live post-transfer | Transfer Agent (human executes DNS) | SG07 | W3 |
| **SG10** | Uptime and Observability Setup | Outcome | Stabilization | BetterUptime external pinging configured; PostHog events instrumented for: GitHub repo connected, first changelog published, subscriber added, payment succeeded, payment failed; error rate alert threshold set at 2% over 5-minute window | Engineering Agent | SG07, SG09 | W3 |
| **SG11** | Dunning Infrastructure | Outcome | Stabilization | Stripe Billing retry logic configured (Day 3, 7, 14); ActiveCampaign dunning email sequence live (3 emails: action required, payment failed reminder, final access warning); estimated $200–250/month in previously unrecovered MRR restored | Support Agent | SG08 | W3–4 |
| **SG12** | Customer Announcement and Churn Defense | Outcome | Stabilization | Announcement email sent to all 47 subscribers within 48 hours of Stripe migration close; grandfathered pricing guarantee explicitly stated ("your $45/month plan is locked forever"); open rate >50%; transition churn monitored daily; escalation triggered if >6 cancellations in first 14 days | Support Agent | SG08 | W3–4 |
| **SG13** | Codebase Audit and Technical Debt Map | Outcome | Stabilization | Engineering Agent maps full architecture; all environment variables documented and rotated to buyer-controlled values; legacy cron job for weekly digest email verified and migrated to Vercel Cron; risk-ranked issue list produced; zero code pushed to production | Engineering Agent | SG07 | W3–4 |
| **SG14** | ICP Research and Outbound Lead List | Outcome | Growth | 3,000+ intent-qualified leads scraped via Apify from GitHub (B2B SaaS repos: 5–100 contributors, active commits in trailing 90 days, linked domain has Stripe checkout); enriched with engineering lead and CTO emails via Apollo; segmented into 3 ICP tiers by company size and GitHub commit velocity | Research Agent | SG04 | W4–5 |
| **SG15** | Cold Email Infrastructure Setup | Outcome | Growth | 4 outbound domains registered with DMARC/DKIM/SPF; Instantly warm-up at 30–40 emails/day; first 2 domains ready for cautious outreach (50/day) by W6; remaining 2 domains at full send by W9 | Outbound Agent | SG14 | W4–5 |
| **SG16** | Pricing Experiment | Outcome | Growth | New-customer price updated to $69/month in Stripe and on the checkout page; existing 47 subscribers remain grandfathered at $45/month; trial-to-paid conversion rate tracked weekly from W5; gate: if conversion <8% at end of W7, revert to $55/month | Product Agent, Engineering Agent | SG09 | W5 |
| **SG17** | Lifecycle Email Configuration | Outcome | Growth | 6 PostHog-triggered sequences live in ActiveCampaign: (1) signup → GitHub connect prompt, (2) GitHub connected → first changelog walkthrough, (3) first changelog published → subscriber import guide, (4) 7-day inactivity → re-engagement with setup offer, (5) 80% of monthly changelog limit → upgrade CTA, (6) weekly digest → changelog performance summary for active users | Support Agent | SG11 | W5 |
| **SG18** | Cold Email Outbound Campaign | Ongoing | Growth | Daily send volume: 100/day (W6) → 300/day (W7) → 600/day (W9) → 1,000/day (W10+); open rate >35%; reply rate >3%; freemium signups per week from email UTM; cost-per-paying-customer <$150 | Outbound Agent | SG15 | W6 |
| **SG19** | Developer Community Organic Engagement | Ongoing | Growth | HackerNews Show HN relaunch executed W6; 5 high-value replies/day on r/devtools, r/SaaS, GitHub Discussions; X developer account 3 posts/week (changelog culture, release note templates, developer communication); monthly organic signups tracked by UTM per platform | Outbound Agent, Creative Agent | None | W5 |
| **SG20** | Product Hunt Launch | Outcome | Growth | Launch assets prepared (tagline, screenshots, maker Q&A, first comment drafted); account active with 2 weeks of community activity pre-launch; launch executed W7; Outbound Agent responds to all comments within 30 minutes on launch day; target: 200+ upvotes, 15+ paid conversions within 7 days | Outbound Agent, Creative Agent | SG19 | W7 |
| **SG21** | SEO Comparison Content Engine | Ongoing | Growth | 15 "ChangelogAI vs [Beamer/Headway/Changemap/LaunchNotes/Olvy]" comparison pages + 10 "how to write release notes for [audience]" long-tail pages generated and deployed to Vercel-hosted routes; Ahrefs keyword ranking tracking active; first organic traffic from comparison pages detected by W10 | SEO Agent, Creative Agent | SG09 | W6 |
| **SG22** | Product Analytics and Insight Generation | Ongoing | Product | Weekly insight report produced every Monday: activation rate (GitHub connected within 7 days of signup), changelogs published per active user per week, top 5 support ticket categories, DAU/WAU, churn signals, trial-to-paid conversion at current price | Product Agent | SG10 | W5 |
| **SG23** | Slack Digest Feature — Spec, Build, and Ship | Outcome | Product | Feature spec written (triggered by Week 5 insight report showing 12 customer requests); UI mockup approved by Product Agent; Slack OAuth flow implemented; `changelog.published` webhook triggers Slack message to configured channel; unit tests passing; PR reviewed by human engineer; deployed to production by W9 | Product Agent, Engineering Agent | SG22 | W5–9 |
| **SG24** | Pro Tier Pricing Architecture | Outcome | Product | Pro tier ($149/month) defined: includes Slack digest, custom branding (remove ChangelogAI logo from hosted page, add customer logo), and up to 10 GitHub repo connections (vs. 1 on Starter); Stripe products and Checkout session configured; in-app upgrade CTA live; landing page Pro tier section updated; launched W11 | Product Agent, Engineering Agent | SG23 | W9–11 |
| **SG25** | Customer Support Operations | Ongoing | Support | Gmail inbox monitored every 30 minutes via IMAP; first response time <4 hours; bug reports filed to GitHub Issues with reproduction steps within 1 hour; feature requests logged to Product Agent backlog with customer email and current plan tier same day | Support Agent | SG11 | W3 |
| **SG26** | Churn Prevention and Retention | Ongoing | Support | Monthly churn <3% from W5 onwards; users who have not published a changelog within 14 days of signup flagged as at-risk and sent activation nudge within 24 hours of detection; exit survey dispatched on all confirmed cancellations (2-question plain-text email); exit survey responses logged to Product Agent backlog weekly | Support Agent | SG17 | W5 |

 

### **Notes on Key Sub-goals**

**SG01 is the demo's opening "wow" moment for VCs.** Acquisition Agent applies the full rubric in real time across 1,700+ live TrustMRR listings, surfaces ChangelogAI as the top-ranked candidate, and presents a scored shortlist with deal rationale and financial summary per candidate. The entire process runs without human input until the shortlist presentation.

**SG03 and SG04 run in parallel and are fully autonomous.** Due Diligence Agent verifies Stripe MRR via read-only Sigma API and audits the GitHub codebase via dependency scanners and commit history analysis. The only human touchpoint is reviewing the synthesized DD report before SG05. The involuntary churn gap detection in SG03 — showing $200–250/month in unrecovered MRR — is a key demo beat: Faraday identifies free money the founder never knew was leaking.

**SG06 is a mandatory human gate with no exceptions.** The APA is a legally binding, irreversible financial commitment. Orchestrator blocks all Growth workstream sub-goals until the human operator confirms execution and Escrow.com is funded.

**SG08 has a mandatory human approval gate on the Stripe production migration run.** Transfer Agent authors the migration script and runs it in full against Stripe Sandbox, simulating 60 days of renewals using Stripe test clocks. Human reviews sandbox logs and explicitly authorizes the production run. The failure mode — double-charging 47 customers — is existential for the product's reputation.

**SG09 requires human execution for DNS transfer.** Domain transfers require registrar two-factor authentication and ICANN lock removal that cannot be automated. Downtime window is scheduled for Saturday 02:00 UTC to minimize impact. Engineering Agent monitors uptime via BetterUptime throughout the window.

**SG11 (Dunning) is the highest-leverage first week action.** Before any growth initiative goes live, Faraday recovers $200–250/month in MRR that the founder has been silently losing. In the demo, this is shown in the Week 3 Orchestrator dashboard as "MRR recovered by agent action: $225" — a clean illustration of AI-operated asset management.

**SG16 is the primary financial lever and the Week 7 decision gate.** A $24/month ARPU increase ($45 → $69) on all new subscribers, with zero impact on existing customers. If trial-to-paid conversion holds above 12%, the entire 14-week MRR trajectory improves by ~$800 above base case.

**SG23 is the demo's engineering agent showcase.** Faraday's Engineering Agent writes the Slack digest feature on a feature branch, runs the existing test suite, opens a PR with implementation notes and rollback steps, and waits for human PR review and merge approval. No autonomous production deployment. This demonstrates the full engineering loop with proper human oversight — critical for the VC audience.

**SG01, SG03, SG11, SG16, and SG23 are the five moments that define the demo arc:** screening, financial validation, free-money recovery, pricing leverage, and product shipping — each executed autonomously, each with a clear human gate at the right decision point.

 

## **3\. Demo Flow**

### **Phase 0: Goal Setup (Day 0)**

User enters goal in Faraday:

> "Acquire a micro-SaaS in the $1,500–$3,000 MRR range, paying no more than $40,000, and grow it to $5,000 MRR within 90 days of deal close. Prioritize Stripe-billed B2B SaaS with modern tech stacks and no paid marketing history. Total budget including acquisition: $42,500."

Orchestrator runs constraint capture before spawning any agents:

* What is the maximum acquisition price? (confirmed: $40,000 hard cap)
* What is the post-close operating budget? (confirmed: $2,500 over 90 days for growth spend)
* Are there category or geography restrictions? (confirmed: no mobile-only apps, no RevenueCat-only billing, prefer US/EU/UK-based assets)
* What is the minimum MRR to consider? (confirmed: $1,500 floor, $3,500 upper ceiling before price risk)
* What is the preferred technical stack? (confirmed: hard reject legacy PHP, undocumented no-code platforms; prefer Next.js, Node.js, PostgreSQL)
* What autonomy mode? (default: Full Auto; spend decisions above $500, legal agreements, Stripe migration production runs, and production deployments require human approval)

On user confirmation: Orchestrator creates the 26 sub-goals, spawns Acquisition Agent, begins Phase 1. All Growth, Product, and Support agents remain idle until SG06 is complete.

 

### **Phase 1: Target Screening and Shortlisting (Days 1–5, Weeks 1–2)**

Acquisition Agent executes using Apify (TrustMRR and Acquire.com scraping) and the pre-configured acquisition rubric.

**Listing scan (SG01):**

* Apify scrapes TrustMRR and Acquire.com hourly; Acquisition Agent parses all available fields against the rubric scoring model
* Rubric applies 6 dimensions: Financial Fit, Deal Economics, Growth Potential, Automation Compatibility, Risk Profile, and Demo Narrative Quality
* 1,746 listings scored; 14 pass all hard disqualifiers; 5 ranked STRONG BUY
* ChangelogAI surfaces as the #1 ranked candidate: Overall Score 74/100, Acquirability 72, Demo Suitability 76. Key strengths flagged by rubric: Stripe-billed, 19-month business age, 87% margin, 68 days listed (motivated seller), 0 ARR multiple flag (distressed at 1.5×), and clear B2B developer audience
* Orchestrator presents ranked shortlist to user: each candidate shown with overall score, dimension breakdown, key strengths, key risks, and a one-paragraph deal rationale

**Orchestrator approval gate:**

* User reviews top 5 candidates and approves ChangelogAI as primary target
* On approval: Acquisition Agent initiates outreach (SG02). Candidates 2–5 are placed in standby watchlist in case the ChangelogAI deal falls through.

**Outreach (SG02):**

* Acquisition Agent drafts a personalized founder-to-founder outreach email: references the specific GitHub integration architecture, acknowledges the quality of the 47-customer base, and positions the buyer as an operator who can give ChangelogAI the distribution it has never had
* Email sent via Acquire.com inbox; founder responds within 36 hours expressing interest; NDA executed via DocuSign API integration

 

### **Phase 2: Due Diligence and Deal Execution (Days 5–14, Weeks 2–3)**

Runs in parallel across Due Diligence Agent. Orchestrator gates the LOI until both SG03 and SG04 are complete.

**Financial due diligence (SG03):**

* Founder grants read-only Stripe API access; Due Diligence Agent queries Stripe Sigma
* Agent calculates verified net MRR by summing active subscription items and netting out past-due, trialing, paused, and canceled statuses
* Verified net MRR: **$2,094** (within 0.3% of listed $2,100 ✓)
* Refund and chargeback rate: **0.3%** ✓
* Annual vs. monthly subscription mix: 100% monthly (flag: no revenue predictability lock — noted in DD summary but acceptable given pricing headroom)
* Involuntary churn detected: **22% of all cancellations are failed payments with zero retry logic** — flagged as immediate post-close opportunity
* Customer concentration: largest single customer = $45/month (2.1% of MRR) ✓ — no concentration risk

**Technical due diligence (SG04):**

* Founder grants temporary read-only GitHub repo access
* Due Diligence Agent runs `npm audit`: 0 critical CVEs ✓
* `.github/workflows` directory confirms GitHub Actions CI/CD pipeline is active and passing ✓
* Test coverage estimated at 41% via test file analysis — flag noted (below 60% ideal), but sufficient for near-term autonomous feature work with human PR review gate
* Package.json confirms: Next.js 14, PostgreSQL via Prisma, all core dependencies current ✓
* Vercel billing export confirms infrastructure cost at **$267/month (87% gross margin)** ✓
* 3 hardcoded environment variable values identified in production code — flagged for mandatory rotation post-close and seller disclosure in APA

**Valuation and LOI (SG05):**

* Due Diligence Agent calculates: $38,000 / ($2,094 × 12) = **1.51× ARR** — within target distressed range ✓
* SDE calculation: $2,094 MRR × 12 months × 87% margin = $21,860 annual SDE → $38,000 purchase price = **1.74× SDE** — appropriate for a flat-MRR asset
* Orchestrator presents full DD summary to user for review: financial verification, technical health scorecard, flagged risks, and proposed APA terms
* LOI terms: Purchase price $38,000; 15% holdback ($5,700 in Escrow.com for 60 days); 15 hours of asynchronous seller support over 30 days; standard indemnification (pre-acquisition data breaches, IP claims, pending litigation)
* User approves LOI → Acquisition Agent sends to founder → accepted the same day

**APA execution (SG06) — Human required:**

* Standardized APA populated by Acquisition Agent with all DD findings incorporated; human reads and signs
* Escrow.com funded: $32,300 immediate transfer to seller + $5,700 holdback held pending 60-day MRR stability check
* Deal confirmed closed: **end of Week 2**

 

### **Phase 3: Asset Transfer and Stabilization (Days 14–28, Weeks 3–4)**

Highest-risk phase of the entire lifecycle. Orchestrator maintains a transfer checklist and blocks all Growth sub-goals from activating until SG07, SG08, and SG09 are all confirmed complete.

**GitHub and Vercel transfer (SG07):**

* Repository ownership transferred to buyer GitHub organization in under 1 hour
* Vercel project relinked to buyer account; CI/CD pipeline tested with a non-breaking dry-run commit to the staging branch
* Engineering Agent confirms deployment pipeline is clean before any other work proceeds

**Stripe migration (SG08) — Human approval gate on production run:**

* Transfer Agent authors a Node.js batch migration script using Stripe API
* Script logic: creates new Product and Price objects in buyer Stripe account to match the legacy $45/month plan; maps 47 existing customers' `pm_` payment method tokens to new subscriptions using `billing_mode=flexible` (suppresses automatic proration invoices during import); legacy webhook listeners disabled before script runs
* Agent runs full migration in **Stripe Sandbox** using test clocks, simulating 60 days of renewals — all 47 subscriptions process with correct amounts and no double-charges confirmed
* Orchestrator presents full sandbox run logs to human for review
* **Human explicitly authorizes production run** — no exceptions, no autonomous execution
* Production run executed; all 47 subscription statuses confirmed `active` within 30 minutes; no failed renewals or duplicate charges detected

**DNS transfer (SG09) — Human executes:**

* Scheduled for Saturday 02:00 UTC to minimize customer impact
* Human transfers domain to buyer-controlled Cloudflare account via registrar push
* Engineering Agent monitors BetterUptime continuously during propagation window
* Downtime: 2.5 hours; all customers notified of "scheduled infrastructure upgrade" 48 hours in advance via Support Agent email

**Stabilization (SG10–SG13):**

* PostHog events installed across ChangelogAI's Next.js application covering all core user actions
* Dunning infrastructure live in Stripe Billing (retry Day 3, 7, 14) with ActiveCampaign dunning email sequence; estimated $225/month in previously unrecovered MRR restored within 14 days
* Ownership announcement email sent to all 47 subscribers within 48 hours of Stripe migration close: "ChangelogAI has new backing and engineering resources — your $45/month plan is locked at your current price forever"
* Engineering Agent completes codebase audit over 7 days: all 3 hardcoded environment variable values rotated to buyer-controlled secrets; legacy Vercel cron job for weekly subscriber digest verified and migrated; no code pushed to production during this phase — observation only

 

### **Phase 4: Growth Activation — Pricing, Lifecycle, and Outbound Infrastructure (Days 28–42, Weeks 5–6)**

**Pricing experiment (SG16):**

* Stripe Price object updated: $69/month for all new signups; grandfathered users remain at $45/month
* Checkout page and landing page pricing section updated via Engineering Agent on a feature branch; human PR review required before merge
* Marketing Analyst Agent tracks trial-to-paid conversion weekly from W5 onwards; Week 7 gate decision prepared

**Lifecycle emails (SG17):**

* 6 PostHog event-triggered sequences configured in ActiveCampaign:

| Trigger Event | Email Sent | Timing |
| :---- | :---- | :---- |
| New signup | Welcome + GitHub connect prompt with step-by-step GIF | Within 1 hour |
| GitHub repo connected | "Your first changelog is 5 minutes away" walkthrough | Immediate |
| First changelog published | Celebration + subscriber import guide + public changelog URL | Immediate |
| 7-day inactivity (signed up, never connected GitHub) | Re-engagement: "10 minutes to your first changelog — I'll walk you through it" | Immediate on trigger |
| 80% of monthly changelog limit | Upgrade preview: what you get at $69/month | Immediate |
| Every Monday (active users only) | Weekly digest: changelogs published, subscriber click rate, most-read release | Scheduled |

**Outbound infrastructure (SG14–SG15):**

* Apify scrapes GitHub API for target company profiles: all public TypeScript/JavaScript repos where topics include "saas" or "devtool", contributors between 5–100, last commit within 90 days
* 3,200 companies identified; Apollo enriches with engineering lead and CTO email addresses and LinkedIn profiles
* Research Agent segments list into 3 tiers: Tier 1 = active shippers (>5 commits/week, product URL live with pricing), Tier 2 = moderate activity, Tier 3 = lower-frequency repos
* 4 sending domains fully configured in Instantly; warm-up at 30/day each; Tier 1 outreach begins W6 on first two domains

 

### **Phase 5: Full Outbound and Product Hunt Launch (Days 42–56, Weeks 7–8)**

**Cold outbound live (SG18):**

* Week 7: 100 emails/day on first two warmed domains; Tier 1 leads only
* Week 9: 300/day as third domain clears warm-up
* Week 10: 600/day at full velocity; Tier 2 leads introduced
* 3-email sequence per contact:
  * Day 1: Problem opener — "Your team shipped 12 releases last month. Your customers probably heard about 0 of them." No product mention.
  * Day 6: Value proof — "Teams using ChangelogAI see 31% lower churn in the 60 days after their customers start following their changelog. Here's why."
  * Day 14: Direct invitation — personalized with the prospect's GitHub repo name and a specific recent release example pre-populated by the Research Agent
* Marketing Analyst Agent monitors deliverability daily: open rate >35% target, reply rate >3% target, CPA <$150 target; pauses any domain where open rate drops below 25% for 3 consecutive days

**Product Hunt launch (SG20):**

* Creative Agent prepares all launch assets: tagline ("Your engineering team's work, finally visible"), description, 5 screenshots showing the GitHub → published changelog → subscriber notification flow, first comment, maker Q&A draft
* Outbound Agent executes community warm-up for 2 weeks pre-launch (upvotes, comments on adjacent launches)
* Launch executed Week 7; Outbound Agent responds to every comment within 30 minutes via browser
* Marketing Analyst Agent tracks signups by UTM for 7 days post-launch
* Target: 200+ upvotes, 15+ paid conversions in 7-day window

**Developer community organic (SG19):**

* HackerNews Show HN: "Show HN: I acquired ChangelogAI and an AI agent is running its go-to-market" — the meta-narrative is a growth asset for this specific audience
* r/devtools, r/SaaS: 5 high-value replies/day on threads about changelog tools, release communication, reducing churn by communicating product updates; no promotional links
* GitHub Discussions: targeted replies on repos discussing changelog generation, release note writing, customer communication
* X developer account: 3 posts/week covering changelog culture, release note templates, "what we shipped" post formats

 

### **Phase 6: SEO Content Engine (Days 42 Onwards, Weeks 6–14)**

**Programmatic SEO (SG21):**

* SEO Agent runs Ahrefs API: pulls keyword rankings for "changelog tool", "release notes generator", "changelog software", and all five direct competitor brand names + "alternative" queries
* Content gap analysis identifies 15 high-opportunity comparison keywords (e.g., "ChangelogAI vs Beamer", "Headway alternative for developers") and 10 long-tail "how to" keywords with low KD and measurable search volume
* Creative Agent generates page content for each URL; Engineering Agent deploys as static Next.js routes on changelogai.com
* Target: first organic traffic from comparison pages by Week 10; at least one comparison keyword on Page 1 by Week 14

 

### **Phase 7: Product and Engineering Loop (Continuous from Week 5)**

**Weekly product insight (SG22, every Monday):**

* Product Agent pulls PostHog: activation rate (GitHub connected within 7 days of signup — the primary leading indicator of retention), changelogs published per active user per week, top 5 support ticket categories with volume, DAU/WAU, trial-to-paid conversion at current price point
* Week 5 insight: 12 of the 47 existing customers have mentioned Slack digest in historical support tickets. Feature has sat in the backlog for 6 months. Product Agent immediately assigns spec work to itself.

**Slack digest feature (SG23):**

* Product Agent writes spec: when a changelog is published on ChangelogAI, automatically send a formatted Slack message to a user-configured Slack channel. Setup via Slack OAuth app (channel picker, toggle for auto-post vs. preview-first mode).
* Engineering Agent implements on a feature branch: Slack API OAuth flow, `changelog.published` PostHog event triggers Slack message via a Vercel serverless function, channel configuration UI component in Next.js, unit tests written
* PR opened: implementation notes, test results, rollback steps included
* Human engineer reviews PR and merges to main — no autonomous merge under any circumstances
* Engineering Agent deploys via Vercel CI/CD post-merge; confirms deployment successful in staging before flagging complete
* **Target: shipped by Week 9**
* Impact: Slack digest unlocks team-level adoption within existing customer organizations — one developer connects ChangelogAI to a team Slack channel, the entire team sees the next release, and a team plan inquiry follows

**Pro tier (SG24):**

* Defined by Product Agent once Slack digest is live and field-tested by existing customers
* Pro tier at $149/month: Slack digest (Starter gets email-only), custom branding on hosted changelog page (remove ChangelogAI footer, add customer logo and brand colors), up to 10 GitHub repo connections (vs. 1 on Starter)
* Stripe Products and Checkout sessions created; in-app upgrade CTA added to dashboard; landing page Pro tier section built by Engineering Agent
* **Target: launched Week 11**

 

### **Phase 8: Week-9 Orchestrator ROI Review**

Marketing Analyst Agent produces full cross-channel performance report for Orchestrator review:

* Cold email: total emails sent, open rate, reply rate, trial signups, paid conversions, cost-per-paying-customer
* Product Hunt: total upvotes, day-1 vs. trailing signups, 7-day paid conversion count
* Organic community: UTM-tracked signups from HN, Reddit, GitHub Discussions, X
* SEO: organic sessions from comparison pages, keyword rankings for primary targets
* Pricing experiment: trial-to-paid conversion at $69 vs. assumed historical baseline at $45
* Dunning: cumulative MRR recovered from previously failed payments since Week 3

Orchestrator allocates the $420 contingency budget to the best-performing channel. Any single reallocation above $500 is escalated to the human operator for approval before execution. The report is also the decision input for the holdback release: if verified MRR has not declined more than 10% from the $2,100 baseline, the $5,700 holdback is released from Escrow.com to the seller at Day 60 post-close.

**Customer support loop (SG25–SG26, continuous from Week 3):**

* Support Agent monitors Gmail inbox every 30 minutes via IMAP; categorizes and responds within 4 hours
* Churn signals (cancellation language, no changelog published in 14+ days after active use) escalated immediately: plain-text value recap email from new owner showing changelogs published and subscribers notified, subscription pause option offered before cancellation link
* All confirmed cancellations trigger a 2-question exit survey; responses logged to Product Agent backlog weekly

 

## **4\. Engineering Requirements**

### **Pre-Demo Prerequisites**

These must be fully functional before Week 1 of the demo. They are not tasks the agents perform during the demo. Any gap here blocks the plan.

* ChangelogAI staging environment operational and fully separated from production (required for all Engineering Agent QA work)
* PostHog installed on production ChangelogAI with events instrumented for: GitHub repo connected, first changelog published, subscriber added, payment succeeded, payment failed, upgrade CTA clicked, changelog page viewed
* Buyer Stripe account created and KYC-verified (required before migration script can be tested in Sandbox)
* Escrow.com buyer account created and identity-verified (required before APA can be funded)
* 4 outbound sending domains purchased, pointed at Instantly, and beginning warm-up (domains need 4–5 weeks of warm-up before sending at scale — must begin no later than end of Week 1)
* Buyer GitHub organization created with appropriate access controls
* Buyer Cloudflare account provisioned and ready to receive DNS zone transfer
* Gmail inbox for `hello@changelogai.com` configured and accessible via IMAP by Support Agent

 

### **4.1 Integrations**

**API integrations** (only where browser cannot do it reliably at agent speed or volume)

| Integration | Justification | Used By |
| :---- | :---- | :---- |
| Stripe API | MRR verification via Sigma queries during DD; subscription batch migration script; dunning configuration; Pro tier Checkout session creation; upgrade/cancel/pause event monitoring | Due Diligence Agent, Transfer Agent, Support Agent, Product Agent |
| GitHub API | Codebase commit history audit; dependency manifest analysis; PR creation and status checks; feature branch management; Engineering Agent code operations | Due Diligence Agent, Engineering Agent, Product Agent |
| Apify | TrustMRR and Acquire.com listing scraping (hourly, acquisition phase); GitHub repo scraping for outbound lead universe sourcing (growth phase) | Acquisition Agent, Research Agent |
| Apollo API | Contact enrichment for GitHub-sourced companies; decision-maker email and LinkedIn profile lookup; lead segmentation by company size and technographic signals | Research Agent |
| PostHog API | Activation funnel queries; churn signal detection; lifecycle email trigger events; weekly insight report data pull; trial-to-paid conversion tracking | Product Agent, Support Agent, Marketing Analyst Agent |
| Instantly API | Cold email sequence management; warm-up monitoring; deliverability metrics per domain; reply detection and routing to Outbound Agent | Outbound Agent, Marketing Analyst Agent |
| ActiveCampaign API | Lifecycle email trigger configuration; dunning sequence setup; contact tagging and segmentation; conversion event tracking | Support Agent |
| Ahrefs API | Keyword ranking monitoring for primary and competitor keywords; content gap analysis for SEO comparison page targeting | SEO Agent, Marketing Analyst Agent |
| Slack API | OAuth integration for Slack digest feature (Engineering Agent builds this into ChangelogAI); also used by Support Agent for internal escalation alerts | Engineering Agent, Support Agent |
| DocuSign API | NDA and APA electronic signing during acquisition phase | Acquisition Agent |
| Vercel API | Deployment status monitoring post-transfer; environment variable management; CI/CD pipeline verification; programmatic SEO page deployment | Engineering Agent, Transfer Agent, SEO Agent |
| Escrow.com | Funds management during acquisition; holdback release trigger at Day 60 pending MRR verification | Orchestrator, Acquisition Agent (browser) |

**Browser tasks** (via Faraday's browser extension)

| Platform | Tasks |
| :---- | :---- |
| TrustMRR / Acquire.com | Hourly listing monitoring; reading full listing detail pages not exposed via Apify; sending outreach messages via platform inbox; tracking listing status changes |
| Escrow.com | Funding escrow post-APA signing; confirming asset transfer conditions; authorizing holdback release at Day 60 |
| HackerNews | Show HN submission and monitoring; comment replies within 30 minutes on launch day; daily community activity during growth phase |
| Reddit | r/devtools, r/SaaS daily reply engagement (5 high-value replies/day); monitoring for intent signals mentioning changelog tools or release notes |
| X / Twitter | Developer-audience post publishing 3×/week; DM outreach to relevant community accounts |
| Product Hunt | Pre-launch community warm-up (2 weeks); launch day engagement; responding to all comments within 30 minutes |
| GitHub Discussions | Targeted replies on repositories actively discussing changelogs, release notes, and developer communication; no promotional links |

**Risk flag on Acquire.com/TrustMRR browser scraping:** If Apify's DOM scraping logic breaks due to front-end layout changes (a known failure mode), the Acquisition Agent falls back to manual monitoring via browser extension with alert triggers on new listings matching saved search criteria. This must be tested and confirmed functional in the pre-demo setup phase.

 

### **4.2 Platform Capabilities Required**

**Goals and Orchestration:**

* Goal creation with: total budget (split explicitly between acquisition cap and operating budget), timeline (14 weeks total), acquisition constraints (max price, required tech stack, minimum MRR, geography preference), autonomy mode, and dual financial targets (MRR goal + holdback release condition)
* Sub-goal creation supports two distinct phases: Acquisition (pre-close) and Growth (post-close), with automatic phase gating — Growth sub-goals display as locked until SG06 is marked complete by the human operator
* Acquisition-specific sub-goal types: Due Diligence (with data room access status, financial verification status, technical verification status), LOI (with sent/accepted/rejected state), APA (with signed/funded state)
* Orchestrator decision log: every rubric scoring decision and channel reallocation recorded with rationale, timestamp, and confidence level
* Escrow tracker: escrow balance, holdback amount, and Day 60 release condition visible in the Orchestrator financial dashboard
* Human escalation queue: blocks execution of the relevant task until human responds; covers all legal agreements, Stripe migration production run authorization, DNS transfer, any spend >$500, all PR merges to production

**Agent communication:**

* Agent-to-agent messaging with context passing: Due Diligence Agent findings automatically available to Acquisition Agent for LOI population without re-prompting
* Explicit handoff protocol: "task complete" signal with output artifact attached
* Phase unlock trigger: Orchestrator sends a system-level "acquisition complete" event when SG06 is confirmed, which activates all Growth phase sub-goals simultaneously

**Background jobs:**

* Listing monitoring: TrustMRR and Acquire.com scan every 60 minutes (acquisition phase only; deactivates post-close)
* Inbox monitoring: every 30 minutes (from Week 3 post-close, ongoing)
* Cold email performance pull: daily at 09:00 (from Week 7 onwards)
* PostHog analytics pull: every Monday at 08:00 (from Week 5 onwards)
* Ahrefs ranking pull: weekly on Monday (from Week 8 onwards)
* Uptime ping: every 5 minutes via BetterUptime (from Week 3, ongoing)
* Job failure handling: retry up to 3 times; on third failure, alert Orchestrator with failure reason and pause the affected sub-goal

 

### **4.3 Skills**

| Skill | What It Encodes |
| :---- | :---- |
| Acquisition screening | Rubric dimension scoring from listing metadata; financial metric calculation from Stripe API data; red flag detection patterns (LTD disguised as MRR, paused subscriptions falsely counted as active, inflated churn); seller motivation NLP on listing descriptions and seller messages |
| Financial due diligence | Stripe Sigma query structure for verified MRR calculation (netting out non-recurring items, paused and past-due subscriptions, and annual plan normalization); refund and chargeback verification via disputes API; involuntary churn detection via failed invoice webhook history |
| Technical due diligence | CVE scanning via `npm audit` / `pip check`; GitHub commit frequency and contributor analysis; CI/CD pipeline health via `.github/workflows` inspection; test coverage estimation via test file presence and framework detection; infrastructure cost normalization against cloud billing exports |
| Acquisition negotiation | LOI template population from DD findings; APA holdback and escrow structure for sub-$50K deals; standard indemnification clauses; seller support provision terms; Escrow.com integration workflow |
| Asset transfer | Stripe subscription batch migration script logic using `billing_mode=flexible`; Stripe Sandbox test clock methodology for pre-production validation; DNS transfer timing and downtime minimization; GitHub organization ownership transfer steps; Vercel project re-linking |
| Stabilization | Customer announcement email framing (continuity emphasis, grandfathered pricing guarantee); Stripe Billing dunning configuration (retry schedule, decline code routing); BetterUptime and PostHog observability setup; codebase secrets rotation protocol |
| B2B developer cold outbound | GitHub API-sourced ICP targeting methodology; 3-email sequence structure for engineering-leader audience (problem-led opener, value proof with specific data, personalized direct invitation); Instantly domain warm-up protocol; deliverability monitoring thresholds |
| Developer community engagement | HackerNews Show HN submission best practices and meta-narrative angle; Reddit r/devtools and r/SaaS engagement norms (value-first, no promotional links, account age requirements); GitHub Discussions participation patterns |
| Conversion lifecycle emails | PostHog event trigger logic per sequence type; activation nudge framing for no-GitHub-connection users; upgrade CTA structure at usage limit; re-engagement cadence for inactive users |
| SEO programmatic content | "Alternative to X" and "ChangelogAI vs [competitor]" page architecture; long-tail how-to page format for developer audience; Ahrefs keyword gap analysis methodology; Next.js static route deployment via Vercel for SEO page generation |
| Product management | Weekly insight report format; feature scoring by MRR at risk + potential new MRR + activation impact; GitHub Issue spec format for Engineering Agent handoff; Pro tier pricing architecture definition |
| Engineering (ChangelogAI stack) | Next.js 14 component and API route patterns; Prisma/PostgreSQL schema conventions; Vercel CI/CD deployment steps; Slack OAuth 2.0 flow implementation; staging vs. production environment protocol; hard rule: no autonomous production deployment under any circumstances — human PR review and explicit merge authorization required |
| Customer support | Response tone per ticket category; churn signal detection from support ticket language; GitHub Issue bug report format with reproduction steps; exit survey delivery and logging; value recap email structure using PostHog engagement data |

 

### **4.4 Agents**

| Agent | Role | Primary Sub-goals |
| :---- | :---- | :---- |
| Orchestrator Agent | Goal management, acquisition phase gating, budget tracking, inter-agent coordination, human escalation queue, Week-9 ROI review and contingency allocation, Day-60 holdback release authorization | All |
| Acquisition Agent | Hourly listing monitoring and rubric scoring, shortlist generation and presentation, personalized outreach drafting, NDA coordination, LOI population and dispatch | SG01, SG02, SG05 |
| Due Diligence Agent | Stripe Sigma MRR verification, involuntary churn gap analysis, GitHub codebase audit, CVE scanning, infrastructure cost verification, DD report synthesis | SG03, SG04 |
| Transfer Agent | Stripe migration script authoring, Sandbox test run and log reporting, production run execution post-human-authorization, GitHub repo transfer coordination, Vercel project migration | SG07, SG08, SG09 |
| Research Agent | Outbound ICP definition, Apify GitHub scraping for lead universe, Apollo enrichment and list segmentation, Product Hunt community research | SG14 |
| Outbound Agent | Cold email infrastructure setup, daily send operations and reply handling, HackerNews/Reddit/GitHub community engagement, Product Hunt launch execution | SG15, SG18, SG19, SG20 |
| SEO Agent | Ahrefs keyword gap analysis, programmatic comparison page content generation, Vercel route deployment, weekly ranking monitoring | SG21 |
| Marketing Analyst Agent | Daily cold email performance monitoring, PostHog channel attribution analysis, weekly cross-channel ROI report, Week-9 contingency allocation recommendation, Day-60 MRR verification for holdback release | SG18, SG21, SG22 |
| Creative Agent | Cold email copy variants for 3 ICP tiers, Product Hunt launch assets, X developer content, SEO page narrative sections, customer announcement email | SG12, SG19, SG20, SG21 |
| Product Agent | Weekly PostHog insight report, Slack digest feature spec, Pro tier definition, GitHub Issue creation for Engineering Agent handoff, PR review coordination | SG22, SG23, SG24 |
| Engineering Agent | Pricing experiment checkout update, Slack digest OAuth implementation, Pro tier Checkout session, SEO static route deployment, PR creation with implementation notes and rollback steps, staging QA, production deployment post human-merge-authorization | SG16, SG23, SG24, SG21 |
| Support Agent | Gmail inbox monitoring every 30 minutes, customer reply drafting, churn signal escalation to Orchestrator, dunning sequence configuration, lifecycle email trigger setup, exit survey dispatch and logging | SG11, SG12, SG17, SG25, SG26 |