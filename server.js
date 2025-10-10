const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let sharedText = "Welcome to Snippets by Hamza!"; // shared for everyone

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("update", sharedText);

  socket.on("edit", (newText) => {
    sharedText = newText;
    socket.broadcast.emit("update", sharedText);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

server.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
