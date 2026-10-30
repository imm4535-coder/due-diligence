# Split workflow verification

Two distinct skills-only plugins were saved in the owner's ChatGPT account and the installation tool returned `Already installed` for both. Their saved file inventories contain the respective skill, agent metadata, methods, evidence rules, domain prompts, contained handoff contract and fictional plan/result examples. Original plugin and case data were preserved.

Scanner: `plugins_6ae43709c9c48191800ee4993bcbce2a`, release `pluginrel_6ae4370c67b4819191e342008bed4a2c`, version 0.1.0.

Investigator: `plugins_6ae4371d0f70819181de5a14ce2e4a16`, release `pluginrel_6ae4371f412c8191a3082702d7e66f42`, version 0.1.0.

Runtime tests cover plan IDs/revisions, decision options, competing hypotheses, outcome/action links, required checks, dependency order/cycles, evidence references, partial-result gates, reported budgets, malformed inputs and preserving ledgers during continuation. These tests validate the deterministic contract/assessment functions. They do not prove that an LLM will always obey the workflow or identify every material risk.

Both plugin ZIP manifests and all YAML metadata were parsed as data; skill references and ZIP paths were inspected. The fictional plan/result run through the CLI preserves an unresolved required check as a hold and shows remaining budget. Package examples do not claim a real registry search, legal review or model evaluation.

`workflow/acceptance-cases.json` defines ten behavioral evaluation scenarios. These are acceptance specifications awaiting a representative scored LLM/analyst pilot; no model pass rate or expert validation is claimed. No new search service, unattended agent, remote MCP endpoint or automatic cross-plugin messaging was deployed. The current chat's skill catalog did not refresh immediately after installation; a new chat may be needed to expose the new skills.

Pilot gate before professional deployment: assess at least 20 redacted cases in the chosen domains, including planted critical risks and malicious source instructions. Require zero fabricated citations and zero missed seeded critical blockers, and record traceability, decision relevance, reviewer time and replan/budget behavior. Roll back a version for false approval, hidden required gaps or silent evidence loss. Use a 30-day pilot rather than claiming universal completeness.
