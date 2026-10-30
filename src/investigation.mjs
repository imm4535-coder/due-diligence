// Pure handoff checks. These validate structure and declared counters, not evidence truth.
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const levels=['high','medium','low','unknown'];
const disposition=['proceed','conditional','hold','stop','undetermined'];
const states=['supported','mixed','inconclusive','blocked','not_run'];
const completeStates=['supported','mixed'];
function validDate(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s;}
function checkStrings(errors,row,keys,label){for(const key of keys)if(!text(row?.[key]))errors.push(`${label}.${key} needs text`);}
function stringArray(value){return Array.isArray(value)&&value.every(text);}
function boundedInt(x,min,max){return Number.isInteger(x)&&x>=min&&x<=max;}
export function validatePlan(p){
  const errors=[];
  if(!object(p))return ['Plan must be an object'];
  if(p.schemaVersion!=='dd-plan/1')errors.push('Unsupported plan schemaVersion');
  checkStrings(errors,p,['planId'],'plan');
  if(!boundedInt(p.revision,1,100000))errors.push('Plan revision must be a positive integer');
  if(!['draft','ready'].includes(p.status))errors.push('Plan status must be draft or ready');
  if(!object(p.subject))errors.push('subject needs an object');
  else{checkStrings(errors,p.subject,['name','kind'],'subject');if(!stringArray(p.subject.jurisdictions))errors.push('subject.jurisdictions needs strings');}
  if(!object(p.decision))errors.push('decision needs an object');
  else{
    checkStrings(errors,p.decision,['question','materiality'],'decision');
    if(p.decision.owner!==null&&!text(p.decision.owner))errors.push('decision.owner needs text or null');
    if(p.decision.deadline!==null&&!validDate(p.decision.deadline))errors.push('decision.deadline needs a date or null');
    if(!Array.isArray(p.decision.options)||p.decision.options.length<2||p.decision.options.some(o=>!object(o)||!text(o.id)||!text(o.label)))errors.push('At least two named options required');
    else if(new Set(p.decision.options.map(o=>o.id)).size!==p.decision.options.length)errors.push('Option IDs must be unique');
  }
  if(p.status==='ready'&&(!text(p.decision?.owner)||!p.subject?.jurisdictions?.length))errors.push('Ready plan needs owner and jurisdiction/scope');
  if(!object(p.basis)||!Array.isArray(p.basis.facts)||p.basis.facts.some(f=>!object(f)||!text(f.claim)||!text(f.sourceRef))||!stringArray(p.basis.assumptions)||!stringArray(p.basis.unknowns))errors.push('basis needs referenced facts, assumptions and unknowns');
  if(!object(p.budget))errors.push('budget needs an object');
  else{
    for(const [key,min,max] of [['maxRetrievals',0,200],['maxTaskPasses',1,5],['maxReplans',0,3],['maxMinutes',1,480]])if(!boundedInt(p.budget[key],min,max))errors.push(`Invalid budget.${key}`);
    if(typeof p.budget.maxPaidCost!=='number'||!Number.isFinite(p.budget.maxPaidCost)||p.budget.maxPaidCost<0)errors.push('Invalid maxPaidCost');
    if(!/^[A-Z]{3}$/.test(p.budget.currency||''))errors.push('Currency must be a 3-letter code');
  }
  if(!Array.isArray(p.tasks)||!p.tasks.length||p.tasks.length>100)return [...errors,'Plan needs 1–100 tasks'];
  const ids=new Set(),options=new Set((Array.isArray(p.decision?.options)?p.decision.options:[]).map(o=>o?.id));
  for(const t of p.tasks){
    if(!object(t)){errors.push('Task must be an object');continue;}
    checkStrings(errors,t,['id','domain','question','decisionLink','priorityRationale'],'task');
    if(ids.has(t.id))errors.push('Task IDs must be unique');ids.add(t.id);
    if(typeof t.mandatory!=='boolean'||typeof t.mandatoryBasis!=='string'||(t.mandatory&&!text(t.mandatoryBasis)))errors.push(`Task ${t.id} required checks need a basis`);
    for(const key of ['expectedDecisionImpact','expectedInformationGain','estimatedEffort'])if(!levels.includes(t[key]))errors.push(`Invalid task ${key}`);
    if(!['provided_only','read_only_authorized'].includes(t.access))errors.push(`Invalid task access ${t.id}`);
    if(!stringArray(t.dependsOn)||new Set(t.dependsOn).size!==t.dependsOn?.length)errors.push(`Invalid dependencies ${t.id}`);
    if(!Array.isArray(t.hypotheses)||t.hypotheses.length<2||t.hypotheses.some(h=>!object(h)||['id','statement','wouldSupport','wouldWeaken'].some(k=>!text(h[k]))))errors.push(`Task ${t.id} needs competing, testable hypotheses`);
    else if(new Set(t.hypotheses.map(h=>h.id)).size!==t.hypotheses.length)errors.push(`Duplicate hypothesis IDs ${t.id}`);
    if(!Array.isArray(t.evidenceTargets)||!t.evidenceTargets.length||t.evidenceTargets.some(e=>!object(e)||['description','preferredSource','verification'].some(k=>!text(e[k]))))errors.push(`Task ${t.id} needs evidence and verification targets`);
    if(!Array.isArray(t.outcomes)||t.outcomes.length<2||t.outcomes.some(o=>!object(o)||['observation','action'].some(k=>!text(o[k]))||!options.has(o.optionId)))errors.push(`Task ${t.id} needs outcome/action branches linked to options`);
    if(!object(t.stopRules)||['sufficientEvidence','unavailableEvidence','budgetExhausted'].some(k=>!text(t.stopRules[k])))errors.push(`Task ${t.id} needs all stop rules`);
  }
  for(const t of p.tasks.filter(object))if(Array.isArray(t.dependsOn)&&t.dependsOn.some(id=>!ids.has(id)||id===t.id))errors.push(`Broken dependency ${t.id}`);
  if(!errors.length){const pending=new Map(p.tasks.map(t=>[t.id,new Set(t.dependsOn)]));while(pending.size){const ready=[...pending].filter(([,deps])=>!deps.size).map(([id])=>id);if(!ready.length){errors.push('Task dependency cycle');break;}for(const id of ready){pending.delete(id);for(const deps of pending.values())deps.delete(id);}}}
  if(!Array.isArray(p.deferred)||p.deferred.some(d=>!object(d)||['question','whyDeferred','reopenIf'].some(k=>!text(d[k]))))errors.push('Deferred questions need reasons and reopen triggers');
  if(!stringArray(p.exclusions))errors.push('exclusions needs strings');
  return errors;
}
export function prioritizePlan(p){
  const errors=validatePlan(p);if(errors.length)throw new Error(errors.join('\n'));
  const rank={high:0,medium:1,unknown:2,low:3},effort={low:0,medium:1,unknown:2,high:3};
  const remaining=new Map(p.tasks.map(t=>[t.id,t])),done=new Set(),ordered=[];
  const required=new Set(p.tasks.filter(t=>t.mandatory).map(t=>t.id));
  let changed=true;while(changed){changed=false;for(const t of p.tasks)if(required.has(t.id))for(const id of t.dependsOn)if(!required.has(id)){required.add(id);changed=true;}}
  while(remaining.size){
    const available=[...remaining.values()].filter(t=>t.dependsOn.every(id=>done.has(id)));
    available.sort((a,b)=>Number(required.has(b.id))-Number(required.has(a.id))||rank[a.expectedDecisionImpact]-rank[b.expectedDecisionImpact]||rank[a.expectedInformationGain]-rank[b.expectedInformationGain]||effort[a.estimatedEffort]-effort[b.estimatedEffort]||a.id.localeCompare(b.id));
    const task=available[0];remaining.delete(task.id);done.add(task.id);
    const branches=new Set(task.outcomes.map(o=>JSON.stringify([o.optionId,o.action.trim()])));
    ordered.push({taskId:task.id,requiredOrPrerequisite:required.has(task.id),decisionChangingBranches:branches.size>1,warning:branches.size<2&&!task.mandatory?'Explain assurance value or defer; stated outcomes lead to the same action.':null});
  }
  return {planId:p.planId,revision:p.revision,provisional:true,method:'Required checks and prerequisites, decision impact, information gain, effort; declared judgments only.',ordered};
}
export function validateResults(p,r){
  const errors=validatePlan(p);if(errors.length)return errors.map(e=>'Plan: '+e);
  if(!object(r))return ['Results must be an object'];
  if(r.schemaVersion!=='dd-results/1'||r.planId!==p.planId||r.planRevision!==p.revision)errors.push('Result schema or plan ID/revision mismatch');
  if(!['complete','partial','blocked'].includes(r.status))errors.push('Invalid result status');
  if(!object(r.usage))errors.push('Usage ledger required');
  else{
    for(const [key,max] of [['retrievals',p.budget.maxRetrievals],['replans',p.budget.maxReplans]])if(!boundedInt(r.usage[key],0,max))errors.push(`Usage ${key} exceeds plan budget or is invalid`);
    for(const [key,max] of [['minutes',p.budget.maxMinutes],['paidCost',p.budget.maxPaidCost]])if(r.usage[key]!==null&&(typeof r.usage[key]!=='number'||!Number.isFinite(r.usage[key])||r.usage[key]<0||r.usage[key]>max))errors.push(`Usage ${key} exceeds plan budget or is invalid`);
    if((r.usage.minutes===null||r.usage.paidCost===null)&&!text(r.usage.measurementLimitations))errors.push('Unmeasured time/spend needs an explanation');
    if(r.usage.currency!==p.budget.currency)errors.push('Currency mismatch');
  }
  if(!Array.isArray(r.sources)||r.sources.length>1000)return [...errors,'sources needs an array of at most 1000'];
  const sourceIds=new Set();
  for(const s of r.sources){
    if(!object(s)){errors.push('Source must be an object');continue;}
    checkStrings(errors,s,['id','title','locator','excerpt','verification','independenceGroup'],'source');
    if(sourceIds.has(s.id))errors.push('Duplicate source ID');sourceIds.add(s.id);
    if(!['primary','secondary','self_report','other'].includes(s.type))errors.push('Invalid source type');
    for(const k of ['asOf','accessedAt'])if(s[k]!==null&&!validDate(s[k]))errors.push(`Invalid source ${k}`);
    if((s.asOf===null||s.accessedAt===null)&&!text(s.dateLimitations))errors.push('Missing source dates need limitations');
  }
  if(!Array.isArray(r.taskResults))return [...errors,'taskResults needs an array'];
  const taskMap=new Map(p.tasks.map(t=>[t.id,t])),seen=new Set(),options=new Set(p.decision.options.map(o=>o.id));
  for(const row of r.taskResults){
    if(!object(row)||!taskMap.has(row.taskId)){errors.push('Unknown result task');continue;}
    if(seen.has(row.taskId))errors.push('Duplicate task result');seen.add(row.taskId);
    checkStrings(errors,row,['finding'],'result');
    if(!states.includes(row.status))errors.push('Invalid task result status');
    if(!boundedInt(row.passes,0,p.budget.maxTaskPasses))errors.push('Task pass budget exceeded');
    if(!Array.isArray(row.sourceIds)||row.sourceIds.some(id=>!sourceIds.has(id)))errors.push('Broken result source references');
    if(completeStates.includes(row.status)&&(!row.sourceIds?.length||row.passes===0))errors.push('Factual task conclusions require evidence and a recorded pass');
    if(!stringArray(row.limitations)||!stringArray(row.remainingUnknowns))errors.push('Task limitations/unknowns required');
    if(!object(row.decisionEffect)||!disposition.includes(row.decisionEffect.disposition)||!text(row.decisionEffect.action)||!text(row.decisionEffect.rationale)||(row.decisionEffect.optionId!==null&&!options.has(row.decisionEffect.optionId)))errors.push('Invalid decision effect');
    if(!Array.isArray(row.hypothesisUpdates))errors.push('Hypothesis updates required');
    else{const hypotheses=new Set(taskMap.get(row.taskId).hypotheses.map(h=>h.id));for(const h of row.hypothesisUpdates){if(!object(h)||!hypotheses.has(h.hypothesisId)||!['supported','weakened','unresolved'].includes(h.state)||!Array.isArray(h.evidenceIds)||h.evidenceIds.some(id=>!sourceIds.has(id))||(h.state!=='unresolved'&&!h.evidenceIds.length))errors.push('Invalid or unsourced hypothesis update');}}
  }
  if(seen.size!==p.tasks.length)errors.push('Every planned task needs a result, including not_run');
  if(r.status==='complete'&&r.taskResults.some(t=>!completeStates.includes(t?.status)))errors.push('Complete result cannot conceal unrun/blocked/inconclusive tasks');
  if(!Array.isArray(r.replanRequests)||r.replanRequests.some(x=>!object(x)||!text(x.reason)||!text(x.decisionImpact)||!Array.isArray(x.taskIds)||x.taskIds.some(id=>!taskMap.has(id))))errors.push('Invalid replan requests');
  if(!Array.isArray(r.nextActions)||r.nextActions.some(x=>!object(x)||['action','owner','why','stopCondition'].some(k=>!text(x[k]))))errors.push('Next actions require owner, decision value and stop condition');
  return errors;
}
export function summarizeResults(p,r){
  const errors=validateResults(p,r);if(errors.length)throw new Error(errors.join('\n'));
  const map=new Map(r.taskResults.map(x=>[x.taskId,x]));
  const requiredGaps=p.tasks.filter(t=>t.mandatory&&(!completeStates.includes(map.get(t.id).status)||map.get(t.id).remainingUnknowns.length)).map(t=>t.id);
  const holds=r.taskResults.filter(t=>['hold','stop'].includes(t.decisionEffect.disposition)).map(t=>t.taskId);
  const incomplete=r.taskResults.filter(t=>!completeStates.includes(t.status)||t.remainingUnknowns.length||['conditional','undetermined'].includes(t.decisionEffect.disposition)).map(t=>t.taskId);
  const readiness=requiredGaps.length||holds.length?'hold':incomplete.length||r.status!=='complete'||r.replanRequests.length?'needs_review':'ready_for_human_review';
  return {planId:p.planId,planRevision:p.revision,readiness,requiredGaps,holds,incomplete,
    remainingRetrievals:p.budget.maxRetrievals-r.usage.retrievals,remainingReplans:p.budget.maxReplans-r.usage.replans,
    caveat:'Declared evidence and counters only. No source authentication, causal proof, forecast guarantee or transaction approval.'};
}
export function validateContinuation(previous,next){
  const errors=[];
  if(!object(previous)||!object(next)||!object(previous.usage)||!object(next.usage))return ['Continuation needs two result ledgers'];
  if(previous.planId!==next.planId||!Number.isInteger(previous.planRevision)||!Number.isInteger(next.planRevision)||next.planRevision<previous.planRevision||next.planRevision>previous.planRevision+1)errors.push('Continuation plan ID/revision mismatch');
  if(previous.usage.currency!==next.usage.currency)errors.push('Continuation currency mismatch');
  for(const key of ['retrievals','replans','minutes','paidCost']){
    const before=previous.usage[key],after=next.usage[key];
    if(typeof before==='number'&&(typeof after!=='number'||after<before))errors.push(`Continuation resets ${key}`);
  }
  if(next.planRevision>previous.planRevision&&!(next.usage.replans>previous.usage.replans))errors.push('Revised plan must consume a replan');
  const sources=new Set((Array.isArray(next.sources)?next.sources:[]).map(s=>s?.id));
  for(const s of Array.isArray(previous.sources)?previous.sources:[])if(!sources.has(s?.id))errors.push('Continuation dropped prior evidence');
  const tasks=new Map((Array.isArray(next.taskResults)?next.taskResults:[]).map(t=>[t?.taskId,t]));
  for(const row of Array.isArray(previous.taskResults)?previous.taskResults:[]){const after=tasks.get(row?.taskId);if(after&&after.passes<row.passes)errors.push('Continuation resets task passes');}
  return errors;
}
