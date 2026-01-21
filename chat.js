const user=JSON.parse(localStorage.getItem("echat_user"));
const c=JSON.parse(localStorage.getItem("chat"));
if(!user||!c) location.href="home.html";

name.innerText=c.nome;

const CHAT=[user.numero,c.numero].sort().join("_");
const DB=
"https://mensagens-1-70ee9-default-rtdb.firebaseio.com/Mensagens";

function back(){location.href="home.html";}

function load(){
 fetch(`${DB}/${CHAT}.json`)
 .then(r=>r.json())
 .then(d=>{
  msgs.innerHTML="";
  if(!d) return;
  const now=Date.now();
  Object.entries(d).forEach(([id,m])=>{
   if(now-m.time>1036800000){
    fetch(`${DB}/${CHAT}/${id}.json`,{method:"DELETE"});
    return;
   }
   const div=document.createElement("div");
   div.className="msg "+(m.from===user.numero?"me":"him");
   div.innerText=m.text;
   if(m.from===user.numero){
    div.onclick=()=>confirm("Apagar?")&&
     fetch(`${DB}/${CHAT}/${id}.json`,{method:"DELETE"});
   }
   msgs.appendChild(div);
  });
  msgs.scrollTop=msgs.scrollHeight;
 });
}

function send(){
 if(!text.value) return;
 fetch(`${DB}/${CHAT}.json`,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
   from:user.numero,
   fromName:user.nome,
   text:text.value,
   time:Date.now()
  })
 });
 text.value="";
}

setInterval(load,2000);
load();
