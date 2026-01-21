const firebaseURL =
 "https://bigtrio-ip-default-rtdb.firebaseio.com/Para/usuario/Echat";

let chaveGerada = null;

/* gera chave SOMENTE ao clicar em registrar */
function gerarChavePrivada() {
    return Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 10)
    ).join("");
}

function copiarChave() {
    const input = document.getElementById("privateKey");
    if (!input.value) {
        alert("Nenhuma chave gerada ainda.");
        return;
    }
    input.select();
    document.execCommand("copy");
    alert("Chave copiada! Guarde em local seguro.");
}

function registrar() {
    const nome = document.getElementById("username").value.trim();
    const status = document.getElementById("status");

    if (!nome) {
        status.innerText = "Digite um nome de usuário.";
        status.style.color = "red";
        return;
    }

    // gera a chave AQUI
    chaveGerada = gerarChavePrivada();
    document.getElementById("privateKey").value = chaveGerada;

    const dados = {
        nome: nome,
        numero: chaveGerada,
        criado_em: new Date().toISOString()
    };

    fetch(`${firebaseURL}/${chaveGerada}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
    .then(() => {
        localStorage.setItem("echat_user", JSON.stringify(dados));
        status.innerText =
            "Conta criada! Copie sua chave e clique em Finalizar.";
        status.style.color = "#ffd000";
    })
    .catch(() => {
        status.innerText = "Erro ao registrar.";
        status.style.color = "red";
    });
}

function finalizar() {
    if (!chaveGerada) {
        alert("Registre-se antes de finalizar.");
        return;
    }
    window.location.href = "home.html";
}

function irLogin() {
    window.location.href = "login.html";
}
