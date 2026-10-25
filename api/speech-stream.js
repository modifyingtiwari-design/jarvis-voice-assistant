const {db,getUser,json,requireConfig,setCors}=require('./_lib');
const {once}=require('node:events');
const languages=new Set(['en-IN','hi-IN','mr-IN','bn-IN','ta-IN','te-IN','kn-IN','ml-IN','gu-IN','pa-IN','od-IN']);
module.exports=async(req,res)=>{
 setCors(req,res);res.setHeader('Cache-Control','no-store, no-transform');
 if(req.method==='OPTIONS')return res.status(204).end();
 if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),50000);let reader,usageSave;
 const disconnect=()=>{if(!res.writableEnded)controller.abort();};res.on('close',disconnect);
 try{
  requireConfig(['SARVAM_API_KEY']);const user=await getUser(req);if(!user)return json(res,401,{error:'Sign in to use AI Suzie voice.'});
  const token=req.headers.authorization.slice(7),text=typeof req.body?.text==='string'?req.body.text.trim():'';
  if(!text||text.length>2000)return json(res,400,{error:'Speech text must contain 1–2000 characters.'});
  const since=encodeURIComponent(new Date(Date.now()-3600000).toISOString());
  const usage=await db(`usage_events?user_id=eq.${user.id}&event_type=eq.text_to_speech&created_at=gte.${since}&select=id&limit=121`,{},token);
  if(usage.length>=120)return json(res,429,{error:'Hourly voice limit reached. Try again shortly.'});
  const model=req.body.model==='bulbul:v3'?'bulbul:v3':'bulbul:v4-flash';
  const legacy=new Set(['shubh','simran','ishita','sunny','ratan','ritu','priya','roopa','dev']);
  const speaker=model==='bulbul:v3'?(legacy.has(req.body.speaker)?req.body.speaker:'shubh'):(/^[a-z0-9_]{3,80}$/.test(req.body.speaker||'')?req.body.speaker:'shubh_enhi_ads');
  const response=await fetch('https://api.sarvam.ai/text-to-speech/stream',{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json','api-subscription-key':process.env.SARVAM_API_KEY},body:JSON.stringify({text,model,speaker,language_code:languages.has(req.body.language_code)?req.body.language_code:'en-IN',pace:Math.min(1.2,Math.max(.8,Number(req.body.pace)||1)),speech_sample_rate:24000,output_audio_codec:'wav',enable_preprocessing:true})});
  if(!response.ok){await response.body?.cancel();return json(res,response.status>=500?502:response.status,{error:`Sarvam streaming speech failed (HTTP ${response.status}).`});}
  if(!response.body)throw Error('No audio stream.');
  // Record usage concurrently; the first sound does not wait on this database write.
  usageSave=db('usage_events',{method:'POST',body:JSON.stringify({user_id:user.id,event_type:'text_to_speech'})},token).catch(()=>{console.warn('Speech usage write failed.');});
  res.setHeader('Content-Type','audio/wav');res.setHeader('X-Accel-Buffering','no');res.flushHeaders?.();
  reader=response.body.getReader();let bytes=0;
  while(true){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.length;if(bytes>16000000)throw Error('Speech stream too large.');if(!res.write(Buffer.from(chunk.value)))await once(res,'drain',{signal:controller.signal});}
  await usageSave;res.end();
 }catch(error){if(!res.destroyed){if(res.headersSent)res.destroy();else json(res,502,{error:error.name==='AbortError'?'Speech request timed out. Please retry.':'Speech stream could not start. Please retry.'});}}
 finally{clearTimeout(timer);res.off('close',disconnect);controller.abort();if(reader){try{await reader.cancel();}catch{}reader.releaseLock();}if(usageSave)await usageSave;}
};