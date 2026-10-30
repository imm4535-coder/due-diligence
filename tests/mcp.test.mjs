import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PassThrough} from 'node:stream';
import {callTool,handleRpc,toolDefinitions,startStdio} from '../src/mcp.mjs';
test('MCP catalog and create return usable results',()=>{assert.equal(callTool('diligence_catalog').length,12);const c=callTool('diligence_create_case',{domains:['finance']});assert.equal(callTool('diligence_assess',{case:c,today:'2026-10-30'}).unknown,3);assert.ok(callTool('diligence_report',{case:c}).includes('Decision gate'));});
test('tool schemas and runtime reject bad inputs',()=>{assert.equal(toolDefinitions.length,4);for(const [name,args] of [['fake',{}],['diligence_catalog',{anything:1}],['diligence_create_case',{title:2}],['diligence_create_case',{domains:['fake']}],['diligence_assess',{}],['diligence_assess',{case:null}],['diligence_assess',{case:callTool('diligence_create_case'),freshnessDays:99999}]])assert.throws(()=>callTool(name,args));});
test('JSON-RPC handles initialize, notifications and errors',()=>{assert.equal(handleRpc({jsonrpc:'2.0',id:1,method:'initialize'}).result.protocolVersion,'2025-06-18');assert.equal(handleRpc({jsonrpc:'2.0',method:'notifications/initialized'}),null);assert.equal(handleRpc({jsonrpc:'2.0',id:2,method:'tools/list'}).result.tools.length,4);assert.equal(handleRpc({jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'fake'}}).result.isError,true);assert.equal(handleRpc({jsonrpc:'2.0',id:4,method:'fake'}).error.code,-32601);assert.equal(handleRpc(null).error.code,-32600);});
test('stdio transport emits valid JSON only and survives parse error',()=>{
  const lines=[JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize'}),'not-json',JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'}),JSON.stringify({jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'diligence_catalog',arguments:{}}})];
  const input=new PassThrough(),output=new PassThrough(),error=new PassThrough();let stdout='',stderr='';output.on('data',d=>stdout+=d);error.on('data',d=>stderr+=d);
  startStdio({input,output,error,stop:()=>assert.fail('Unexpected stop')});
  const stream=lines.join('\n')+'\n';input.write(stream.slice(0,20));input.end(stream.slice(20));
  const out=stdout.trim().split('\n').map(JSON.parse);assert.equal(out.length,3);assert.equal(out[1].error.code,-32700);assert.equal(JSON.parse(out[2].result.content[0].text).length,12);assert.equal(stderr,'');
});
