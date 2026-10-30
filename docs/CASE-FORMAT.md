# Case JSON v1

Use `diligence_create_case` or export a blank case from the app to obtain the full shape. `src/engine.mjs::validateCase` is the canonical runtime validator. Import limit is 2 MiB. Maximum 1,000 sources and 1,000 findings. Unknown question IDs, broken source references and invalid date strings are rejected.

- Top-level: `schemaVersion: 1`; strings `title`, `subject`, `jurisdiction`, `decision`, `reviewer`, `decisionDate`, `createdAt`, `updatedAt`; a non-empty unique array `domains`; `sources` and `findings` arrays; `answers` object keyed by catalog question ID.
- Source: unique `id`, strings `title`, `locator`, `excerpt`, `asOf` (`YYYY-MM-DD`), `type` (`primary`, `secondary`, `self_report`, `other`). Empty evidence text can be represented but does not count toward completeness.
- Answer: `status` (`unknown`, `supported`, `concern`, `contradicted`, `not_applicable`), string `note`, array `sourceIds`. Missing answers are unknown. N/A must have a non-empty note.
- Finding: unique `id`; strings `title`, `detail`, `owner`, `action`, `dueDate` (empty or date), `resolution`; `domain` in selected scope; `severity` (`low`, `medium`, `high`, `critical`); `state` (`open`, `resolved`, `accepted`); array `sourceIds`. Accepted/resolved states require an owner and rationale. Clearing a resolved finding's gate also requires current linked evidence.

The JSON carries observations and user assertions. It is not signed, authenticated or tamper-evident. Preserve original source files in trusted storage and use locators to refer to them; do not embed credentials or unnecessary sensitive documents.
