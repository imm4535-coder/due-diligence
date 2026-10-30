# Sustainable support

The immediate hypothesis is that a useful free diligence workspace earns trust and repeat use. Sponsorship is a hypothesis to test, not guaranteed income.

| Channel | What the supporter receives | Gate before launch |
| --- | --- | --- |
| Voluntary sponsorship | Supports maintenance; no diligence approval or favorable finding | Verified recipient URL and provider eligibility |
| Paid onboarding | Help adapting the workspace and training a team | Defined deliverable, scope, fee and data handling |
| Specialist templates | Maintained questions for one industry/jurisdiction | Qualified domain owner, cited sources and update policy |
| Hosted team edition | Collaboration, encrypted storage and audit trail | Demand from pilots, threat model and tested access control |

Suggested validation: invite five pilot reviewers; measure whether three complete a real redacted case and two return. Ask which step saved time and what they would pay to improve. Do not spend on hosted AI or many industry packs before repeat use is visible.

Do not paywall unfavorable findings, sell a “passed diligence” badge or accept funding conditional on hiding a risk. Sponsor relationships must be disclosed if they overlap a reviewed subject.

## Activate a real support link

1. Obtain the maintainer's actual GitHub Sponsors, Ko-fi, Buy Me a Coffee or other HTTPS page and check eligibility directly with that provider.
2. Set `supportUrl` in `app/config.json` to that page. Never invent a payment destination or bank details.
3. Add the matching account/URL to `.github/FUNDING.yml`; use `.github/FUNDING.example.yml` as guidance.
4. Rebuild and deploy, then check the recipient on the provider page. No payment is initiated by this app.

Provider approval, fees, tax treatment and local eligibility are separate from publishing open-source code. The initial release leaves funding disabled until the owner supplies a destination.
