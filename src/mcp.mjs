#!/usr/bin/env node
// Bounded, stateless local stdio MCP. No network, filesystem, shell or model calls.
import {pathToFileURL} from 'node:url';
import {catalog, createCase} from './catalog.mjs';
import {assessCase, validateCase, renderReport} from './engine.mjs';
const object = properties => ({type:'object',properties,additionalProperties:false});
export const toolDefinitions = [
  {name:'diligence_catalog',description:'Read the 12-domain screening question catalog. No external verification.',inputSchema:object({})},
  {name:'diligence_create_case',description:'Create a blank due diligence case. Returns JSON without storing it.',inputSchema:object({title:{type:'string',maxLength:2000},subject:{type:'string',maxLength:2000},jurisdiction:{type:'string',maxLength:2000},decision:{type:'string',maxLength:2000},domains:{type:'array',minItems:1,uniqueItems:true,items:{type:'string',enum:catalog.map(d=>d.id)}}})},
  {name:'diligence_assess',description:'Validate and assess evidence completeness, gaps and material blockers in supplied case JSON. Does not verify truth, approve a transaction or store data.',inputSchema:{...object({case:{type:'object'},today:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},freshnessDays:{type:'integer',minimum:0,maximum:3650}}),required:['case']}},
  {name:'diligence_report',description:'Render a traceable Markdown report from supplied case JSON. Does not store or transmit the case.',inputSchema:{...object({case:{type:'object'},today:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},freshnessDays:{type:'integer',minimum:0,maximum:3650}}),required:['case']}}
];
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export function callTool(name, args = {}) {
  const def = toolDefinitions.find(t=>t.name===name);
  if(!def)throw new Error('Unknown tool');
  if(!plain(args))throw new Error('Arguments must be an object');
  if(Object.keys(args).some(k=>!Object.hasOwn(def.inputSchema.properties,k)))throw new Error('Unexpected argument');
  for(const k of def.inputSchema.required||[])if(!Object.hasOwn(args,k))throw new Error(`Missing ${k}`);
  if(name==='diligence_catalog')return catalog;
  if(name==='diligence_create_case'){
    for(const k of ['title','subject','jurisdiction','decision'])if(args[k]!==undefined&&(typeof args[k]!=='string'||args[k].length>2000))throw new Error(`Invalid ${k}`);
    const c=createCase(args);const errors=validateCase(c);if(errors.length)throw new Error(errors.join('\n'));return c;
  }
  const options={};
  if(args.today!==undefined)options.today=args.today;
  if(args.freshnessDays!==undefined){if(!Number.isInteger(args.freshnessDays)||args.freshnessDays<0||args.freshnessDays>3650)throw new Error('Invalid freshnessDays');options.freshnessDays=args.freshnessDays;}
  return name==='diligence_assess'?assessCase(args.case,options):renderReport(args.case,options);
}
export function handleRpc(request) {
  if(!plain(request)||request.jsonrpc!=='2.0'||typeof request.method!=='string')return {jsonrpc:'2.0',id:request?.id??null,error:{code:-32600,message:'Invalid request'}};
  if(!Object.hasOwn(request,'id'))return null;
  if(!(typeof request.id==='string'||Number.isFinite(request.id)||request.id===null))return {jsonrpc:'2.0',id:null,error:{code:-32600,message:'Invalid id'}};
  const response={jsonrpc:'2.0',id:request.id};
  if(request.method==='initialize')return {...response,result:{protocolVersion:'2025-06-18',capabilities:{tools:{}},serverInfo:{name:'diligence-commons',version:'0.1.0'}}};
  if(request.method==='ping')return {...response,result:{}};
  if(request.method==='tools/list')return {...response,result:{tools:toolDefinitions}};
  if(request.method==='tools/call'){
    try{
      if(!plain(request.params)||typeof request.params.name!=='string')throw new Error('Invalid tool parameters');
      const result=callTool(request.params.name,request.params.arguments);
      return {...response,result:{content:[{type:'text',text:typeof result==='string'?result:JSON.stringify(result)}],isError:false}};
    }catch(e){return {...response,result:{content:[{type:'text',text:e.message}],isError:true}};}
  }
  return {...response,error:{code:-32601,message:'Method not found'}};
}
export function startStdio({input=process.stdin,output=process.stdout,error=process.stderr,stop=code=>process.exit(code)} = {}) {
  let buffer='', requests=0;
  const maxBytes=2*1024*1024,maxRequests=250;
  const send=r=>{if(r)output.write(JSON.stringify(r)+'\n');};
  input.setEncoding('utf8');
  input.on('data',chunk=>{
    buffer+=chunk;
    if(Buffer.byteLength(buffer)>maxBytes){error.write('Input exceeds 2 MiB; closing.\n');stop(1);return;}
    let n;
    while((n=buffer.indexOf('\n'))!==-1){
      const line=buffer.slice(0,n);buffer=buffer.slice(n+1);if(!line.trim())continue;
      if(++requests>maxRequests){error.write('Session request budget reached; restart server.\n');stop(0);return;}
      let request;
      try{request=JSON.parse(line);}catch{send({jsonrpc:'2.0',id:null,error:{code:-32700,message:'Parse error'}});continue;}
      send(handleRpc(request));
    }
  });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)startStdio();
