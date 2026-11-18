import fs from 'node:fs/promises';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const entries=[{"key":"intake","title":"Recruitment 1 — Intake"},{"key":"screen","title":"Recruitment 2 — AI Screening"},{"key":"monitor","title":"Recruitment 3 — Error Handler"},{"key":"hr","title":"HR Policy Assistant"},{"key":"coach","title":"Job Application Coach"}];
export async function portfolioData(){const all=[];for(const entry of entries)all.push({...entry,workflow:JSON.parse(await fs.readFile(path.join(root,'workflows',entry.key+'.json'),'utf8'))});return 'export const portfolioWorkflows='+JSON.stringify(all)+';\n';}
