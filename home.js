const user = JSON.parse(localStorage.getItem("echat_user"));
if(!user) location.href="login.html";

const DB =
"https://bigtrio-ip-default-rtdb.firebaseio.com/Para/usuario/Echat";

const MSG =
"https://mensagens-1-70ee9-default-rtdb.firebaseio.com/Mensagens";

let contatos = JSON.parse(localStorage.getItem("contacts"))||[];

function salvar(){
 localStorage.setItem("contacts",JSON.stringify(contatos));
}

function render(){
 list.innerHTML="";
 contatos.forEach(c=>{
  const d=document.createElement("div");
  d.className="contact";
  d.innerHTML=`<b>${c.nome}</b><br><small>${c.numero}</small>`;
  d.onclick=()=>{
   localStorage.setItem("chat",JSON.stringify(c));
   location.href="chat.html";
  };
  list.appendChild(d);
 });
}

function add(){
 const n=num.value.trim();
 if(!n||n===user.numero) return;

 fetch(`${DB}/${n}.json`)
 .then(r=>r.json())
 .then(d=>{
  if(!d) return alert("Não encontrado");
  contatos.push(d);
  salvar();
  render();
 });
}

function sync(){
 fetch(`${MSG}.json`)
 .then(r=>r.json())
 .then(all=>{
  if(!all) return;
  Object.values(all).forEach(chat=>{
   Object.values(chat).forEach(m=>{
    if(m.from!==user.numero &&
       !contatos.some(c=>c.numero===m.from)){
        contatos.push({nome:m.fromName,numero:m.from});
        salvar(); render();
    }
   });
  });
 });
}

render();
sync();
