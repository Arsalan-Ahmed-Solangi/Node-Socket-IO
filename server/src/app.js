//****Importing Packages*******//
import express from 'express';
import dotenv from 'dotenv';
import {Server, Socket} from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
const app = express();
const server = new createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
        credentials:true,
    }
});
dotenv.config();
const port = process.env.PORT || 1000;


//***Middlewares*****//
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));



//***SocketIOServer*******//
io.on("connection",(socket)=>{
    console.log(`Socket User Connected!`)
    console.log("Id",socket.id);

    // socket.broadcast.emit("Welcome",`Joined the Server : ${socket.id} `);
    // socket.emit("Welcome",`Hi Arsalan Socket Server Emit ${socket.id} `);

    socket.on("message",(data)=>{
        console.log(data);
        io.to(data.room).emit("receive-message",data) //**Room Data Send To Particular One***//
    })

    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id)
    })
} )


//***API*****//
app.get("/", (req, res) => {
    res.send("WORKING");
})



//**Listen****//
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})