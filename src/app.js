import express from 'express';
import { engine } from 'express-handlebars';
import { __dirname } from './utils.js';
import path from 'path';
import { viewsRouter } from './routes/views.routes.js';
import { Server } from 'socket.io';

const port = 8080;
const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de handlebars
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', viewsRouter);

// Servidor de express
const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

// Servidor Websocket
const io = new Server(httpServer);


let mesagges = [];
//socketSerrver
io.on('connection', (socket) => {
    io.emit("messageHistory", mesagges);

    socket.on("authenticated", (msg) => {
        io.emit("messageHistory", mesagges);
        socket.broadcast.emit("newUser", msg);    
    });

    console.log('Cliente conectado');
    //recibir mensaje del cliente
    socket.on("message", (data) => {
        console.log({data});
        mesagges.push(data);

        // cada vez que se envia un mensaje se va a enviar a todos los clientes
        io.emit("messageHistory", mesagges);
    });
});

