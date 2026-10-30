import {catalog, questions, statuses} from './catalog.mjs';
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
const obj = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const severities = ['low', 'medium', 'high', 'critical'];
const sourceTypes = ['primary', 'secondary', 'self_report', 'other'];
const evidence = (source) => source && nonempty(source.title) && nonempty(source.locator) && nonempty(source.excerpt) && nonempty(source.asOf);
export function validateCase(c) {
  const errors = [];
  if (!obj(c)) return ['Case must be an object'];
  if (c.schemaVersion !== 1) errors.push('Unsupported schemaVersion');
  for (const key of ['title', 'subject', 'jurisdiction', 'decision', 'reviewer', 'decisionDate', 'createdAt', 'updatedAt']) {
    if (typeof c[key] !== 'string' || c[key].length > 20000) errors.push(`${key} must be a string up to 20000 characters`);
  }
  const validDomains = new Set(catalog.map(d => d.id));
  if (!Array.isArray(c.domains) || !c.domains.length || c.domains.some(d => !validDomains.has(d)) || new Set(c.domains).size !== c.domains.length) errors.push('Choose unique valid domains');
  if (!Array.isArray(c.sources) || c.sources.length > 1000) errors.push('sources must be an array up to 1000');
  if (!Array.isArray(c.findings) || c.findings.length > 1000) errors.push('findings must be an array up to 1000');
  if (!obj(c.answers)) errors.push('answers must be an object');
  if (errors.length) return errors;
  const ids = new Set();
  for (const s of c.sources) {
    if (!obj(s) || !nonempty(s.id) || ids.has(s.id)) { errors.push('Source needs a unique id'); continue; }
    ids.add(s.id);
    for (const k of ['title', 'locator', 'excerpt', 'asOf']) if (typeof s[k] !== 'string' || s[k].length > 50000) errors.push(`Invalid source ${s.id}: ${k}`);
    if (!sourceTypes.includes(s.type)) errors.push(`Invalid source type: ${s.id}`);
    if (typeof s.asOf === 'string' && !validDate(s.asOf)) errors.push(`Invalid source date: ${s.id}`);
  }
  const qids = new Set(questions.map(q => q.id));
  for (const [id, a] of Object.entries(c.answers)) {
    if (!qids.has(id) || !obj(a)) { errors.push(`Invalid question ${id}`); continue; }
    if (!statuses.includes(a.status)) errors.push(`Invalid status for ${id}`);
    if (typeof a.note !== 'string' || a.note.length > 50000) errors.push(`Invalid note for ${id}`);
    if (!Array.isArray(a.sourceIds) || a.sourceIds.some(x => !ids.has(x)) || new Set(a.sourceIds).size !== a.sourceIds.length) errors.push(`Invalid source references for ${id}`);
    if (a.status === 'not_applicable' && !nonempty(a.note)) errors.push(`N/A requires a reason: ${id}`);
  }
  const fids = new Set();
  for (const f of c.findings) {
    if (!obj(f)) { errors.push('Finding must be an object'); continue; }
    if (!nonempty(f.id) || fids.has(f.id)) errors.push('Finding needs a unique id');
    fids.add(f.id);
    for (const k of ['title', 'detail', 'owner', 'action', 'dueDate', 'resolution']) if (typeof f[k] !== 'string' || f[k].length > 50000) errors.push(`Invalid finding ${k}`);
    if (!nonempty(f.title)) errors.push('Finding needs a title');
    if (!validDomains.has(f.domain) || !c.domains.includes(f.domain)) errors.push('Finding domain must be in scope');
    if (!severities.includes(f.severity) || !['open', 'resolved', 'accepted'].includes(f.state)) errors.push('Invalid finding severity/state');
    if (!Array.isArray(f.sourceIds) || f.sourceIds.some(x => !ids.has(x))) errors.push('Invalid finding source references');
    if (f.dueDate && !validDate(f.dueDate)) errors.push('Invalid finding due date');
    if (f.state !== 'open' && (!nonempty(f.resolution) || !nonempty(f.owner))) errors.push('Closed/accepted findings need an owner and resolution rationale');
  }
  return errors;
}
function validDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === s;
}
export function assessCase(c, {today = new Date().toISOString().slice(0,10), freshnessDays = 365} = {}) {
  const errors = validateCase(c);
  if (errors.length) throw new Error(errors.join('\n'));
  if (!validDate(today) || !Number.isInteger(freshnessDays) || freshnessDays < 0) throw new Error('Invalid assessment date/freshnessDays');
  const sources = new Map(c.sources.map(s => [s.id, s]));
  const sourceFresh = s => evidence(s) && s.asOf <= today && (new Date(today) - new Date(s.asOf)) / 86400000 <= freshnessDays;
  const items = questions.filter(q => c.domains.includes(q.domain)).map(q => {
    const a = c.answers[q.id] || {status:'unknown', note:'', sourceIds:[]};
    const hasEvidence = a.sourceIds.some(id => sourceFresh(sources.get(id)));
    const covered = a.status === 'not_applicable' ? nonempty(a.note) : a.status !== 'unknown' && hasEvidence && nonempty(a.note);
    return {...q, ...a, hasEvidence, covered};
  });
  const applicable = items.filter(i => i.status !== 'not_applicable');
  const covered = applicable.filter(i => i.covered).length;
  const resolvedWithEvidence = f => f.state === 'resolved' && f.sourceIds.some(id => sourceFresh(sources.get(id)));
  const blockers = c.findings.filter(f => ['critical', 'high'].includes(f.severity) && !resolvedWithEvidence(f));
  const concerns = items.filter(i => ['concern', 'contradicted'].includes(i.status));
  const openFindings = c.findings.filter(f => !resolvedWithEvidence(f));
  const missingScope = ['title','subject','jurisdiction','decision','reviewer','decisionDate'].filter(k => !nonempty(c[k]));
  if (c.decisionDate && !validDate(c.decisionDate)) missingScope.push('valid decisionDate');
  let readiness = 'ready_for_human_review';
  if (blockers.length || items.some(i => i.status === 'contradicted')) readiness = 'hold';
  else if (!applicable.length || covered < applicable.length || concerns.length || openFindings.length || missingScope.length) readiness = 'needs_review';
  const sourceWarnings = c.sources.filter(s => !sourceFresh(s)).map(s => s.id);
  return {readiness, coverage: applicable.length ? Math.round(covered / applicable.length * 100) : null,
    covered, applicable: applicable.length, unknown: applicable.filter(i => !i.covered).length,
    excluded: items.filter(i => i.status === 'not_applicable').length, blockers: blockers.length,
    concerns: concerns.length, openFindings: openFindings.length, missingScope, sourceWarnings, items,
    assessedAt: today, freshnessDays};
}
export function renderReport(c, options) {
  const a = assessCase(c, options);
  const safe = s => String(s ?? '').replace(/\r?\n/g, ' ').replace(/[\\`*_{}\[\]<>#|!]/g, '\\$&');
  const lines = [`# Due diligence — ${safe(c.title || 'Untitled')}`, '',
    `Subject: ${safe(c.subject)} | Jurisdiction: ${safe(c.jurisdiction)}`, `Decision: ${safe(c.decision)}`,
    `Reviewer: ${safe(c.reviewer)} | Decision date: ${safe(c.decisionDate)} | Assessed: ${a.assessedAt}`, '',
    `Readiness: **${a.readiness}**`, `Evidence coverage: ${a.coverage === null ? 'N/A' : a.coverage + '%'} (${a.covered}/${a.applicable}); gaps: ${a.unknown}; N/A: ${a.excluded}; material blockers: ${a.blockers}.`, '',
    'Coverage measures documentation completeness only. It is not a safety, credit, legal or investment rating. Evidence and dates are user supplied; no external verification or automated document analysis was performed. Findings marked resolved still require current linked evidence to clear their gate.',
    `Freshness rule: ${a.freshnessDays} days; future-dated sources do not count. This default must be tightened for time-sensitive checks.`,
    `Missing scope: ${a.missingScope.map(safe).join(', ') || 'none'}. Source warnings: ${a.sourceWarnings.map(safe).join(', ') || 'none'}.`, '', '## Findings', ''];
  for (const f of c.findings) lines.push(`### ${safe(f.title)} — ${f.severity} / ${f.state}`, safe(f.detail), `Sources: ${f.sourceIds.map(safe).join(', ') || 'unverified'}`, `Action: ${safe(f.action)} | Owner: ${safe(f.owner)} | Due: ${safe(f.dueDate)}`, `Resolution / accepted-risk rationale: ${safe(f.resolution)}`, '');
  if (!c.findings.length) lines.push('No findings recorded. This does not establish absence of risk.', '');
  lines.push('## Checklist', '');
  for (const i of a.items) lines.push(`- **${safe(i.id)}** ${safe(i.text)} — ${i.status}; evidence ${i.hasEvidence ? 'documented' : 'missing/stale'}`, `  ${safe(i.note)} | Sources: ${i.sourceIds.map(safe).join(', ') || 'none'}`);
  lines.push('', '## Evidence register', '');
  for (const s of c.sources) lines.push(`### ${safe(s.id)} — ${safe(s.title)}`, `Type: ${s.type} | As of: ${safe(s.asOf)} | Locator: ${safe(s.locator)}`, `Excerpt / observation: ${safe(s.excerpt)}`, '');
  lines.push('## Decision gate', '', 'Human reviewer records a decision, conditions, owner and next review date outside this automated assessment. Self-reported evidence and N/A exclusions require independent challenge. Use qualified professionals for regulated or high-stakes decisions.');
  return lines.join('\n');
}
