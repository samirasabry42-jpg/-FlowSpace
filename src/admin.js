const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function adminApi(request,env,send=fetch){
 const url=new URL(request.url);const kind=url.pathname.split('/').pop();
 if(!['screening','monitoring'].includes(kind))return reply({error:'Unknown dashboard'},404);
 if(request.method!=='POST')return reply({error:'POST required'},405);
 if(!env.ADMIN_ACCESS_CODE||!env.N8N_WEBHOOK_TOKEN)return reply({error:'Dashboard setup is incomplete. The owner needs to configure the admin connection.'},503);
 const supplied=request.headers.get('X-Admin-Access')||'';
 const enc=new TextEncoder();const hashes=await Promise.all([supplied,env.ADMIN_ACCESS_CODE].map(v=>crypto.subtle.digest('SHA-256',enc.encode(v))));let diff=0;const a=new Uint8Array(hashes[0]),b=new Uint8Array(hashes[1]);for(let i=0;i<a.length;i++)diff|=a[i]^b[i];
 if(diff)return reply({error:'The admin code is incorrect. Visitor codes do not unlock dashboards.'},401);
 const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return reply({error:'Origin not allowed'},403);
 const endpoint=env[kind==='screening'?'N8N_SCREENING_DASHBOARD_URL':'N8N_MONITORING_DASHBOARD_URL'];
 if(!endpoint)return reply({error:'The dashboard endpoint is not configured.'},503);
 let parsed;try{parsed=new URL(endpoint);}catch{return reply({error:'Invalid dashboard endpoint'},503);}
 if(parsed.protocol!=='https:'||parsed.username||parsed.password)return reply({error:'HTTPS dashboard endpoint required'},503);
 try{const upstream=await send(endpoint,{method:'POST',headers:{'Content-Type':'application/json','X-FlowSpace-Token':env.N8N_WEBHOOK_TOKEN,'ngrok-skip-browser-warning':'1'},body:'{}',redirect:'manual'});
 if(!upstream.ok)return reply({error:'The dashboard workflow returned HTTP '+upstream.status+'. Check n8n publication and execution history.'},502);
 const raw=await upstream.text();if(raw.length>1000000)return reply({error:'Dashboard response is too large'},502);
 let data=JSON.parse(raw);if(Array.isArray(data))data=data[0];if(!data||data.kind!==kind||!Array.isArray(data.rows))return reply({error:'Unexpected dashboard data. Import the dashboard workflow adapter.'},502);
 return reply({kind,summary:data.summary||{},rows:data.rows.slice(0,200),updatedAt:data.updatedAt});
 }catch{return reply({error:'Cannot reach the dashboard. Keep n8n and ngrok running.'},504);}
}
