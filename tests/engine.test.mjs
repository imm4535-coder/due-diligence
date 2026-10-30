import {test} from 'node:test';
import assert from 'node:assert/strict';
import {catalog,createCase,questions} from '../src/catalog.mjs';
import {validateCase,assessCase,renderReport} from '../src/engine.mjs';
const opts={today:'2026-10-30'};
function complete(){
  const c=createCase({title:'Synthetic',subject:'Example',jurisdiction:'TH',decision:'Pilot',domains:['security']});
  c.reviewer='Reviewer';c.decisionDate='2026-11-01';
  c.sources=[{id:'s1',title:'Synthetic control evidence',locator:'file.pdf p.2',excerpt:'MFA and restore test evidence',type:'primary',asOf:'2026-10-01'}];
  for(const q of questions.filter(q=>q.domain==='security'))c.answers[q.id]={status:'supported',note:'Documented observation; human must verify',sourceIds:['s1']};
  return c;
}
function finding(overrides={}){return {id:'f1',title:'Restore test failed',detail:'Synthetic',domain:'security',severity:'high',state:'open',owner:'Reviewer',action:'Retest',dueDate:'2026-11-01',resolution:'',sourceIds:['s1'],...overrides};}
test('catalog has 12 unique domains and 36 unique questions',()=>{assert.equal(catalog.length,12);assert.equal(questions.length,36);assert.equal(new Set(questions.map(q=>q.id)).size,36);});
test('empty case is incomplete rather than safe',()=>{const a=assessCase(createCase(),opts);assert.equal(a.readiness,'needs_review');assert.equal(a.coverage,0);assert.equal(a.unknown,36);assert.equal(a.missingScope.length,6);});
test('complete documentation is only ready for human review',()=>{const a=assessCase(complete(),opts);assert.equal(a.readiness,'ready_for_human_review');assert.equal(a.coverage,100);});
test('status without rationale is a gap',()=>{const c=complete();c.answers['security.access'].note='';const a=assessCase(c,opts);assert.equal(a.covered,2);assert.equal(a.readiness,'needs_review');});
test('stale evidence cannot support complete coverage',()=>{const c=complete();c.sources[0].asOf='2024-01-01';const a=assessCase(c,opts);assert.equal(a.coverage,0);assert.deepEqual(a.sourceWarnings,['s1']);});
test('future evidence cannot increase completeness',()=>{const c=complete();c.sources[0].asOf='2027-01-01';assert.equal(assessCase(c,opts).covered,0);});
test('custom freshness threshold tightens assessment',()=>{assert.equal(assessCase(complete(),{...opts,freshnessDays:1}).covered,0);});
test('excerpts and locators are required for evidence coverage',()=>{for(const field of ['excerpt','locator','title']){const c=complete();c.sources[0][field]='';assert.equal(assessCase(c,opts).covered,0);}});
test('N/A reason required; all N/A is never ready',()=>{const c=complete();for(const a of Object.values(c.answers)){a.status='not_applicable';a.note='Outside explicitly bounded scope';}const a=assessCase(c,opts);assert.equal(a.coverage,null);assert.equal(a.excluded,3);assert.equal(a.readiness,'needs_review');c.answers['security.access'].note='';assert.match(validateCase(c).join(),/N\/A requires/);});
test('high and accepted critical findings override complete coverage',()=>{for(const [severity,state] of [['high','open'],['critical','accepted']]){const c=complete();c.findings=[finding({severity,state,resolution:state==='accepted'?'Owner accepts residual risk':''})];const a=assessCase(c,opts);assert.equal(a.coverage,100);assert.equal(a.readiness,'hold');assert.equal(a.blockers,1);}});
test('resolved finding needs linked current evidence to clear gate',()=>{const c=complete();c.findings=[finding({state:'resolved',resolution:'Retest passed',sourceIds:[]})];assert.equal(assessCase(c,opts).readiness,'hold');c.findings[0].sourceIds=['s1'];assert.equal(assessCase(c,opts).readiness,'ready_for_human_review');});
test('closure without owner or rationale is rejected',()=>{const c=complete();c.findings=[finding({state:'resolved'})];assert.match(validateCase(c).join(),/rationale/);});
test('contradictions hold, concern never silently passes',()=>{for(const [status,result] of [['contradicted','hold'],['concern','needs_review']]){const c=complete();c.answers['security.access'].status=status;assert.equal(assessCase(c,opts).readiness,result);}});
test('broken source references, invalid dates and duplicate IDs rejected',()=>{let c=complete();c.answers['security.access'].sourceIds=['missing'];assert.match(validateCase(c).join(),/references/);c=complete();c.sources[0].asOf='2026-02-30';assert.match(validateCase(c).join(),/date/);c=complete();c.sources.push({...c.sources[0]});assert.match(validateCase(c).join(),/unique/);});
test('unknown schema, null members, wrong collection types fail cleanly',()=>{for(const mutate of [c=>c.schemaVersion=2,c=>c.sources=[null],c=>c.findings=[null],c=>c.answers=[],c=>c.domains=['fake'],c=>c.sources='not-array']){const c=complete();mutate(c);assert.ok(validateCase(c).length);assert.throws(()=>assessCase(c,opts));}});
test('malformed scope and findings rejected',()=>{const c=complete();c.findings=[finding({title:'',domain:'legal',dueDate:'bad'})];assert.ok(validateCase(c).length>=3);});
test('JSON round trip preserves assessment and sources',()=>{const c=complete();assert.deepEqual(assessCase(JSON.parse(JSON.stringify(c)),opts),assessCase(c,opts));});
test('Markdown export includes gates, source locators and escaped HTML',()=>{const c=complete();c.title='<script>alert(1)</script>';c.findings=[finding()];const md=renderReport(c,opts);assert.ok(md.includes('**hold**'));assert.ok(md.includes('file.pdf p.2'));assert.ok(md.includes('not a safety'));assert.ok(!md.includes('<script>'));assert.ok(md.includes('s1'));});
