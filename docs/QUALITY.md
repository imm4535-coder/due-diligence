# Quality and release gates

Release 0.1 is a pilot, not a professionally validated diligence service.

Automated cases cover empty scope, complete documentation, missing rationale, stale and future evidence, exclusions, contradictory answers, accepted material risks, malformed input, source references, report escaping, MCP error behavior and stdio transport. Run `npm test` and `npm run check` before packaging. Build inspects archive paths, schema metadata and excludes credentials/runtime data.

Manual acceptance: keyboard navigation; 360px mobile width; create source and answer; add/close/reopen/accept a finding; save/reload; export/import; print/PDF; offline revisit; clipboard failure handling; literal rendering of HTML/script strings. Record actual browser/host versions and results. Do not claim browser or host installation checks that were not run.

AI evaluation before selling expert output: at least 20 redacted examples across chosen domains, including malicious document instructions, circular sources, stale registry data, conflicting records, hidden liabilities, unsupported N/A and name collisions. A reviewer scores citation accuracy, missing blockers, unsupported claims and actionability. Accept zero fabricated sources and zero missed seeded critical blockers before expanding scope. No benchmark results are claimed in v0.1.

Performance targets (unmeasured): engine <100 ms for a normal 36-question case and <1 second for a 2 MiB case on a contemporary laptop. Test before increasing data limits. App storage quotas vary. No concurrent service/load claims apply to the local version.

Rollback: withdraw a release and restore the last tagged version for any false-ready result, silent case loss, executable imported markup or secret leakage. Report scope and correction without publishing confidential cases. Never reinterpret “ready for human review” as approval.
