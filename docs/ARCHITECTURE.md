# Architecture and boundaries

One catalog and deterministic assessment engine power the static browser app and four local stdio MCP tools. The AI skill is self-contained instructions and references. No vector database, autonomous research loop, paid API, server-side case storage or external data connection is required.

```
Browser form → case JSON → validate → assess → JSON / Markdown / print
AI host → local stdio MCP → same catalog / engine → explicit tool result
AI host → portable skill → evidence-led investigation using authorized tools
```

## Owner and outcome

Owner: repository maintainer. User: analyst, founder, buyer or reviewer preparing a bounded decision. Outcome: a reviewable evidence register, visible gaps, material risks and an action plan with an accountable human owner. The app's scope is a structured workspace; any model-assisted reading happens in the user's chosen AI host.

## Trust and access

The browser makes same-origin requests only for public app assets and configuration. Service worker caches assets, not case records. Saving is explicit, local and unencrypted. The AI copy action includes the full case; the user chooses whether to paste it into a provider. The app does not upload files, fetch user-provided URLs, parse arbitrary documents or perform AI inference.

MCP uses the local host's process boundary and has no remote endpoint or separate authentication. Anyone allowed to launch the process can call its pure functions. There are no secrets, model credentials or domain-specific credentials in the distribution. Inputs and referenced source IDs are validated; outputs contain supplied data, which AI clients must treat as untrusted evidence. Request metadata is not persisted. The process has a hard message budget and input size limit; external timeouts and retries do not apply because it makes no external calls.

## Failure behavior

Invalid JSON or schema is rejected without replacing the active case. Unavailable browser storage falls back to JSON export. Missing, stale or future evidence reduces completeness. No data and all-N/A cannot be labeled ready. Unresolved high/critical findings cannot be hidden by low-risk answers or accepted-risk labels. No network access is needed after assets have cached; initial offline load and ZIP downloads that were not fetched still need a connection.

## Current limits

No attachment parsing, independent source authentication, live registries, sanctions matching, cross-device synchronization, encrypted vault, collaborative access control, immutable audit trail, expert legal/tax review or hosted LLM service. Users can edit their own case JSON and alter closure states; this tool is not tamper-evident. Source freshness is a coarse starter policy. A documented answer may rely on a self-report; a human must challenge its sufficiency.

## Thirty-day gate

Week 1: five pilot reviewers complete one real but redacted case each. Week 2: review missing questions and false reassurance, add domain-specific modules only with an owner. Week 3: test independent analysts reproducing citations and decisions. Week 4: publish a pilot evaluation and decide whether hosted collaboration or specialist packs have enough demand to build.

KPIs: median time to a reviewable memo, fraction of material claims with traceable citations, fraction of blockers retained across exports, JSON round-trip fidelity, number of reviewers returning for a second case. Proposed pilot gates: ≥95% traceability of material claims, 100% blocker retention, zero unknown-as-safe outputs. These are targets, not measured results.

Cost per local case: zero model/API charges from this software; reviewer time and device/network costs remain. Hosting/sponsorship fees depend on the chosen provider. Any future AI service needs explicit provider selection, per-user spend caps, token accounting, evaluation and a kill switch before launch.
