import {mkdir,cp,readFile,writeFile} from 'node:fs/promises';

export async function prepareSplitPlugins(){
  const rows=[
    ['scanner','Due Diligence Scanner','Map decision-changing checks','Plan a bounded investigation from supplied material: scope, hypotheses, evidence targets, outcome branches, priorities and stop rules. Planning only; no external research.','สแกนเรื่องนี้และวางแผนการตรวจ โดยยังไม่สืบค้นภายนอก ระบุแต่ละผลที่อาจพบว่าจะเปลี่ยนการตัดสินใจอย่างไร'],
    ['investigator','Due Diligence Investigator','Investigate a bounded plan','Execute a supplied investigation plan using authorized evidence and available read-only tools. Return traceable findings, decision effects, budget use and replan requests.','ตรวจตามแผนจาก Due Diligence Scanner ภายในขอบเขตและงบที่กำหนด ส่งหลักฐาน ผลต่อการตัดสินใจ และประเด็นที่ต้องปรับแผน']
  ];
  for(const [role,displayName,shortDescription,description,defaultPrompt] of rows){
    const name='due-diligence-'+role;
    const skill=`skills/${name}`;
    await mkdir(`${skill}/references`,{recursive:true});
    for(const filename of ['handoff-contract.md','plan-example.json','result-example.json'])await cp(`workflow/${filename}`,`${skill}/references/${filename}`);
    await cp('skills/due-diligence/references/domains.md',`${skill}/references/domains.md`);
    await cp('skills/due-diligence/references/evidence-rules.md',`${skill}/references/evidence-rules.md`);
    await cp('LICENSE',`${skill}/LICENSE`);
    const root=`release/plugins/${name}`;
    await mkdir(`${root}/skills`,{recursive:true});await cp(skill,`${root}/skills/${name}`,{recursive:true});await cp('LICENSE',`${root}/LICENSE`);
    const manifest={$schema:'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',name,version:'0.1.0',description,license:'MIT',author:{name:'Due Diligence contributors'},keywords:['due-diligence',role,'decision-making','evidence'],extensions:{'com.openai':{interface:{displayName,shortDescription,longDescription:description,developerName:'Due Diligence contributors',capabilities:[],defaultPrompt}}}};
    if(shortDescription.length>30)throw new Error('Plugin subtitle exceeds 30 characters');
    await writeFile(`${root}/plugin.json`,JSON.stringify(manifest,null,2)+'\n');
  }
}
