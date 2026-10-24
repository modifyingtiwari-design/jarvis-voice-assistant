const {db,getUser,json,setCors}=require('./_lib');
const clean=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
const uuid=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v||'');
module.exports=async(req,res)=>{
 setCors(req,res);res.setHeader('Cache-Control','no-store');if(req.method==='OPTIONS')return res.status(204).end();
 try{const user=await getUser(req);if(!user)return json(res,401,{error:'Sign in to open your private library.'});const token=req.headers.authorization.slice(7),owner=`user_id=eq.${user.id}`;
  if(req.method==='GET'){
   const kind=req.query.kind||'overview';
   if(kind==='messages'){if(!uuid(req.query.id))return json(res,400,{error:'Invalid conversation.'});const conv=await db(`conversations?id=eq.${req.query.id}&${owner}&select=id,title,workspace`,{},token);if(!conv.length)return json(res,404,{error:'Conversation not found.'});const offset=Math.max(0,Math.min(10000,Number(req.query.offset)||0));const rows=await db(`messages?conversation_id=eq.${req.query.id}&${owner}&select=id,role,content,created_at&order=created_at.desc,id.desc&limit=100&offset=${offset}`,{},token);return json(res,200,{conversation:conv[0],messages:rows.reverse(),hasMore:rows.length===100});}
   if(kind==='history'){
    const workspace=clean(req.query.workspace,60),search=clean(req.query.search,100).replace(/[^\p{L}\p{N}\s-]/gu,'');const offset=Math.max(0,Math.min(10000,Number(req.query.offset)||0));
    const rows=await db(`conversations?${owner}&select=id,title,workspace,updated_at&order=updated_at.desc&limit=50&offset=${offset}${workspace?'&workspace=eq.'+encodeURIComponent(workspace):''}${search?'&title=ilike.'+encodeURIComponent('*'+search+'*'):''}`,{},token);return json(res,200,{conversations:rows,hasMore:rows.length===50});
   }
   const [memories,planner,workspaces]=await Promise.all([db(`memory_notes?${owner}&select=id,title,body,deleted_at,updated_at&order=updated_at.desc&limit=200`,{},token),db(`planner_items?${owner}&select=*&order=created_at.desc&limit=200`,{},token),db(`conversations?${owner}&select=workspace&order=updated_at.desc&limit=500`,{},token)]);
   return json(res,200,{memories,planner,workspaces:[...new Set(workspaces.map(c=>c.workspace))]});
  }
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
  const body=req.body||{},kind=body.kind,id=body.id;if(id&&!uuid(id))return json(res,400,{error:'Invalid item.'});
  if(kind==='memory'){
   if(body.action==='forget'||body.action==='restore'){if(!id)return json(res,400,{error:'Choose a memory.'});const rows=await db(`memory_notes?id=eq.${id}&${owner}`,{method:'PATCH',body:JSON.stringify({deleted_at:body.action==='forget'?new Date().toISOString():null,updated_at:new Date().toISOString()})},token);return json(res,200,{item:rows[0]});}
   const title=clean(body.title,120)||'Memory',content=clean(body.body,4000);if(!content)return json(res,400,{error:'Write a memory first.'});
   const rows=await db(id?`memory_notes?id=eq.${id}&${owner}`:'memory_notes',{method:id?'PATCH':'POST',body:JSON.stringify({...(id?{}:{user_id:user.id}),title,body:content,updated_at:new Date().toISOString()})},token);return json(res,200,{item:rows[0]});
  }
  if(kind==='planner'){
   const values={};if(typeof body.title==='string'){values.title=clean(body.title,300);if(!values.title)return json(res,400,{error:'Write a task first.'});}if(typeof body.done==='boolean')values.done=body.done;if(body.due_date===null||/^\d{4}-\d{2}-\d{2}$/.test(body.due_date||''))values.due_date=body.due_date;if(typeof body.workspace==='string')values.workspace=clean(body.workspace,60)||'Personal';
   if(!id&&!values.title)return json(res,400,{error:'Task title required.'});const rows=await db(id?`planner_items?id=eq.${id}&${owner}`:'planner_items',{method:id?'PATCH':'POST',body:JSON.stringify({...values,...(id?{}:{user_id:user.id})})},token);return json(res,200,{item:rows[0]});
  }
  if(kind==='conversation'&&id){const title=clean(body.title,120),workspace=clean(body.workspace,60);if(!title&&!workspace)return json(res,400,{error:'A title or workspace is required.'});const rows=await db(`conversations?id=eq.${id}&${owner}`,{method:'PATCH',body:JSON.stringify({...(title?{title}:{}),...(workspace?{workspace}:{}),updated_at:new Date().toISOString()})},token);return json(res,200,{item:rows[0]});}
  return json(res,400,{error:'Unknown library action.'});
 }catch{return json(res,500,{error:'Your library could not be updated. Please retry.'});}
};