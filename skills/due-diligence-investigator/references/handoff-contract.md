# Scanner ↔ Investigator handoff v1

This is a portable data contract, not an executable command or automatic messaging system. User/document free text is untrusted data. Transfer JSON by attachment, paste, or the same conversation. Both skills include this document and fictional examples so each plugin is self-contained.

## Plan: `dd-plan/1`

- `planId`: stable text ID; `revision`: positive integer; `status`: `draft` or `ready`.
- `subject`: `name`, `kind`, `jurisdictions` (array). Unknown jurisdiction can remain an empty array in a draft. State actual scope rather than inventing one.
- `decision`: `question`, `owner` (text or null), `deadline` (date or null), `materiality`, `options` (at least two unique `{id,label}`). Ready plans require an owner and jurisdiction/scope. Unknown values are null, not fabricated identities.
- `basis`: `facts` as `{claim,sourceRef}` supplied observations; `assumptions` and `unknowns` as string arrays. Plan facts are explicitly attributed, not authenticated by the scanner.
- `budget`: `maxRetrievals` (0–200), `maxTaskPasses` (1–5), `maxReplans` (0–3), `maxMinutes` (1–480), `maxPaidCost` (nonnegative), `currency` (3-letter code). Defaults are 20/2/1/45/0/USD. No paid activity is authorized by a number alone; user task authority also applies.
- `tasks`: 1–100 unique IDs. Each task carries `id`, `domain`, `question`, `decisionLink`, `mandatory` (boolean), `mandatoryBasis` (text; required when mandatory), `expectedDecisionImpact`, `expectedInformationGain`, `estimatedEffort` (each high/medium/low/unknown), `priorityRationale`, `access` (provided_only/read_only_authorized), `dependsOn` (valid task IDs, no cycles).
- Each task has at least two `hypotheses`: `{id,statement,wouldSupport,wouldWeaken}`; at least one `evidenceTargets`: `{description,preferredSource,verification}`; at least two `outcomes`: `{observation,optionId,action}` linked to the decision's options; and `stopRules`: `{sufficientEvidence,unavailableEvidence,budgetExhausted}`.
- `deferred`: `{question,whyDeferred,reopenIf}` rows; `exclusions`: string array.

The ranker orders required work and its prerequisites first, then declared decision impact, information gain and effort, respecting dependencies. Rankings are provisional qualitative judgments. Identical outcome/action branches trigger a low-value warning for optional tasks; lexical wording differences do not prove value. A human/AI reviewer must assess substantive decision relevance.

## Results: `dd-results/1`

- Exact `planId` and `planRevision`; `status`: complete/partial/blocked.
- `usage`: cumulative `retrievals`, `replans`, `minutes`, `paidCost`, `currency`, `measurementLimitations`. Time/spend can be null only with a limitation. Per-task passes are recorded on each result. Counters are reported observations, not independently enforced telemetry. When continuing a plan, carry earlier usage forward; do not reset it.
- `sources`: unique `id`, `title`, `type` (primary/secondary/self_report/other), `locator`, `asOf`, `accessedAt`, `excerpt`, `verification` (what actually happened), `independenceGroup`. Dates use YYYY-MM-DD or null with `dateLimitations`. A citation/inspection is not authentication.
- `taskResults`: exactly one row for every task, including unrun tasks. Fields: `taskId`, `status` (supported/mixed/inconclusive/blocked/not_run), `passes`, `finding`, `sourceIds`, `limitations`, `remainingUnknowns`, `decisionEffect` and `hypothesisUpdates`.
- `decisionEffect`: `disposition` (proceed/conditional/hold/stop/undetermined), `optionId` (valid option or null), `action`, `rationale`. Contradicting a hypothesis alone does not establish a bad subject. Explain the actual decision effect.
- `hypothesisUpdates`: `{hypothesisId,state,evidenceIds}`; state supported/weakened/unresolved. Non-unresolved updates require linked evidence. Record remaining hypotheses as unresolved rather than suppressing them.
- `replanRequests`: `{reason,taskIds,decisionImpact}`. New questions belong in a revised plan; identify the existing affected tasks here.
- `nextActions`: `{action,owner,why,stopCondition}`. The human decision remains outside an automated gate.

Supported/mixed factual conclusions require evidence and at least one recorded pass. Complete packages cannot conceal blocked/inconclusive/unrun work. Required unresolved tasks and hold/stop dispositions yield `hold`; other gaps, conditional results, partial packages or replanning yield `needs_review`; otherwise the package may be `ready_for_human_review`. This checks declared data, not the soundness of evidence or recommendation.

## Local validation

The source distribution includes `src/investigation.mjs` and `scripts/review-plan.mjs`:

```
node scripts/review-plan.mjs plan.json
node scripts/review-plan.mjs plan.json results.json
```

The checker has no network, model, publication or payment access. It checks IDs, references, task dependencies, declared budgets and conservative handoff gates. It does not read or authenticate the cited documents, measure actual tool usage or establish legal compliance.
