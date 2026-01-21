const user = JSON.parse(localStorage.getItem("echat_user"));
if (!user) location.href = "login.html";

const contactsDiv = document.getElementById("contacts");
let contacts = JSON.parse(localStorage.getItem("echat_contacts")) || [];

function renderContacts() {
    contactsDiv.innerHTML = "";

    contacts.forEach(c => {
        const div = document.createElement("div");
        div.className = "contact";
        div.innerHTML = `
            <b>${c.nome}</b><br>
            <small>${c.numero}</small>
        `;

        div.onclick = () => {
            localStorage.setItem("chat_with", JSON.stringify(c));
            location.href = "chat.html";
        };

        contactsDiv.appendChild(div);
    });
}

function addContact() {
    const num = document.getElementById("addNumber").value.trim();
    if (!num || num === user.numero) {
        alert("Número inválido");
        return;
    }

    fetch(`https://bigtrio-ip-default-rtdb.firebaseio.com/Para/usuario/Echat/${num}.json`)
    .then(r => r.json())
    .then(data => {
        if (!data) {
            alert("Usuário não encontrado");
            return;
        }

        if (contacts.some(c => c.numero === num)) return;

        contacts.push({
            nome: data.nome,
            numero: num
        });

        localStorage.setItem("echat_contacts", JSON.stringify(contacts));
        renderContacts();
    });
}

renderContacts();
