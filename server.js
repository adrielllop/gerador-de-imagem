const express=require("express"),path=require("path"),crypto=require("crypto");
const app=express();app.use(express.json({limit:"2mb"}));
const env=k=>{if(!process.env[k])throw Error(`Configure ${k} nas variáveis da Vercel.`);return process.env[k]};
const discount=n=>n>=100?15:n>=50?12:n>=25?8:n>=10?5:0;
const validDevice=s=>typeof s==="string"&&/^[0-9a-f-]{36}$/i.test(s);
app.get("/style.css",(req,res)=>res.sendFile(path.join(__dirname,"style.css")));
app.get("/app.js",(req,res)=>res.type("application/javascript").sendFile(path.join(__dirname,"app.js")));
app.post("/api/generate",async(req,res)=>{try{
  const {prompt,size="1024x1024",quality="medium"}=req.body||{};
  if(typeof prompt!=="string"||prompt.trim().length<5||prompt.length>4000)
    return res.status(400).json({error:"Descreva melhor a imagem."});
  const dimensions={
    "1024x1024":{width:1024,height:1024},
    "1024x1536":{width:768,height:1152},
    "1536x1024":{width:1152,height:768}
  };
  if(!dimensions[size]||!["medium","high"].includes(quality))
    return res.status(400).json({error:"Formato de imagem inválido."});
  const {InferenceClient}=await import("@huggingface/inference");
  const hf=new InferenceClient(env("HF_TOKEN"));
  const blob=await hf.textToImage({
    model:"black-forest-labs/FLUX.1-dev",
    inputs:prompt.trim(),
    parameters:dimensions[size]
  });
  const image=Buffer.from(await blob.arrayBuffer()).toString("base64");
  if(!image)throw new Error("A IA não retornou a imagem.");
  res.json({image});
}catch(e){
  console.error("Falha privada na geração Hugging Face:",{status:e.status,code:e.code,message:e.message});
  const status=Number(e.status)||500;
  let message="Não foi possível gerar a imagem agora. Tente novamente mais tarde.";
  if(status===401||status===403)message="O serviço de imagens recusou o token. O administrador precisa revisar HF_TOKEN e a permissão Inference.";
  else if(status===429)message="O serviço de imagens atingiu o limite disponível. Tente novamente mais tarde ou verifique os créditos do Hugging Face.";
  else if(status===503)message="O modelo de imagens está inicializando. Aguarde um pouco e tente novamente.";
  res.status(500).json({error:message});
}});
app.post("/api/create-payment",async(req,res)=>{try{let {credits:n,deviceId,email}=req.body||{};if(!Number.isInteger(n)||n<1||n>10000||!validDevice(deviceId)||typeof email!=="string"||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:"Informe e-mail válido e quantidade inteira de 1 a 10.000."});let d=discount(n),total=Math.round(n*(1-d/100)*100)/100,ref=`PIXELIA:${deviceId}:${n}:${crypto.randomUUID()}`,idempotency=crypto.randomUUID();let r=await fetch("https://api.mercadopago.com/v1/payments",{method:"POST",headers:{Authorization:`Bearer ${env("MERCADOPAGO_ACCESS_TOKEN")}`,"Content-Type":"application/json","X-Idempotency-Key":idempotency},body:JSON.stringify({transaction_amount:total,description:`${n} créditos PixelIA${d?` (${d}% de desconto)`:""}`,payment_method_id:"pix",external_reference:ref,date_of_expiration:new Date(Date.now()+30*60*1000).toISOString(),payer:{email}})});let j=await r.json();if(!r.ok)throw Error(j.message||j.cause?.[0]?.description||"Mercado Pago não conseguiu gerar o Pix.");let tx=j.point_of_interaction?.transaction_data;if(!tx?.qr_code||!tx?.qr_code_base64)throw Error("Mercado Pago não retornou o QR Code Pix.");res.json({paymentId:String(j.id),credits:n,total,qrCode:tx.qr_code,qrCodeBase64:tx.qr_code_base64,status:j.status})}catch(e){console.error(e);res.status(500).json({error:e.message||"Erro ao gerar Pix."})}});
app.post("/api/verify-payment",async(req,res)=>{try{let {paymentId,deviceId}=req.body||{};if(!/^\d+$/.test(String(paymentId||""))||!validDevice(deviceId))return res.status(400).json({error:"Dados de pagamento inválidos."});let r=await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,{headers:{Authorization:`Bearer ${env("MERCADOPAGO_ACCESS_TOKEN")}`}}),p=await r.json();if(!r.ok)throw Error("Não foi possível consultar o pagamento.");let ref=String(p.external_reference||"").split(":");if(ref.length!==4||ref[0]!=="PIXELIA"||ref[1]!==deviceId)return res.status(403).json({error:"Este Pix não pertence a este dispositivo."});let n=Number(ref[2]);if(!Number.isInteger(n)||n<1||n>10000)return res.status(400).json({error:"Recarga inválida."});let d=discount(n),expected=Math.round(n*(1-d/100)*100)/100;if(Math.round(Number(p.transaction_amount)*100)!==Math.round(expected*100))return res.status(400).json({error:"O valor pago não corresponde à recarga."});res.json({approved:p.status==="approved",credits:p.status==="approved"?n:0,status:p.status})}catch(e){console.error(e);res.status(500).json({error:e.message||"Falha ao verificar pagamento."})}});
app.all("/api/webhook",async(req,res)=>{try{let id=req.query["data.id"]||req.query.id||req.body?.data?.id||req.body?.id;if(!id)return res.status(200).json({received:true});let r=await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${env("MERCADOPAGO_ACCESS_TOKEN")}`}});if(!r.ok)throw Error("Consulta Mercado Pago falhou.");res.status(200).json({received:true})}catch(e){console.error(e);res.status(500).json({error:"Webhook temporariamente indisponível."})}});
app.get("/",(req,res)=>res.sendFile(path.join(__dirname,"index.html")));
app.get(/.*/,(req,res)=>res.sendFile(path.join(__dirname,"index.html")));
module.exports=app;
