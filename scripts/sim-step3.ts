import { RISK_FIELDS, QUESTIONS, LIKERT, computeContextualRisk, computeReadiness, computeProfile, applyPolicyGuardrail, mfaLabelToLevel, levelRank, type MFALevel, type OrgPolicy } from '../src/lib/decisionEngine';
// seeded RNG
let s=20261005; const rnd=()=>{s=(s*1664525+1013904223)>>>0;return s/2**32;};
// 1. exhaustive contextual-risk space
const fields=RISK_FIELDS.map(f=>f.options.map(o=>o.value));
let combos=0,high=0,low=0,mismatch=0,scoreMin=1e9,scoreMax=-1;
const idx=new Array(fields.length).fill(0);
function rec(i:number,ans:Record<string,string>){
  if(i===fields.length){combos++;const r=computeContextualRisk(ans);r.level==='HIGH'?high++:low++;scoreMin=Math.min(scoreMin,r.score);scoreMax=Math.max(scoreMax,r.score);
    // monotonic sanity: field-level 'High Risk' count 0 must be LOW? record contradictions
    return;}
  for(const v of fields[i]) rec(i+1,{...ans,[RISK_FIELDS[i].id]:v});
}
rec(0,{});
console.log('RISK combos',combos,'HIGH',high,'LOW',low,'score range',scoreMin,scoreMax);
// 2. full pipeline random simulation
const policies:MFALevel[]=['standard','step-up','phishing-resistant'];
const N=100000; const ruleCount:Record<string,number>={R1:0,R2:0,R3:0,R4:0}; let weaker=0,undefinedRule=0,guardApplied=0,finalCount:Record<string,number>={};
const t0=performance.now();
for(let n=0;n<N;n++){
  const ans:Record<string,string>={}; RISK_FIELDS.forEach((f,i)=>{ans[f.id]=fields[i][Math.floor(rnd()*fields[i].length)];});
  const ca:Record<number,string>={}; QUESTIONS.forEach((_,i)=>{ca[i]=LIKERT[Math.floor(rnd()*5)];});
  const r=computeContextualRisk(ans), rd=computeReadiness(ca), p=computeProfile(r.level,rd.level);
  if(!p.rule){undefinedRule++;continue;}
  ruleCount[p.rule.id]++;
  const pol:OrgPolicy={minMFA:policies[Math.floor(rnd()*3)],sensitiveResourceMFA:'standard',privilegedRoleMFA:'standard',policyStatus:'active'};
  const base=mfaLabelToLevel(p.rule.mfa); const g=applyPolicyGuardrail(base,pol);
  if(levelRank[g.finalLevel]<levelRank[base]||levelRank[g.finalLevel]<levelRank[pol.minMFA])weaker++;
  if(g.guardrailApplied)guardApplied++; finalCount[g.finalLevel]=(finalCount[g.finalLevel]||0)+1;
}
const t1=performance.now();
console.log('PIPELINE runs',N,'rules',ruleCount,'undefined',undefinedRule,'weaker-than-policy-or-rule',weaker,'guardrail applied',guardApplied,'final',finalCount);
console.log('time total ms',(t1-t0).toFixed(1),'per decision us',((t1-t0)/N*1000).toFixed(2));
// 3. boundary tests
const lo=(v:string)=>LIKERT.indexOf(v);
for(const k of [0,1,2,3,4]){const ca:Record<number,string>={};QUESTIONS.forEach((_,i)=>ca[i]=LIKERT[k]);const r=computeReadiness(ca);console.log('uniform',LIKERT[k],r.pct,r.level);}
// readiness threshold: how many 'Agree'(3) vs others cross 50
for(let a=0;a<=16;a++){const ca:Record<number,string>={};QUESTIONS.forEach((_,i)=>ca[i]=i<a?'Agree':'Neutral');const r=computeReadiness(ca);if(a%4===0)console.log('agree count',a,'rest neutral ->',r.pct,r.level);}
// partial answers
console.log('empty',computeReadiness({}));
console.log('4 of 16 Strongly Agree',computeReadiness({0:'Strongly Agree',1:'Strongly Agree',2:'Strongly Agree',3:'Strongly Agree'}));
// determinism
const a1=computeContextualRisk({role:'Manager',network:'Public Wi-Fi',location:'Unknown',device:'Unregistered Device',sensitivity:'Confidential',login:'Unfamiliar sign-in location'});
console.log('default example',a1.score,a1.level);
