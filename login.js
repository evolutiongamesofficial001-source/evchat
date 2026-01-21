const firebaseURL =
 "https://bigtrio-ip-default-rtdb.firebaseio.com/Para/usuario/Echat";

function login() {
    const key = document.getElementById("loginKey").value.trim();
    const status = document.getElementById("status");

    if (!/^\d{12}$/.test(key)) {
        status.innerText = "Chave inválida.";
        status.style.color = "red";
        return;
    }

    fetch(`${firebaseURL}/${key}.json`)
        .then(r => r.json())
        .then(data => {
            if (!data) {
                status.innerText = "Chave não encontrada.";
                status.style.color = "red";
                return;
            }

            localStorage.setItem("echat_user", JSON.stringify(data));
            window.location.href = "home.html";
        })
        .catch(() => {
            status.innerText = "Erro de conexão.";
            status.style.color = "red";
        });
}

function irRegistro() {
    window.location.href = "registro.html";
}
