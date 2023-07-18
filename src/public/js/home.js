const socketClient = io();

const chatbox = document.getElementById('chatbox');
const chat = document.getElementById('messageLogs');

let user;

Swal.fire({
    title: "Bienvenido a Camba - Chat",
    input: 'text',
    text: "Ingrese su nombre de Usuario",
    inputValidator: (value) => {
        if (!value) {
            return 'Por favor ingrese su nombre'
        }
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    socketClient.emit("authenticated", `Usuario ${user} ha iniciado sesión`);
    //console.log(user);
})

chatbox.addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
        if(chatbox.value.trim().length > 0){
            socketClient.emit("message", {user: user, message:chatbox.value});
            chatbox.value = "";
        }
        
    }
});

socketClient.on("messageHistory", (dataServer) => {
    let messageElmts = "";
    dataServer.forEach(item => {
        messageElmts = messageElmts + `<p>${item.user}: ${item.message}</p> <br/>`;
    });
    chat.innerHTML = messageElmts;
});

socketClient.on("newUser", (data) => {
    if(user){
        //si el usuario esta registrado puede recibir notificaciones
        Swal.fire({
            text: data,
            toast: true,
            position: 'top-right',
        })
    }
});