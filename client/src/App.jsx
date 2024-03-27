import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button } from "@mui/material";

function App() {
  const socket = useMemo( ()=> io("http://localhost:5000/"),[] ) ;
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId,setSocketId] = useState("");
  const [messages,setMessages] = useState([]);

  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message",{message,room});
    setMessage(""); 
    setRoom("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("Connected", socket.id);
    });

    socket.on("receive-message",(data)=>{
      console.log("Message Recived",data)
      setMessages( (messages) => [...messages,data] )
    })
    socket.on("Welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h3" marginTop={5} component="div" gutterBottom>
        WELCOME TO SOCKET IO
      </Typography>
      {
        socketId
      }
      <form onSubmit={handleSubmit}>
        
        <TextField
          id="outlined-basic"
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

<TextField
          id="outlined-basic"
          label="Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">  
          Send Message
        </Button>
      </form>

      <div>
        {messages.map((m, i) => (
          <p key={i}>{m.message}</p>
        ))}
      </div>
    </Container>
  );
}

export default App;
