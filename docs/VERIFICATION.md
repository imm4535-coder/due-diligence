# v0.1 verification — 2026-10-30

Passed: 22 engine/MCP tests, JavaScript syntax and skill-reference checks, archive inspection, local skill installation to a temporary directory, refusal to overwrite an installed skill, and direct newline-delimited JSON-RPC exchange with the MCP process.

DOM simulation passed: first render, fictional sample, material-risk hold gate, navigation, report, explicit local save, AI prompt handoff, source submission and literal rendering of script-like source text. This is not visual browser QA. No real AI host compatibility test or live registry verification was performed.

At initial local verification, HTTP checks returned 200 for the app, assessment engine module and plugin download, with the expected MIME types. At that stage the app had not been deployed publicly. The skills-only private ChatGPT plugin was saved and its skill/reference files were verified through the Plugin Creator connector. Saving is not the same as installation in every AI host.

Initial GitHub repository creation was attempted for `imm4535-coder/diligence-commons` (before the product was renamed Due Diligence); GitHub returned `GraphQL: Resource not accessible by integration (createRepository)`. At that point publication was blocked. The owner subsequently made the public `imm4535-coder/due-diligence` repository available with push permission; publication uses that repository. Source publication, release assets and a live web deployment are separate outcomes.

Ready-to-install bundle: archive integrity, required launch/install files and executable permissions checked. Extracted Codex and Claude Code installers successfully copied the skill to separate temporary target directories. The extracted Node launcher served the exact packaged HTML and engine module over loopback HTTP. Python launcher compilation and shell-script syntax passed. Windows batch and macOS launchers have not been executed on those operating systems. The bundle includes scripts and built assets, not Node/Python runtimes or a signed native installer.
