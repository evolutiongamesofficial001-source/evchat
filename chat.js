const user = JSON.parse(localStorage.getItem("echat_user"));
const contact = JSON.parse(localStorage.getItem("chat_with"));
if (!user || !contact) location.href = "home.html";

document.getElementById("chatName").innerText = contact.nome;

const chatBox = document.getElementById("chatBox");

const chatId = [user.numero, contact.numero].sort().join("_");
const baseURL =
 "https://mensagens-1-70ee9-default-rtdb.firebaseio.com/Mensagens";

function voltar() {
    location.href = "home.html";
}

function loadMessages() {
    fetch(`${baseURL}/${chatId}.json`)
    .then(r => r.json())
    .then(data => {
        chatBox.innerHTML = "";
        if (!data) return;

        const now = Date.now();

        for (let id in data) {
            const msg = data[id];

            // apagar mensagens com mais de 12 dias
            if (now - msg.time > 1036800000) {
                fetch(`${baseURL}/${chatId}/${id}.json`, {
                    method: "DELETE"
                });
                continue;
            }

            const div = document.createElement("div");
            div.className =
                "msg " + (msg.from === user.numero ? "sent" : "received");

            if (msg.from !== user.numero) {
                const name = document.createElement("div");
                name.className = "msg-name";
                name.innerText = msg.fromName;
                div.appendChild(name);
            }

            const text = document.createElement("div");
            text.innerText = msg.text;
            div.appendChild(text);

            if (msg.from === user.numero) {
                const del = document.createElement("div");
                del.className = "delete-btn";
                del.innerText = "×";
                del.onclick = () => apagarMensagem(id);
                div.appendChild(del);
            }

            chatBox.appendChild(div);
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

function apagarMensagem(id) {
    if (!confirm("Apagar esta mensagem?")) return;

    fetch(`${baseURL}/${chatId}/${id}.json`, {
        method: "DELETE"
    }).then(loadMessages);
}

function sendMsg() {
    const input = document.getElementById("msgInput");
    const text = input.value.trim();
    if (!text) return;

    fetch(`${baseURL}/${chatId}.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            from: user.numero,
            fromName: user.nome,
            text,
            time: Date.now()
        })
    });

    input.value = "";
}

setInterval(loadMessages, 2000);
loadMessages();
