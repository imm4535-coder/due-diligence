#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {validatePlan,prioritizePlan,validateResults,summarizeResults,validateContinuation} from '../src/investigation.mjs';
const [planFile,resultFile,previousFile]=process.argv.slice(2);
try{
  if(!planFile)throw new Error('Usage: node scripts/review-plan.mjs plan.json [results.json] [previous-results.json]');
  async function load(file){const raw=await readFile(file,'utf8');if(Buffer.byteLength(raw)>2*1024*1024)throw new Error('Handoff exceeds 2 MiB');return JSON.parse(raw);}
  const plan=await load(planFile),errors=validatePlan(plan);if(errors.length)throw new Error(errors.join('\n'));
  if(resultFile){const results=await load(resultFile),issues=validateResults(plan,results);if(previousFile)issues.push(...validateContinuation(await load(previousFile),results));if(issues.length)throw new Error(issues.join('\n'));console.log(JSON.stringify(summarizeResults(plan,results),null,2));}
  else console.log(JSON.stringify(prioritizePlan(plan),null,2));
}catch(e){console.error(e.message);process.exitCode=1;}
